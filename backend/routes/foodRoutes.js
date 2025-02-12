const express = require("express");
const axios = require("axios");
const verifyToken = require("../middleware/auth"); // For protecting user food data
const FoodItem = require("../models/foodItem"); // Model for user-created foods
require("dotenv").config();

const router = express.Router();

/**
 * 🍏 USDA Food Search Proxy
 * GET /api/food/search?query=apple
 */
router.get("/search", async (req, res) => {
    const { query } = req.query;
    if (!query) return res.status(400).json({ error: "Missing search query" });

    try {
        const apiParams = {
            query,
            api_key: process.env.USDA_API_KEY,
            dataType: "SR Legacy,Foundation,Branded", // Order matters! Prioritize SR Legacy
            pageSize: 15, // Get more results before filtering
        };

        const response = await axios.get(
            "https://api.nal.usda.gov/fdc/v1/foods/search",
            { params: apiParams }
        );

        if (!response.data || !response.data.foods || response.data.foods.length === 0) {
            return res.status(404).json({ error: "No results found" });
        }

        // Extract relevant food data
        let formattedResults = response.data.foods.map((food) => {
            const kjNutrient = food.foodNutrients.find(
                (nutrient) => nutrient.nutrientName === "Energy" && nutrient.unitName === "kJ"
            );

            return {
                fdcId: food.fdcId,
                name: food.description.toLowerCase(), // Normalize case for sorting
                kj: kjNutrient ? kjNutrient.value : null,
                servingSize: food.servingSize || "N/A",
            };
        });

        // Prioritize whole foods (remove "cake", "cracker", etc.)
        formattedResults = formattedResults
            .filter((food) => food.kj !== null || food.name.includes("rice")) // Keep rice even if no kj
            .sort((a, b) => {
                // Prefer plain "rice" over "rice cakes/crackers"
                const aIsWholeRice = a.name.includes("rice") && !a.name.includes("cake") && !a.name.includes("cracker");
                const bIsWholeRice = b.name.includes("rice") && !b.name.includes("cake") && !b.name.includes("cracker");

                if (aIsWholeRice && !bIsWholeRice) return -1;
                if (!aIsWholeRice && bIsWholeRice) return 1;
                return 0; // Otherwise, keep original USDA ranking
            })
            .slice(0, 7); // Reduce list to 7 results max

        res.json({ foods: formattedResults });
    } catch (error) {
        console.error("USDA API error:", error.response?.data || error.message);
        if (error.response) {
            return res.status(error.response.status).json({ error: error.response.data });
        }
        res.status(500).json({ error: "Failed to fetch food data" });
    }
});



/**
 * 🥗 Save a User-Created Food Item
 * POST /api/food
 */
router.post("/", verifyToken, async (req, res) => {
    const { name, kj, servingSize } = req.body;
    const userId = req.user._id;

    if (!name || isNaN(kj) || kj < 0) {
        return res.status(400).json({ error: "Invalid food item data" });
    }

    try {
        const newFood = new FoodItem({ userId, name, kj, servingSize });
        await newFood.save();
        res.json({ message: "Food item saved", food: newFood });
    } catch (error) {
        console.error("Error saving food item:", error);
        res.status(500).json({ error: "Failed to save food item" });
    }
});

/**
 * 🍛 Fetch User-Created Food Items
 * GET /api/food/user
 */
// router.get("/user", verifyToken, async (req, res) => {
//     try {
//         const foods = await FoodItem.find({ userId: req.user._id });
//         res.json(foods);
//     } catch (error) {
//         console.error("Error fetching user food items:", error);
//         res.status(500).json({ error: "Failed to fetch food items" });
//     }
// });

module.exports = router;
