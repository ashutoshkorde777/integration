import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    isLoggedIn: false,
    accessToken: null,
    refreshToken: null,
    accessString: null,
    status: 'idle',
    error: null,
};

// Helper function to get data from localStorage
const getTokensFromLocalStorage = () => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const accessString = localStorage.getItem('accessString');

    return { accessToken, refreshToken, accessString };
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            const { accessToken, refreshToken, accessString } = action.payload;
            state.isLoggedIn = true;
            state.accessToken = accessToken;
            state.refreshToken = refreshToken;
            state.accessString = accessString;
            state.status = 'succeeded';

            // Store tokens in localStorage for persistence
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('accessString', accessString);
        },
        logout: (state) => {
            state.isLoggedIn = false;
            state.accessToken = null;
            state.refreshToken = null;
            state.accessString = null;
            state.status = 'idle';

            // Remove tokens from localStorage on logout
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('accessString');
        },
    },
});

// Async Thunk to Initialize Authentication
export const initializeAuth = () => async (dispatch) => {
    // Try to read tokens from localStorage
    const { accessToken, refreshToken, accessString } = getTokensFromLocalStorage();

    // If tokens are found in localStorage, dispatch loginSuccess
    if (accessToken && refreshToken && accessString) {
        dispatch(loginSuccess({ accessToken, refreshToken, accessString }));
    } else {
        // If no tokens, proceed to validate from backend
        try {
            const response = await axios.post(
                'http://localhost:3000/api/v1/auth/validate',
                {},
                { withCredentials: true }
            );

            const { accessToken, refreshToken, accessString } = response.data;

            // Dispatch loginSuccess with response data
            dispatch(loginSuccess({ accessToken, refreshToken, accessString }));
        } catch (err) {
            console.error('Auto-login failed:', err);
            dispatch(logout());
        }
    }
};

export default authSlice.reducer;
export const { loginSuccess, logout } = authSlice.actions;
