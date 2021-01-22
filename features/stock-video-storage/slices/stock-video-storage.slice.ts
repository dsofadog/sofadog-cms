import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { create as createAPI } from 'features/stock-video-storage/api/create.api'
import { query as queryAPI } from 'features/stock-video-storage/api/query.api'
import { remove as removeAPI } from 'features/stock-video-storage/api/remove.api'
import { AppThunk } from 'store'
import _ from 'lodash'

interface StockVideoStorageState {
    videoFormIsVisible: boolean;
    videos: any[];
    progressBarLoading: boolean;
    scrollLoading: boolean;
    scrollLoadingMessage: string | null;
    fetchErrorMessage: string | null;
    notificationErrorMessage: string | null;
}

const initialState: StockVideoStorageState = {
    videoFormIsVisible: false,
    videos: [],
    progressBarLoading: false,
    scrollLoading: false,
    scrollLoadingMessage: null,
    fetchErrorMessage: null,
    notificationErrorMessage: null
}

const stockVideoStorage = createSlice({
    name: 'stockVideoStorage',
    initialState,
    reducers: {
        progressBarLoadingStart(state: StockVideoStorageState) {
            state.progressBarLoading = true
        },
        progressBarLoadingEnd(state: StockVideoStorageState) {
            state.progressBarLoading = false
        },
        scrollLoadingStart(state: StockVideoStorageState, action: PayloadAction<string>) {
            state.scrollLoading = true
            state.scrollLoadingMessage = action.payload
            state.fetchErrorMessage = null
            state.notificationErrorMessage = null
        },
        scrollLoadingEnd(state: StockVideoStorageState, action: PayloadAction<string>) {
            state.scrollLoading = false
            state.scrollLoadingMessage = null
        },
        videoLoadingStart(state: StockVideoStorageState, action: PayloadAction<string>) {
            const video = state.videos.find(video => video.id === action.payload)
            video.loading = true
        },
        videoLoadingEnd(state: StockVideoStorageState, action: PayloadAction<string>) {
            const video = state.videos.find(video => video.id === action.payload)
            if(video){
                delete video.loading
            }
        },
        showVideoForm(state: StockVideoStorageState) {
            state.videoFormIsVisible = true
        },
        hideVideoForm(state: StockVideoStorageState) {
            state.videoFormIsVisible = false
        },
        addVideo(state: StockVideoStorageState, action: PayloadAction<any>) {
            state.videos = [action.payload, ...state.videos]
        },
        setVideos(state: StockVideoStorageState, action: PayloadAction<any>) {
            state.videos = [...action.payload]
        },
        concatVideos(state: StockVideoStorageState, action: PayloadAction<any>) {
            state.videos = [...state.videos, ...action.payload]
        },
        removeVideo(state: StockVideoStorageState, action: PayloadAction<any>) {
            state.videos = state.videos.filter(video => video.id !== action.payload.id)
        },
        requestFailed(state: StockVideoStorageState, action: PayloadAction<any>) {
            const { error, type } = action.payload
            state.progressBarLoading = false
            state.scrollLoading = false
            state.scrollLoadingMessage = null
            state.fetchErrorMessage = type === 'fetch' ? 'Something went wrong' : null
            state.notificationErrorMessage = type === 'notification' ? (error.response?.data?.message || 'Something went wrong') : null
        },
        reset(state: StockVideoStorageState) {
            state.videos = []
            state.progressBarLoading = false
            state.scrollLoading = false
            state.scrollLoadingMessage = null
            state.fetchErrorMessage = null
            state.notificationErrorMessage = null
        }
    }
})

export const {
    progressBarLoadingStart,
    progressBarLoadingEnd,
    scrollLoadingStart,
    scrollLoadingEnd,
    videoLoadingStart,
    videoLoadingEnd,
    showVideoForm,
    hideVideoForm,
    addVideo,
    setVideos,
    concatVideos,
    removeVideo,
    requestFailed,
    reset
} = stockVideoStorage.actions

export default stockVideoStorage.reducer

export const create = (video: any, tags: string[]): AppThunk => async dispatch => {
    try {

        dispatch(progressBarLoadingStart())

        const createRes = await createAPI(video, tags)

        dispatch(addVideo(createRes.stock_video))

        dispatch(hideVideoForm())

        dispatch(progressBarLoadingEnd())

    } catch (error) {
        dispatch(requestFailed({ type: 'notification', error }))
    }
}

export const query = (params: any): AppThunk => async dispatch => {
    try {

        const scrollLoadingMessage = `Loading more videos...`

        dispatch(scrollLoadingStart(scrollLoadingMessage))

        const queryRes = await queryAPI(params)

        dispatch(concatVideos(queryRes.stock_videos))

        dispatch(scrollLoadingEnd())

    } catch (error) {
        dispatch(requestFailed({ type: 'fetch', error }))
    }
}

export const remove = (id: any): AppThunk => async dispatch => {
    try {

        dispatch(videoLoadingStart(id))

        const deleteRes = await removeAPI(id)

        dispatch(removeVideo(deleteRes.stock_video))

    } catch (error) {
        dispatch(requestFailed({ type: 'notification', error }))
    } finally {
        dispatch(videoLoadingEnd(id))
    }
}