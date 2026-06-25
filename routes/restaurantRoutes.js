const express = require("express");
const router = express.Router();

const { searchRestaurants, getRecommendations } = require("../controllers/restaurantController");

router.get("/search", searchRestaurants);
router.get("/recommendations/:userId", getRecommendations);

module.exports = router;