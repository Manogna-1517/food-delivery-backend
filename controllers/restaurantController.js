const Restaurant = require("../models/Restaurant");
const recommendationService = require("../services/recommendationService");

exports.searchRestaurants = async (req, res) => {
    try {
        const { cuisine, rating, maxDeliveryTime, vegetarian, priceRange, popularity, search } = req.query;
        const filter = {};

        if (cuisine) {
            filter.cuisine = new RegExp(cuisine, "i");
        }

        if (rating) {
            filter.rating = { $gte: Number(rating) };
        }

        if (maxDeliveryTime) {
            filter.deliveryTime = { $lte: Number(maxDeliveryTime) };
        }

        if (vegetarian !== undefined) {
            filter.vegetarian = vegetarian === "true";
        }

        if (priceRange) {
            filter.priceRange = new RegExp(priceRange, "i");
        }

        if (popularity) {
            filter.popularity = { $gte: Number(popularity) };
        }

        if (search) {
            filter.$or = [
                { name: new RegExp(search, "i") },
                { cuisine: new RegExp(search, "i") }
            ];
        }

        const restaurants = await Restaurant.find(filter).sort({ rating: -1, popularity: -1 });
        return res.status(200).json({ success: true, restaurants });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

exports.createRestaurant = async (req, res) => {
    try {
        const { name, cuisine, rating, priceRange, deliveryTime, vegetarian, popularity, latitude, longitude } = req.body;

        if (!name || !cuisine) {
            return res.status(400).json({ success: false, message: "Restaurant name and cuisine are required" });
        }

        const restaurant = await Restaurant.create({
            name,
            cuisine,
            rating,
            priceRange,
            deliveryTime,
            vegetarian,
            popularity,
            latitude,
            longitude
        });

        return res.status(201).json({ success: true, message: "Restaurant created", restaurant });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateRestaurant = async (req, res) => {
    try {
        const restaurant = await Restaurant.findByIdAndUpdate(req.params.restaurantId, req.body, { new: true, runValidators: true });
        if (!restaurant) {
            return res.status(404).json({ success: false, message: "Restaurant not found" });
        }

        return res.status(200).json({ success: true, message: "Restaurant updated", restaurant });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

exports.getRecommendations = async (req, res) => {
    try {
        const recommendations = await recommendationService.getRestaurantRecommendations(req.params.userId);
        return res.status(200).json({ success: true, recommendations });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};