import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/users/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            // Check if response is okay
            if (!response.ok) {
                // Handle non-2xx status codes
                const errorData = await response.json();
                console.error('Signup failed:', errorData);
                setError(errorData.message || 'Signup failed. Please try again.');
                return;
            }

            // Parse response data
            const data = await response.json();

            if (data.token) { // Check if the response contains a token
                console.log('Signup successful:', data);

                // Store the JWT token in localStorage
                localStorage.setItem('token', data.token);

                // Redirect user to diary page
                navigate('/diary');
            } else {
                // Handle cases where token is not present
                setError('Signup failed. Please try again.'); // Display error if no token
            }
        } catch (error) {
            console.error('Error signing up:', error);
            setError('An unexpected error occurred. Please try again later.');
        }
    };

    return (
        <div>
            <h1>Sign Up</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Sign Up</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default SignupPage;
