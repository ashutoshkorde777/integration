import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { initializeAuth} from '../store/authSlice.js'; // Import the initializeAuth action

const PrivateRoute = () => {
    const dispatch = useDispatch();
    const { isLoggedIn, status } = useSelector((state) => state.auth);

    useEffect(() => {
        if (!isLoggedIn) {
            dispatch(initializeAuth());
        }
    }, [dispatch, isLoggedIn]);

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    return isLoggedIn ? <Outlet /> : <Navigate to="/login" />
};

export default PrivateRoute;