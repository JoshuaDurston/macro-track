import React, { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

const ProfilePage = () => {
    const { user } = useContext(AuthContext);

    return (
        <div>
            <h1>Profile Page</h1>
            {user ? (
                <p>Username: {user.username}</p>
            ) : (
                <p>No user data available.</p>
            )}
        </div>
    );
};

export default ProfilePage;