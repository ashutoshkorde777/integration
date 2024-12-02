import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import employeeReducer from "../features/employeeSlice.js";

const store = configureStore({
    reducer: {
        auth: authReducer,
        employee: employeeReducer,
    },
});

export default store;
