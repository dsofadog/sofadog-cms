import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { changeOrder as changeOrderAPI } from 'features/news-item/api/change-order.api'
import { changeStatus as changeStatusAPI } from 'features/news-item/api/change-status.api'
import { create as createAPI } from 'features/news-item/api/create.api'
import { query as queryAPI } from 'features/news-item/api/query.api'
import { read as readAPI } from 'features/news-item/api/read.api'
import { remove as removeAPI } from 'features/news-item/api/remove.api'
import { update as updateAPI } from 'features/news-item/api/update.api'
import { uploadVideo as uploadVideoAPI } from 'features/news-item/api/upload-video'
import { AppThunk } from 'store'
import _ from 'lodash'
import moment from 'moment'

interface NewsItemState {
    createFormIsVisible: boolean;
    newsItems: any[];
    editingNewsItemId: string | null
    error: string | null;
    progressBarLoading: boolean;
    scrollLoading: boolean;
    scrollLoadingMessage: string | null;
}

const initialState: NewsItemState = {
    createFormIsVisible: false,
    newsItems: [],
    editingNewsItemId: null,
    error: null,
    progressBarLoading: false,
    scrollLoading: false,
    scrollLoadingMessage: null
}

const newsItem = createSlice({
    name: 'newsItem',
    initialState,
    reducers: {
        progressBarLoadingStart(state: NewsItemState) {
            state.progressBarLoading = true
        },
        progressBarLoadingEnd(state: NewsItemState) {
            state.progressBarLoading = false
        },
        scrollLoadingStart(state: NewsItemState, action: PayloadAction<string>) {
            state.error = null
            state.scrollLoading = true
            state.scrollLoadingMessage = action.payload
        },
        scrollLoadingEnd(state: NewsItemState, action: PayloadAction<string>) {
            state.scrollLoading = false
            state.scrollLoadingMessage = null
        },
        showCreateForm(state: NewsItemState) {
            state.createFormIsVisible = true
        },
        hideCreateForm(state: NewsItemState) {
            state.createFormIsVisible = false
        },
        swapNewsItem(state: NewsItemState, action: PayloadAction<{ id: string, direction: string }>) {
            const { id, direction } = action.payload
            
            const aIndex = state.newsItems.findIndex(newsItem => newsItem.id === id)
            let bIndex = direction === 'decrement_ordinal'
                ? aIndex + 1
                : aIndex - 1

            if(state.newsItems[aIndex] && state.newsItems[bIndex]){
                const newsItemA = state.newsItems[aIndex]
                const newsItemB = state.newsItems[bIndex]
    
                state.newsItems[aIndex] = newsItemB
                state.newsItems[bIndex] = newsItemA
            }
            
        },
        addNewsItem(state: NewsItemState, action: PayloadAction<any>) {
            state.newsItems = [action.payload, ...state.newsItems]
        },
        setNewsItems(state: NewsItemState, action: PayloadAction<any>){
            state.newsItems = [...action.payload]
        },
        concatNewsItems(state: NewsItemState, action: PayloadAction<any>) {
            state.newsItems = [...state.newsItems, ...action.payload]
        },
        updateNewsItem(state: NewsItemState, action: PayloadAction<any>) {
            console.log('action', action)
            const matchedNewsItem = state.newsItems.find(newsItem => newsItem.id === action.payload.id)
            _.assignIn(matchedNewsItem, action.payload)
        },
        removeNewsItem(state: NewsItemState, action: PayloadAction<any>) {
            state.newsItems = state.newsItems.filter(newsItem => newsItem.id !== action.payload.id)
        },
        requestFailed(state: NewsItemState) {
            state.progressBarLoading = false
            state.scrollLoading = false
            state.scrollLoadingMessage = null
            state.error = 'Something went wrong'
        },
        reset(state: NewsItemState) {
            state.newsItems = []
            state.editingNewsItemId = null
            state.error = null
            state.progressBarLoading = false
            state.scrollLoading = false
            state.scrollLoadingMessage = null
        }
    }
})

