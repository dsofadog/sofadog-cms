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
import NProgress from "nprogress";

interface NewsItemState {
    newsItemFormIsVisible: boolean;
    newsItems: any[];
    editingNewsItemId: string | null
    progressBarLoading: boolean;
    scrollLoading: boolean;
    scrollLoadingMessage: string | null;
    // createLoading: boolean;
    fetchErrorMessage: string | null;
    notificationErrorMessage: string | null;
}

const initialState: NewsItemState = {
    newsItemFormIsVisible: false,
    newsItems: [],
    editingNewsItemId: null,
    progressBarLoading: false,
    scrollLoading: false,
    scrollLoadingMessage: null,
    // createLoading: false,
    fetchErrorMessage: null,
    notificationErrorMessage: null
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
            state.scrollLoading = true
            state.scrollLoadingMessage = action.payload
            state.fetchErrorMessage = null
            state.notificationErrorMessage = null
        },
        scrollLoadingEnd(state: NewsItemState, action: PayloadAction<string>) {
            state.scrollLoading = false
            state.scrollLoadingMessage = null
        },
        // createLoadingStart(state: NewsItemState){
        //     state.createLoading = true
        // },
        // createLoadingEnd(state: NewsItemState){
        //     state.createLoading = false
        // },
        newsItemLoadingStart(state: NewsItemState, action: PayloadAction<string>) {
            const newsItem = state.newsItems.find(newsItem => newsItem.id === action.payload)
            newsItem.loading = true
        },
        newsItemLoadingEnd(state: NewsItemState, action: PayloadAction<string>) {
            const newsItem = state.newsItems.find(newsItem => newsItem.id === action.payload)
            if(newsItem){
                delete newsItem.loading
            }
        },
        showNewsItemForm(state: NewsItemState) {
            state.newsItemFormIsVisible = true
        },
        hideNewsItemForm(state: NewsItemState) {
            state.newsItemFormIsVisible = false
        },
        swapNewsItem(state: NewsItemState, action: PayloadAction<{ id: string, direction: string }>) {
            const { id, direction } = action.payload

            const aIndex = state.newsItems.findIndex(newsItem => newsItem.id === id)
            let bIndex = direction === 'decrement_ordinal'
                ? aIndex + 1
                : aIndex - 1

            if (state.newsItems[aIndex] && state.newsItems[bIndex]) {
                const newsItemA = state.newsItems[aIndex]
                const newsItemB = state.newsItems[bIndex]

                state.newsItems[aIndex] = newsItemB
                state.newsItems[bIndex] = newsItemA
            }

        },
        addNewsItem(state: NewsItemState, action: PayloadAction<any>) {
            state.newsItems = [action.payload, ...state.newsItems]
        },
        setNewsItems(state: NewsItemState, action: PayloadAction<any>) {
            state.newsItems = [...action.payload]
        },
        concatNewsItems(state: NewsItemState, action: PayloadAction<any>) {
            state.newsItems = [...state.newsItems, ...action.payload]
        },
        updateNewsItem(state: NewsItemState, action: PayloadAction<any>) {
            const matchedNewsItem = state.newsItems.find(newsItem => newsItem.id === action.payload.id)
            _.assignIn(matchedNewsItem, action.payload)
        },
        removeNewsItem(state: NewsItemState, action: PayloadAction<any>) {
            state.newsItems = state.newsItems.filter(newsItem => newsItem.id !== action.payload.id)
        },
        requestFailed(state: NewsItemState, action: PayloadAction<any>) {
            const { error, type } = action.payload
            let errorMesssage: string
            if(error.response){
                const {status, data} = error.response
                errorMesssage = btoa(JSON.stringify({code: status, body: data}))
            }
            state.progressBarLoading = false
            state.scrollLoading = false
            state.scrollLoadingMessage = null
            state.fetchErrorMessage = type === 'fetch' ? 'Something went wrong' + (errorMesssage? ': '+ errorMesssage: '') : null
            state.notificationErrorMessage = type === 'notification' ? (error.response?.data?.message || 'Something went wrong') : null
        },
        reset(state: NewsItemState) {
            state.newsItems = []
            state.editingNewsItemId = null
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
    newsItemLoadingStart,
    newsItemLoadingEnd,
    showNewsItemForm,
    hideNewsItemForm,
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
        dispatch(newsItemLoadingStart(id))

        await changeOrderAPI(id, direction)

        dispatch(swapNewsItem({ id, direction }))

    } catch (error) {
        dispatch(requestFailed({ type: 'notification', error }))
    } finally {
        dispatch(newsItemLoadingEnd(id))
    }
}

export const changeStatus = (id: string, action: string): AppThunk => async dispatch => {
    try {

        dispatch(newsItemLoadingStart(id))

        const changeStatusRes = await changeStatusAPI(id, action)

        dispatch(updateNewsItem(changeStatusRes.news_item))

    } catch (error) {
        dispatch(requestFailed({ type: 'notification', error }))
    } finally {
        dispatch(newsItemLoadingEnd(id))
    }
}

export const create = (newsItem: any): AppThunk => async dispatch => {
    try {

        dispatch(progressBarLoadingStart())

        const createRes = await createAPI(newsItem)

        dispatch(addNewsItem(createRes.news_item))

        dispatch(hideNewsItemForm())

        dispatch(progressBarLoadingEnd())

    } catch (error) {
        dispatch(requestFailed({ type: 'notification', error }))
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

    } catch (error) {
        dispatch(requestFailed({ type: 'fetch', error }))
    }
}

export const query = (params: any): AppThunk => async dispatch => {
    try {

        const scrollLoadingMessage = `Loading news items from ${moment(params.date).format('ll')}`

        dispatch(scrollLoadingStart(scrollLoadingMessage))

        const queryRes = await queryAPI(params)

        dispatch(concatNewsItems(queryRes.news_items))

        dispatch(scrollLoadingEnd())

    } catch (error) {
        dispatch(requestFailed({ type: 'fetch', error }))
    }
}

export const remove = (id: any): AppThunk => async dispatch => {
    try {

        dispatch(newsItemLoadingStart(id))

        const deleteRes = await removeAPI(id)

        dispatch(removeNewsItem(deleteRes.news_item))

    } catch (error) {
        dispatch(requestFailed({ type: 'notification', error }))
    } finally {
        dispatch(newsItemLoadingEnd(id))
    }
}

export const update = (id: string, newsItem: any): AppThunk => async dispatch => {
    try {

        dispatch(progressBarLoadingStart())

        const updateRes = await updateAPI(id, newsItem)

        dispatch(updateNewsItem(updateRes.news_item))

        dispatch(hideNewsItemForm())
        
        dispatch(progressBarLoadingEnd())

    } catch (error) {
        dispatch(requestFailed({ type: 'notification', error }))
    }
}

export const uploadVideo = (id: string, video: any): AppThunk => async dispatch => {
    try {

        NProgress.start()

        dispatch(newsItemLoadingStart(id))

        const uploadVideoRes = await uploadVideoAPI(id, video)

        dispatch(updateNewsItem(uploadVideoRes.news_item))

    } catch (error) {
        dispatch(requestFailed({ type: 'notification', error }))
    } finally {
        dispatch(newsItemLoadingEnd(id))
        NProgress.done()
    }
}

export const refresh = (id: string): AppThunk => async dispatch => {
    try {

        dispatch(newsItemLoadingStart(id))

        const readRes = await readAPI(id)

        dispatch(updateNewsItem(readRes.news_items[0]))

    } catch (error) {
        dispatch(requestFailed({ type: 'notification', error }))
    } finally {
        dispatch(newsItemLoadingEnd(id))
    }
}