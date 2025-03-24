import React, { useState, useEffect } from "react";
import axios from "axios";
import "./FoodSearchModal.css";

const FoodSearchModal = ({ onClose, onAddFood, section }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [debounceTimeout, setDebounceTimeout] = useState(null);
    const [servingSizes, setServingSizes] = useState({});

    useEffect(() => {
        if (searchQuery.length < 3) {
            setSearchResults([]);
            return;
        }

        setLoading(true);
        setError("");

        if (debounceTimeout) clearTimeout(debounceTimeout);

        const timeoutId = setTimeout(async () => {
            try {
                const response = await axios.get(`/api/food/search?query=${searchQuery}`);
                const foods = response.data.foods || [];

                const initialServingSizes = {};
                foods.forEach(food => {
                    initialServingSizes[food.fdcId] = food.servingSize;
                });

                setServingSizes(initialServingSizes);
                setSearchResults(foods);
            } catch (err) {
                setError("Failed to fetch food items");
                console.error("Error fetching food data:", err);
            } finally {
                setLoading(false);
            }
        }, 500);

        setDebounceTimeout(timeoutId);
    }, [searchQuery]);

    const handleServingSizeChange = (fdcId, newSize) => {
        setServingSizes(prev => ({
            ...prev,
            [fdcId]: newSize
        }));
    };

    const calculateKJ = (food, newSize) => {
        const originalSize = food.servingSize;
        return ((newSize / originalSize) * food.kj).toFixed(2);
    };

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
                    onChange={(e) => setSearchQuery(e.target.value)}
                />

                {loading && <p>Loading...</p>}
                {error && <p className="error-text">{error}</p>}

                <div className="search-results">
                    {searchResults.length > 0 ? (
                        <ul>
                            {searchResults.map((food) => (
                                <li key={food.fdcId} className="food-item">
                                    <strong>{food.name}</strong> <br />
                                    <span>Kilojoules: {calculateKJ(food, servingSizes[food.fdcId])}</span> <br />
                                    <label>
                                        Serving Size (g):
                                        <input
                                            type="number"
                                            value={servingSizes[food.fdcId]}
                                            onChange={(e) => handleServingSizeChange(food.fdcId, parseFloat(e.target.value) || 0)}
                                            min="1"
                                            style={{ width: "60px", marginLeft: "5px" }}
                                        />
                                    </label>
                                    <button
                                        className="add-food-button"
                                        onClick={() => onAddFood(section, {
                                            name: food.name,
                                            kj: parseFloat(calculateKJ(food, servingSizes[food.fdcId])),
                                            servingSize: servingSizes[food.fdcId]
                                        })}
                                    >
                                        Add
                                    </button>
                                </li>
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
