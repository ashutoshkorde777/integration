import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice.js';
import { deleteCookie } from '../utils/cookie'; // Cookie utility to delete the refreshToken cookie
import { useNavigate } from 'react-router-dom';
import {FiUser} from "react-icons/fi";
import logo from '../assets/logo.svg';
import './NavBar.css'

const NavBar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoggedIn } = useSelector((state) => state.auth); // Access the login status from Redux

    const handleLogout = () => {
        // Dispatch logout action to clear Redux state
        dispatch(logout());

        // Remove refreshToken from cookies
        deleteCookie('refreshToken');

        // Redirect to the login page
        navigate('/login');
    };

    return (
        isLoggedIn &&
        <>
            <nav id="navbar">
                <img src={logo} alt="Aakar Dies & Moulds"/>
                <div className="navDiv">
                    <FiUser className="user-icon" color="white" size={18}/>
                </div>
            </nav>
        </>
    );
};

export default NavBar;
