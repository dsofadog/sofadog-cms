import {combineReducers} from '@reduxjs/toolkit'
import authReducer from 'features/auth/slices/auth.slice'
import feedReducer from 'features/feed/slices/feed.slice'
import newItemReducer from 'features/news-item/slices/news-item.slice'
import stockVideoStorageReducer from 'features/stock-video-storage/slices/stock-video-storage.slice'

const rootReducer = combineReducers({
    auth: authReducer,
    feed: feedReducer,
    newsItem: newItemReducer,
    stockVideoStorage: stockVideoStorageReducer
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer