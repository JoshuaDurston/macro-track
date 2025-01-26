import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DiaryPage = () => {
    const [currentDate, setCurrentDate] = useState(new Date()); // Default to today's date
    const [kj, setKj] = useState(''); // Track the kilojoule input
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Format the date for display and server (YYYY-MM-DD)
    const formatDate = (date) => date.toISOString().split('T')[0];

    // Fetch the kilojoule value for the current date when it changes
    useEffect(() => {
        async function fetchKjForDate() {
            const token = localStorage.getItem('token'); // Retrieve the auth token
            if (!token) {
                alert('Please log in');
                navigate('/login');
                return;
            }

            setLoading(true);
            try {
                const response = await fetch(`/api/diary/${formatDate(currentDate)}`, {
                    headers: {
                        Authorization: `Bearer ${token}`, // Pass the token in the request
                    },
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        alert('Session expired. Please log in again.');
                        navigate('/login');
                    } else {
                        throw new Error('Failed to fetch kilojoule data');
                    }
                }

                const data = await response.json();
                setKj(data.kj || ''); // Set kj if available, or default to an empty string
            } catch (error) {
                console.error('Error fetching kilojoule data:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchKjForDate();
    }, [currentDate, navigate]);

    // Handle saving the kilojoule value
    const handleSaveKj = async () => {
        const token = localStorage.getItem('token'); // Retrieve the auth token
        if (!token) {
            alert('Please log in');
            navigate('/login');
            return;
        }

        console.log('Token:', token); // Debugging line
        try {
            const response = await fetch(`/api/diary/${formatDate(currentDate)}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`, // Pass the token in the request
                },
                body: JSON.stringify({ kj }), // Send the kilojoule value
            });

            if (!response.ok) {
                if (response.status === 401) {
                    alert('Session expired. Please log in again.');
                    navigate('/login');
                    return;
                }
                throw new Error('Failed to save kilojoule data');
            }

            alert('Kilojoules saved!');
        } catch (error) {
            console.error('Error saving kilojoules:', error);
            alert('Failed to save kilojoules');
        }
    };

    // Handle date navigation (previous/next day)
    const handleDateChange = (days) => {
        setCurrentDate((prevDate) => {
            const newDate = new Date(prevDate);
            newDate.setDate(newDate.getDate() + days);
            return newDate;
        });
    };

    return (
        <div>
            <h1>Diary</h1>
            <div>
                <button onClick={() => handleDateChange(-1)} disabled={loading}>
                    ⬅️ Previous Day
                </button>
                <span>{formatDate(currentDate)}</span>
                <button onClick={() => handleDateChange(1)} disabled={loading}>
                    Next Day ➡️
                </button>
            </div>
            <div>
                <label>
                    Kilojoules:
                    <input
                        type="number"
                        value={kj}
                        onChange={(e) => setKj(e.target.value)}
                        disabled={loading}
                    />
                </label>
                <button onClick={handleSaveKj} disabled={loading || kj === ''}>
                    Save
                </button>
            </div>
        </div>
    );
};

export default DiaryPage;
