// src/components/NoPageFound.js
import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

const NoPageFound = () => {
    const navigate = useNavigate(); // Initialize the navigate function

    const handleRedirectHome = () => {
        navigate('/'); // Redirect to the home page
    };

    return (
        <div>
            <h1>404 - Page Not Found</h1>
            <p>The page you are looking for does not exist.</p>
            <button onClick={handleRedirectHome}>Go to Home</button> {/* Button to redirect */}
        </div>
    );
};

export default NoPageFound;
