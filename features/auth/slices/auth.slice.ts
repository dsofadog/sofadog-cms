import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { login as loginAPI, LoginResponsePayload, User } from 'features/auth/api/login.api'
import { toggleShift as toggleShiftAPI, ToggleShiftResponsePayload } from 'features/auth/api/toggle-shift.api'
import { AppThunk } from 'store'
import tokenManager from 'utils/token-manager'
import { query as queryFeeds } from 'features/feed/slices/feed.slice'
import { REHYDRATE } from 'redux-persist'

interface AuthState {
    isAuthenticated: boolean;
    currentUser: User | null;
    token: string;
    error: string | null;
    isLoading: boolean;
}

const initialState: AuthState = {
    isAuthenticated: false,
    currentUser: null,
    token: '',
    error: null,
    isLoading: false
}

const auth = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart(state: AuthState) {
            state.isLoading = true
        },
        loginSuccess(state: AuthState, action: PayloadAction<LoginResponsePayload>) {
            state.isAuthenticated = true
            state.currentUser = action.payload.user
            state.token = action.payload.token
            state.isLoading = false
            state.error = null
        },
        loginFailed(state: AuthState, action: PayloadAction<string>) {
            state.isAuthenticated = false
            state.currentUser = null
            state.token = ''
            state.isLoading = false
            state.error = [
                'AuthenticationError',
                'Expected 1 results; got 0'
            ].includes(action.payload) ? 'Wrong credentials' : 'Something went wrong'
        },
        logout(state: AuthState) {
            state.isAuthenticated = false
            state.currentUser = null
            state.token = ''
            state.isLoading = false
            state.error = null
        },
        toggleShiftStart(state: AuthState) {
            state.isLoading = true
        },
        toggleShiftSuccess(state: AuthState, action: PayloadAction<ToggleShiftResponsePayload>) {
            state.currentUser = action.payload.user
            state.isLoading = false
            state.error = null
        },
        toggleShiftFailed(state: AuthState) {
            state.currentUser = state.currentUser
            state.isLoading = false
            state.error = 'Something went wrong'
        }
    },
    extraReducers: (builder)=>{
        builder.addCase(REHYDRATE, (state: any, action: any)=>{
            if(action.payload?.auth.isAuthenticated){
                tokenManager.setToken(action.payload.auth.token)
            }
        })
    }
})

export const {
    loginStart,
    loginSuccess,
    loginFailed,
    logout,
    toggleShiftStart,
    toggleShiftSuccess,
    toggleShiftFailed
} = auth.actions

export default auth.reducer

export const login = (email: string, password: string): AppThunk => async dispatch => {
    try {
        dispatch(loginStart())
        let loginRes = await loginAPI(email, password)

        tokenManager.setToken(loginRes.token)

        if(!loginRes.user.on_shift){
            const toggleShiftRes = await toggleShiftAPI(email)
            loginRes.user.on_shift = toggleShiftRes.user.on_shift
        }

        dispatch(loginSuccess(loginRes))

    } catch (err) {
        dispatch(loginFailed(err.response.data.error_message))
    }
}

export const toggleShift = (email: string): AppThunk => async dispatch => {
    try {

        dispatch(toggleShiftStart())

        const toggleShiftRes = await toggleShiftAPI(email)

        dispatch(toggleShiftSuccess(toggleShiftRes))

    } catch (err) {
        dispatch(toggleShiftFailed())
    }
}