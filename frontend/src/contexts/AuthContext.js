import React, { createContext, useState, useContext, useEffect } from 'react';

// Create a context
const AuthContext = createContext();

// Create a custom hook for using the AuthContext
export const useAuth = () => {
    return useContext(AuthContext);
};

// AuthProvider component to wrap around the App component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true); // Add loading state

    // Check if there's a saved token in localStorage on page load
    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        if (savedToken && savedUser) {
            try {
                setToken(savedToken);
                setUser(JSON.parse(savedUser)); // Parse the saved user data
            } catch (error) {
                console.error('Error loading user data from localStorage:', error);
            }
        }
        setLoading(false); // Set loading to false once the process completes
    }, []);

    // Login function
    const login = (token, user) => {
        try {
            setToken(token);
            setUser(user);

            // Save token and user to localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
        } catch (error) {
            console.error('Error during login:', error);
        }
    };

    // Logout function
    const logout = () => {
        try {
            setToken(null);
            setUser(null);

            // Remove token and user from localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    const isLoggedIn = !!token; // If there is a token, the user is logged in

    // Ensure loading state is handled
    if (loading) {
        return <div>Loading...</div>; // Handle loading state during initial load
    }

    return (
        <AuthContext.Provider value={{ user, token, isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
