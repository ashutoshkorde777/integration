// src/components/LogoutButton.jsx

import React from 'react';
import { useDispatch } from 'react-redux';
import {logout, logoutEmployee} from '../store/authSlice.js';
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";
import axios from "axios";
import {CiLogout} from "react-icons/ci";

const LogoutButton = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logoutEmployee())
            .unwrap()
            .then(() => {
                console.log('Logout successful');
            })
            .catch((error) => {
                console.error('Logout failed:', error);
            });
    };


    return (
            <div onClick={handleLogout} className={`icon-container mb-2`}>
                <CiLogout size={22} color="white"/>
                <span className="menu-text">Logout</span>
            </div>
    );
};

export default LogoutButton;
