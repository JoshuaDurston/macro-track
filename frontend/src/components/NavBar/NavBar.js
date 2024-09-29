import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import './NavBar.css';

const NavBar = () => {
    const { isLoggedIn, logout } = useContext(AuthContext);

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
                    <li><button onClick={logout}>Logout</button></li>
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