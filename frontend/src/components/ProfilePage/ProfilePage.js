import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import BioForm from '../BioForm/BioForm';
import './ProfilePage.css';

const ProfilePage = () => {
    const { user, loading: authLoading } = useAuth();  // Use the context directly
    const [bio, setBio] = useState('');
    const [profilePicture, setProfilePicture] = useState(''); // State for profile picture
    const [isEditingBio, setIsEditingBio] = useState(false);
    const [weight, setWeight] = useState('');
    const [newWeight, setNewWeight] = useState('');


    const [loading, setLoading] = useState(true); // For loading state

    useEffect(() => {
        if (user && user._id) {
            async function fetchUserData() {
                try {
                    const response = await fetch('/api/users/profile', {  // Use /profile endpoint to get the logged-in user's data
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`, // Include JWT token in the request header
                        }
                    });
                    const data = await response.json();
                    setBio(data.bio || '');
                    setProfilePicture(data.profilePicture); // Set the profile picture URL
                    setWeight(data.weight); 
                } catch (error) {
                    console.error('Failed to fetch user data', error);
                } finally {
                    setLoading(false); // Done loading
                }
            }
            fetchUserData();
        } else {
            setLoading(false);  // If no user, stop loading
        }
    }, [user]); // Run when user changes

    const handleBioSave = async (newBio) => {
        if (!user || !user._id) {
            console.error('User ID is missing');
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/users/bio`, {  // Use the correct route for saving bio
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // Include JWT token in the request header
                },
                body: JSON.stringify({ bio: newBio }),
            });

            if (response.ok) {
                setBio(newBio); // Update the bio on the profile
                setIsEditingBio(false); // Close the edit form
            } else {
                console.error('Failed to update bio');
            }
        } catch (error) {
            console.error('Error updating bio:', error);
        }
    };

    const updateWeight = async () => {
        if (!user || !user._id) {
            console.error('User ID is missing');
            return;
        }
    
        // Round to 1 decimal place
        const roundedWeight = parseFloat(newWeight).toFixed(1);
    
        try {
            const response = await fetch('http://localhost:5000/api/users/weight', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ weight: roundedWeight })
            });
    
            if (response.ok) {
                const data = await response.json();
                setWeight(data.weight);
                setNewWeight('');
            } else {
                console.error('Failed to update weight');
            }
        } catch (error) {
            console.error('Error updating weight:', error);
        }
    };

    // Handle loading states for both authentication and user profile data
    if (authLoading || loading) {
        return <p>Loading profile...</p>;
    }

    if (!user) {
        return <p>You need to log in to view your profile.</p>;
    }

    return (
        <div className="profile-page">
            <div className="profile-header">
                <h2>{user.username}</h2>

                {/* Display profile picture */}
                <div className="profile-picture-container">
                    <img
                        src={`http://localhost:5000${profilePicture}`}
                        alt={`${user.username}'s profile`}
                        className="profile-picture"
                    />
                </div>

                <div className="bio-section">
                    <p className="bio">
                        {bio || "This user hasn't written a bio yet."}
                    </p>
                    <button
                        className="edit-bio-button"
                        onClick={() => setIsEditingBio(true)}
                    >
                        ✏️
                    </button>
                </div>
                <div className="calculator-section">
                    <p className="weight">
                        Current Weight: {weight || "No Weight Recorded"} kg <br/>
                        <label htmlFor="weight">
                            Enter your weight(kg):
                        </label>
                        <input 
                            type="double" 
                            id="weight" 
                            name="weight" 
                            min="1"
                            value={newWeight}
                            onChange={(e) => setNewWeight(e.target.value)}
                        />
                        <button
                            className="update-weight-button"
                            onClick={() => updateWeight()}
                            disabled={!newWeight.trim()}
                        >
                                Confirm
                        </button>
                    </p>
                    <button
                        className="edit-bio-button"
                        onClick={() => setIsEditingBio(true)}
                    >
                        ✏️
                    </button>
                </div>
            </div>

            {isEditingBio && (
                <BioForm
                    initialBio={bio}
                    onSave={handleBioSave}
                    onCancel={() => setIsEditingBio(false)}
                />
            )}
        </div>
    );
};

export default ProfilePage;
