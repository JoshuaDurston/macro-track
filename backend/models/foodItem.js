const mongoose = require("mongoose");

const FoodItemSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    name: {
        type: String,
        required: true
    },
    kj: {
        type: Number,
        required: true,
        min: 0
    },
    servingSize: {
        type:String,
        required:true
    },
}, {timestamps: true});

module.exports = mongoose.model("FoodItem", FoodItemSchema);