import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(() => {
        const userData = localStorage.getItem('user');
        return userData ? JSON.parse(userData) : null; // Initialize from localStorage
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token && user) {
            setIsLoggedIn(true);
        }
    }, [user]); // Ensure that isLoggedIn updates when user data is set

    const login = (token, userData) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData)); // Store user data in localStorage
        setIsLoggedIn(true);  // Update the login status
        setUser(userData);  // Set the user state
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
