const Order = require("../models/order");
const Restaurant = require("../models/Restaurant");

const getRestaurantRecommendations = async (userId) => {
    const orders = await Order.find({ userId }).populate("restaurantId").sort({ createdAt: -1 }).limit(10);
    const seenCuisine = [];
    const seenRestaurantIds = [];

    orders.forEach((order) => {
        const cuisine = order.restaurantId?.cuisine;
        if (cuisine && !seenCuisine.includes(cuisine)) {
            seenCuisine.push(cuisine);
        }

        if (order.restaurantId?._id && !seenRestaurantIds.includes(order.restaurantId._id.toString())) {
            seenRestaurantIds.push(order.restaurantId._id.toString());
        }
    });

    const restaurants = await Restaurant.find({
        $or: [
            { cuisine: { $in: seenCuisine } },
            { _id: { $nin: seenRestaurantIds } }
        ]
    }).sort({ rating: -1, popularity: -1 }).limit(5);

    return restaurants;
};

module.exports = {
    getRestaurantRecommendations
};