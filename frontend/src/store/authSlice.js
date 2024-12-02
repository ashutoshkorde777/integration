import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async Thunk to Logout
export const logoutEmployee = createAsyncThunk('auth/logoutEmployee', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.post('http://localhost:3000/api/v1/employee/logoutEmployee', {}, { withCredentials: true });
        return response.data; // Backend should return success message
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Logout failed');
    }
});

// Async Thunk to Initialize Authentication
export const initializeAuth = createAsyncThunk('auth/initializeAuth', async (_, { dispatch, rejectWithValue }) => {
    // Check tokens in localStorage
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const accessString = localStorage.getItem('accessString');

    if (accessToken && refreshToken && accessString) {
        // If tokens exist in localStorage, use them directly
        dispatch(loginSuccess({ accessToken, refreshToken, accessString }));
    } else {
        // If tokens are not available locally, validate from the backend
        try {
            // const response = await axios.post(
            //     'http://localhost:3000/api/v1/auth/validate', // Replace with your validation endpoint
            //     {},
            //     { withCredentials: true }
            // );
            // const { accessToken, refreshToken, accessString } = response.data;

            // Dispatch loginSuccess with new tokens
            dispatch(loginSuccess({ accessToken, refreshToken, accessString }));
        } catch (error) {
            console.error('Initialization failed:', error);
            dispatch(logout()); // Clear state and localStorage if validation fails
            return rejectWithValue('Auto-login failed');
        }
    }
});

// Initial State
const initialState = {
    isLoggedIn: false,
    accessToken: null,
    refreshToken: null,
    accessString: null,
    status: 'idle',
    error: null,
};

// Auth Slice
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
    extraReducers: (builder) => {
        builder
            .addCase(logoutEmployee.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(logoutEmployee.fulfilled, (state) => {
                state.status = 'idle';
                state.isLoggedIn = false;
                state.accessToken = null;
                state.refreshToken = null;
                state.accessString = null;

                // Clear tokens from localStorage
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('accessString');
            })
            .addCase(logoutEmployee.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Logout failed';
            })
            .addCase(initializeAuth.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(initializeAuth.fulfilled, (state) => {
                state.status = 'succeeded';
            })
            .addCase(initializeAuth.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Initialization failed';
            });
    },
});

export default authSlice.reducer;
export const { loginSuccess, logout } = authSlice.actions;
