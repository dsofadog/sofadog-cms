import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { login as loginAPI, LoginResponsePayload, User } from 'features/auth/api/login.api'
import { AppThunk } from 'store'

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
            state.isLoading = false
            state.currentUser = null
            state.token = ''
            state.isLoading = false
            state.error = null
        }
    }
})

export const {
    loginStart,
    loginSuccess,
    loginFailed,
    logout
} = auth.actions

export default auth.reducer

export const login = (email: string, password: string): AppThunk => async dispatch => {
    try {
        dispatch(loginStart())
        const res = await loginAPI(email, password)
        dispatch(loginSuccess(res))

    } catch (err) {
        console.log(err)
        dispatch(loginFailed(err.response.data.error_message))
    }
}