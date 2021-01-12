import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { query as queryAPI, QueryResponsePayload, Feed } from 'features/feed/api/query.api'
import { AppThunk } from 'store'
import notify from 'utils/notify'

interface FeedState {
    feeds: Feed[];
}

const initialState: FeedState = {
    feeds: []
}

const auth = createSlice({
    name: 'feed',
    initialState,
    reducers: {
        setFeeds(state: FeedState, action: PayloadAction<QueryResponsePayload>) {
            const { feeds } = action.payload
            state.feeds = feeds
        }
    }
})

export const {
    setFeeds,
} = auth.actions

export default auth.reducer

export const query = (): AppThunk => async dispatch => {
    try {

        const queryRes = await queryAPI()

        dispatch(setFeeds(queryRes))

    } catch (error) {
        notify('danger', 'Feeds could not be loaded')
    }
}
