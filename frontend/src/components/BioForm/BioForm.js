import React, { useState } from 'react';
import './BioForm.css';

const BioForm = ({ initialBio, onSave, onCancel }) => {
    const [bio, setBio] = useState(initialBio);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(bio); // Pass the new bio to the parent
    };

    return (
        <form className="bio-form" onSubmit={handleSubmit}>
            <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows="4"
                placeholder="Write your bio here..."
                required
            />
            <div className="form-actions">
                <button type="submit">Save</button>
                <button type="button" onClick={onCancel}>Cancel</button>
            </div>
        </form>
    );
};

export default BioForm;
