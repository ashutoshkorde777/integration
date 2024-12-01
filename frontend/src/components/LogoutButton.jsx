// src/components/LogoutButton.jsx

import React from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice.js';
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";
import axios from "axios";
import {CiLogout} from "react-icons/ci";

const LogoutButton = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        const accessToken = Cookies.get('accessToken');
        console.log('Current accessToken:', accessToken);

        // Remove the cookie with the appropriate path (adjust as needed)
        Cookies.remove('accessToken', { path: '/' });

        // Dispatch logout action
        dispatch(logout());

        // Navigate to login
        navigate('/login');
    };


    return (
            <div onClick={handleLogout} className={`icon-container mb-2`}>
                <CiLogout size={22} color="white"/>
                <span className="menu-text">Logout</span>
            </div>
    );
};

export default LogoutButton;
