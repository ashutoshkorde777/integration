import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { initializeAuth } from './store/authSlice'; // Adjust the path
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Home from './pages/Home';
import Layout from './Layout.jsx';
import EmployeeDashboard from "./pages/employee/EmployeeDashboard.jsx";

const App = () => {
    const dispatch = useDispatch();
    const { isLoggedIn } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(initializeAuth());
    }, [dispatch]);

    return (
        <Router>
            <Routes>
                {/* Public Route */}
                <Route path="/login" element={isLoggedIn ? <Navigate to="/" /> : <Login />} />

                {/* Private Routes */}
                <Route element={<PrivateRoute />}>
                    <Route element={<Layout />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/employees" element={<EmployeeDashboard />} />
                    </Route>
                </Route>

                {/* Fallback for undefined routes */}
                <Route path="*" element={<Navigate to={isLoggedIn ? "/" : "/login"} />} />
            </Routes>
        </Router>
    );
};

export default App;
