const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    cuisine: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        default: 0
    },
    priceRange: {
        type: String
    },
    deliveryTime: {
        type: Number
    },
    vegetarian: {
        type: Boolean,
        default: false
    },
    popularity: {
        type: Number,
        default: 0
    },
    latitude: {
        type: Number,
        default: 0
    },
    longitude: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Restaurant", restaurantSchema);