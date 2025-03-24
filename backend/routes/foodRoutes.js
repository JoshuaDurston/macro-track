const express = require("express");
const axios = require("axios");
const verifyToken = require("../middleware/auth"); // For protecting user food data
const FoodItem = require("../models/foodItem"); // Model for user-created foods
require("dotenv").config();

const router = express.Router();

/**
 * USDA Food Search Proxy
 * GET /api/food/search?query=apple
 */
router.get("/search", async (req, res) => {
    const query = req.query.query?.toLowerCase() || ""; // Normalize query for comparison
    if (!query) return res.status(400).json({ error: "Missing search query" });

    try {
        const apiParams = {
            query,
            api_key: process.env.USDA_API_KEY,
            dataType: "SR Legacy,Foundation,Branded",
            pageSize: 15,
        };

        const response = await axios.get(
            "https://api.nal.usda.gov/fdc/v1/foods/search",
            { params: apiParams }
        );

        if (!response.data || !response.data.foods || response.data.foods.length === 0) {
            return res.status(404).json({ error: "No results found" });
        }

        let formattedResults = response.data.foods.map((food) => {
            const isBranded = food.dataType === "Branded";

            // Extract nutrients
            const getNutrient = (nutrientName) => {
                const nutrient = food.foodNutrients.find(n => n.nutrientName === nutrientName);
                return nutrient ? nutrient.value : null;
            };

            let kjValue = getNutrient("Energy");

            if (isBranded && (!kjValue || kjValue < 100)) {
                const kcal = getNutrient("Energy (Atwater General Factors)") || getNutrient("Energy (kcal)");
                if (kcal) {
                    kjValue = kcal * 4.184; // Convert kcal to kJ
                }
            }

            return {
                fdcId: food.fdcId,
                name: food.description.toLowerCase(),
                kj: kjValue ? Math.round(kjValue) : null,
                protein: getNutrient("Protein"),
                carbs: getNutrient("Carbohydrate, by difference"),
                fat: getNutrient("Total lipid (fat)"),
                servingSize: isBranded ? food.servingSize || "N/A" : 100,
                servingUnit: isBranded ? food.servingSizeUnit || "g" : "g",
                isBranded,
            };
        });

        // **Dynamic prioritization based on query**
        formattedResults.sort((a, b) => {
            const aExactMatch = a.name === query;
            const bExactMatch = b.name === query;
            const aStartsWith = a.name.startsWith(query);
            const bStartsWith = b.name.startsWith(query);

            if (aExactMatch && !bExactMatch) return -1;
            if (!aExactMatch && bExactMatch) return 1;
            if (aStartsWith && !bStartsWith) return -1;
            if (!aStartsWith && bStartsWith) return 1;

            return 0; // Keep USDA ranking otherwise
        });

        res.json({ foods: formattedResults.slice(0, 7) });

    } catch (error) {
        console.error("USDA API error:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to fetch food data" });
    }
});



/**
 * Save a User-Created Food Item
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
 * Fetch User-Created Food Items
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
