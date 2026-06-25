const express = require("express");
const router = express.Router();

const {
    getFraudOrders,
    approveOrder,
    rejectOrder,
    restrictUser,
    getSurgeSettings,
    setSurgeSettings
} = require("../controllers/adminController");
const { createRestaurant, updateRestaurant } = require("../controllers/restaurantController");

router.get("/test", (req, res) => {
    res.send("Admin route working");
});

router.get("/fraud/orders", getFraudOrders);
router.post("/fraud/approve/:orderId", approveOrder);
router.post("/fraud/reject/:orderId", rejectOrder);
router.post("/restrict-user/:userId", restrictUser);
router.get("/surge-settings", getSurgeSettings);
router.post("/surge-settings", setSurgeSettings);
router.post("/restaurants/create", createRestaurant);
router.put("/restaurants/update/:restaurantId", updateRestaurant);

module.exports = router;