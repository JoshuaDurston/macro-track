import React, { useState, useEffect } from "react";
import axios from "axios";
import "./FoodSearchModal.css";

const FoodSearchModal = ({ onClose }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [debounceTimeout, setDebounceTimeout] = useState(null); // Stores timeout ID

    // Debounced search function
    useEffect(() => {
        if (searchQuery.length < 3) {
            setSearchResults([]);
            return;
        }

        setLoading(true);
        setError("");

        // Clear previous timeout if user types again
        if (debounceTimeout) clearTimeout(debounceTimeout);

        // Set a new timeout to delay the API request
        const timeoutId = setTimeout(async () => {
            try {
                const response = await axios.get(`/api/food/search?query=${searchQuery}`);
                setSearchResults(response.data.foods || []);
            } catch (err) {
                setError("Failed to fetch food items");
                console.error("Error fetching food data:", err);
            } finally {
                setLoading(false);
            }
        }, 500); // 500ms delay before making request

        setDebounceTimeout(timeoutId);
    }, [searchQuery]);

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>X</button>
                <h2>Search for Food</h2>
                <input
                    type="text"
                    placeholder="Search..."
                    className="search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)} // Just update state
                />

                {loading && <p>Loading...</p>}
                {error && <p className="error-text">{error}</p>}

                <div className="search-results">
                    {searchResults.length > 0 ? (
                        <ul>
                            {searchResults.map((food) => (
                                <li key={food.fdcId}>{food.description}</li>
                            ))}
                        </ul>
                    ) : (
                        !loading && <p>No results found</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FoodSearchModal;
