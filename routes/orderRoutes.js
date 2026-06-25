const express = require("express");
const router = express.Router();

const {
    createOrder,
    getOrders,
    getOrderById,
    updateOrder,
    deleteOrder,
    cancelOrder,
    calculateDeliveryFee,
    updateOrderStatus
} = require("../controllers/orderController");

router.post("/", createOrder);
router.post("/create", createOrder);
router.post("/cancel/:orderId", cancelOrder);
router.post("/calculate-delivery-fee", calculateDeliveryFee);
router.post("/update-status/:orderId", updateOrderStatus);
router.get("/", getOrders);
router.get("/:id", getOrderById);
router.put("/:id", updateOrder);
router.delete("/:id", deleteOrder);

module.exports = router;