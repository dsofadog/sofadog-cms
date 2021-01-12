import {combineReducers} from '@reduxjs/toolkit'
import authReducer from 'features/auth/slices/auth.slice'
import feedReducer from 'features/feed/slices/feed.slice'
import newItemsReducer from 'features/news-item/slices/news-item.slice'

const rootReducer = combineReducers({
    auth: authReducer,
    feed: feedReducer,
    newsItem: newItemsReducer
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer