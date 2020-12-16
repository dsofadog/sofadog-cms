import {
    configureStore,
    getDefaultMiddleware,
    ThunkAction,
    Action
} from '@reduxjs/toolkit'
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER
} from 'redux-persist'
// import devToolsenhander from 'remote-redux-devtools'

import storage from 'redux-persist/lib/storage'
import rootReducer, { RootState } from './rootReducer'

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    whiteList: ['auth']
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
        }
    }),
    // enhancers: [devToolsenhander()]
})

if (process.env.NODE_ENV === 'development' && (module as any).hot) {
    (module as any).hot.accept('./rootReducer', () => {
        const newRootReducer = require('./rootReducer').default
        store.replaceReducer(newRootReducer)
    })
}

export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>

export const persistor = persistStore(store)

export default store