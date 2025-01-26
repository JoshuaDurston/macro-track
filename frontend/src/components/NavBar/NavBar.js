import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './NavBar.css';

const NavBar = () => {
    const { isLoggedIn, logout, user } = useAuth();
    const navigate = useNavigate();
    
    const handleLogout = () => {
        logout();
        navigate('/');
    }

    return (
        <nav className="navbar">
            <ul className="nav-links">
                <li><Link to="/">Home</Link></li>
                {isLoggedIn && (
                    <>
                        <li><Link to="/diary">Diary</Link></li>
                        <li><Link to="/profile">Profile</Link></li>
                        <li><Link to="/preferences">Preferences</Link></li>
                        <li><Link to="/upload-food">Upload Food</Link></li>
                    </>
                )}
            </ul>
            <ul className="auth-links">
                {isLoggedIn ? (
                    <>
                        <li>Welcome, {user ? user.username : 'User'}</li>
                        <li><button onClick={handleLogout}>Logout</button></li>
                    </>
                ) : (
                    <>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/signup">Sign Up</Link></li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default NavBar;
