// src/store/departmentSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunks (async actions)
export const fetchAllDepartments = createAsyncThunk(
    'department/fetchAllDepartments',
    async () => {
        console.log('fetchAllDepartments called');
        const response = await axios.get('http://localhost:3000/api/v1/department/getAllDepartments');
        return response.data.data; // assuming the API returns a `result` key
    }
);

export const fetchAllWorkingDepartments = createAsyncThunk(
    'department/fetchAllWorkingDepartments',
    async () => {
        const response = await axios.get('/api/departments/getAllWorkingDepartments');
        return response.data.result;
    }
);

export const fetchAllClosedDepartments = createAsyncThunk(
    'department/fetchAllClosedDepartments',
    async () => {
        const response = await axios.get('/api/departments/getClosedDepartments');
        return response.data.result;
    }
);

export const addDepartment = createAsyncThunk(
    'department/addDepartment',
    async (departmentData) => {
        const response = await axios.post('/api/departments/addDepartment', departmentData);
        return response.data.result;
    }
);

export const deleteDepartment = createAsyncThunk(
    'department/deleteDepartment',
    async (departmentId) => {
        const response = await axios.post('/api/departments/deleteDepartment', { id: departmentId });
        return departmentId; // we return the departmentId to remove it from the state
    }
);

export const updateDepartment = createAsyncThunk(
    'department/updateDepartment',
    async (departmentData) => {
        const response = await axios.put('/api/departments/updateDepartment', departmentData);
        return response.data.result;
    }
);

// Initial State
const initialState = {
    departments: [],
    workingDepartments: [],
    closedDepartments: [],
    loading: false,
    error: null,
};

// Redux Slice
const departmentSlice = createSlice({
    name: 'department',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Handle fetch all departments
        builder.addCase(fetchAllDepartments.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchAllDepartments.fulfilled, (state, action) => {
            state.loading = false;
            state.departments = action.payload;
        });
        builder.addCase(fetchAllDepartments.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });

        // Handle fetch all working departments
        builder.addCase(fetchAllWorkingDepartments.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchAllWorkingDepartments.fulfilled, (state, action) => {
            state.loading = false;
            state.workingDepartments = action.payload;
        });
        builder.addCase(fetchAllWorkingDepartments.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });

        // Handle fetch all closed departments
        builder.addCase(fetchAllClosedDepartments.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchAllClosedDepartments.fulfilled, (state, action) => {
            state.loading = false;
            state.closedDepartments = action.payload;
        });
        builder.addCase(fetchAllClosedDepartments.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });

        // Handle add department
        builder.addCase(addDepartment.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(addDepartment.fulfilled, (state, action) => {
            state.loading = false;
            state.departments.push(action.payload);
        });
        builder.addCase(addDepartment.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });

        // Handle delete department
        builder.addCase(deleteDepartment.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(deleteDepartment.fulfilled, (state, action) => {
            state.loading = false;
            state.departments = state.departments.filter(
                (department) => department.id !== action.payload
            );
        });
        builder.addCase(deleteDepartment.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });

        // Handle update department
        builder.addCase(updateDepartment.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(updateDepartment.fulfilled, (state, action) => {
            state.loading = false;
            state.departments = state.departments.map((department) =>
                department.id === action.payload.id ? action.payload : department
            );
        });
        builder.addCase(updateDepartment.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
    },
});

// Export actions and reducer
export default departmentSlice.reducer;