export const {
    progressBarLoadingStart,
    progressBarLoadingEnd,
    scrollLoadingStart,
    scrollLoadingEnd,
    showCreateForm,
    hideCreateForm,
    swapNewsItem,
    addNewsItem,
    setNewsItems,
    concatNewsItems,
    updateNewsItem,
    removeNewsItem,
    requestFailed,
    reset
} = newsItem.actions

export default newsItem.reducer

export const changeOrder = (id: string, direction: string): AppThunk => async dispatch => {
    try {
        dispatch(progressBarLoadingStart())
        
        await changeOrderAPI(id, direction)

        dispatch(swapNewsItem({ id, direction }))

        dispatch(progressBarLoadingEnd())

    } catch (err) {
        dispatch(requestFailed())
    }
}

export const changeStatus = (id: string, action: string): AppThunk => async dispatch => {
    try {

        dispatch(progressBarLoadingStart())

        const changeStatusRes = await changeStatusAPI(id, action)

        dispatch(updateNewsItem(changeStatusRes.news_item))

        dispatch(progressBarLoadingEnd())

    } catch (err) {
        dispatch(requestFailed())
    }
}

export const create = (newsItem: any): AppThunk => async dispatch => {
    try {

        dispatch(progressBarLoadingStart())

        const createRes = await createAPI(newsItem)

        dispatch(addNewsItem(createRes.news_item))

        dispatch(hideCreateForm())
        
        dispatch(progressBarLoadingEnd())

    } catch (err) {
        dispatch(requestFailed())
    }
}

export const read = (params: any): AppThunk => async dispatch => {
    try {

        const scrollLoadingMessage = `Loading news item`

        dispatch(reset())

        dispatch(scrollLoadingStart(scrollLoadingMessage))

        const readRes = await readAPI(params)

        dispatch(setNewsItems(readRes.news_items))

        dispatch(scrollLoadingEnd())

    } catch (err) {
        dispatch(requestFailed())
    }
}

export const query = (params: any): AppThunk => async dispatch => {
    try {

        const scrollLoadingMessage = `Loading news items from ${moment(params.date).format('ll')}`

        dispatch(scrollLoadingStart(scrollLoadingMessage))

        const queryRes = await queryAPI(params)

        dispatch(concatNewsItems(queryRes.news_items))

        dispatch(scrollLoadingEnd())

    } catch (err) {
        dispatch(requestFailed())
    }
}

export const remove = (id: any): AppThunk => async dispatch => {
    try {

        dispatch(progressBarLoadingStart())

        const deleteRes = await removeAPI(id)

        dispatch(removeNewsItem(deleteRes.news_item))

        dispatch(progressBarLoadingEnd())

    } catch (err) {
        dispatch(requestFailed())
    }
}

export const update = (id: string, newsItem: any): AppThunk => async dispatch => {
    try {

        dispatch(progressBarLoadingStart())

        const updateRes = await updateAPI(id, newsItem)

        dispatch(updateNewsItem(updateRes.news_item))

        dispatch(progressBarLoadingEnd())

    } catch (err) {
        dispatch(requestFailed())
    }
}

export const uploadVideo = (id: string, video: any): AppThunk => async dispatch => {
    try {

        dispatch(progressBarLoadingStart())

        const uploadVideoRes = await uploadVideoAPI(id, video)

        dispatch(updateNewsItem(uploadVideoRes.news_item))

        dispatch(progressBarLoadingEnd())

    } catch (err) {
        dispatch(requestFailed())
    }
}

export const refresh = (id: string): AppThunk => async dispatch => {
    try {

        dispatch(progressBarLoadingStart())

        const readRes = await readAPI(id)

        dispatch(updateNewsItem(readRes.news_items[0]))

        dispatch(progressBarLoadingEnd())

    } catch (err) {
        dispatch(requestFailed())
    }
}