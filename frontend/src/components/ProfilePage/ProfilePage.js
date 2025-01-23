import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import BioForm from '../BioForm/BioForm';
import './ProfilePage.css';

const ProfilePage = () => {
    const { user } = useContext(AuthContext);  // Get user from context
    const [bio, setBio] = useState('');
    const [profilePicture, setProfilePicture] = useState(''); // State for profile picture
    const [isEditingBio, setIsEditingBio] = useState(false);
    const [loading, setLoading] = useState(true); // For loading state

    useEffect(() => {
        if (user && user._id) {
            async function fetchUserData() {
                try {
                    const response = await fetch(`/api/users/${user._id}/profile`);
                    const data = await response.json();
                    setBio(data.bio || '');
                    setProfilePicture(data.profilePicture); // Set the profile picture URL
                } catch (error) {
                    console.error('Failed to fetch user data', error);
                } finally {
                    setLoading(false); // Done loading
                }
            }
            fetchUserData();
        }
    }, [user]); // Run when user changes

    const handleBioSave = async (newBio) => {
        if (!user || !user._id) {
            console.error('User ID is missing');
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/users/${user._id}/bio`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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

    if (loading) {
        return <p>Loading profile...</p>; // Show loading state
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
