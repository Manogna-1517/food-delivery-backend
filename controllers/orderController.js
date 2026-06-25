const Order = require("../models/order");
const User = require("../models/User");
const FraudLog = require("../models/FraudLog");
const Restaurant = require("../models/Restaurant");
const fraudService = require("../services/fraudService");
const surgePricingService = require("../services/surgePricingService");
const deliveryAssignmentService = require("../services/deliveryAssignmentService");

const createFraudLogEntry = async ({ userId, orderId, riskScore, reason }) => {
    return FraudLog.create({ userId, orderId, riskScore, reason });
};

exports.createOrder = async (req, res) => {
    try {
        const { userId, amount, items, restaurantId, couponCode } = req.body;

        if (!userId || !amount || !items) {
            return res.status(400).json({
                success: false,
                message: "User ID, amount and items are required"
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (user.isBlocked) {
            return res.status(403).json({ success: false, message: "User account is restricted" });
        }

        const recentOrderCount = await Order.countDocuments({
            userId,
            createdAt: { $gte: new Date(Date.now() - 15 * 60 * 1000) }
        });

        const fraudResult = await fraudService.checkFraud(userId, {
            couponCode,
            recentOrderCount,
            amount
        });

        const deliveryFee = surgePricingService.calculateDeliveryFee({
            orderCount: recentOrderCount,
            hour: new Date().getHours()
        });

        let restaurant = null;
        if (restaurantId) {
            restaurant = await Restaurant.findById(restaurantId);
        }

        const assignedPartner = await deliveryAssignmentService.assignDeliveryPartner({
            restaurantId,
            restaurantLatitude: restaurant?.latitude,
            restaurantLongitude: restaurant?.longitude
        });

        const order = await Order.create({
            userId,
            restaurantId,
            deliveryPartner: assignedPartner?._id,
            amount,
            items,
            deliveryFee,
            couponCode,
            riskScore: fraudResult.riskScore,
            isFraud: fraudResult.isFraud
        });

        if (couponCode) {
            user.couponUsageCount = (user.couponUsageCount || 0) + 1;
            await user.save();
        }

        if (fraudResult.isFraud) {
            await createFraudLogEntry({
                userId,
                orderId: order._id,
                riskScore: fraudResult.riskScore,
                reason: "High-risk order pattern detected"
            });
        }

        return res.status(201).json({
            success: true,
            message: "Order created successfully",
            order
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId);

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        order.status = "cancelled";
        await order.save();

        const user = await User.findById(order.userId);
        if (user) {
            user.cancelCount = (user.cancelCount || 0) + 1;
            if (req.body.refundRequested) {
                user.refundCount = (user.refundCount || 0) + 1;
            }
            await user.save();
        }

        const fraudResult = await fraudService.checkFraud(order.userId, { action: "cancel" });
        if (fraudResult.isFraud) {
            await createFraudLogEntry({
                userId: order.userId,
                orderId: order._id,
                riskScore: fraudResult.riskScore,
                reason: "Repeated cancellations detected"
            });
        }

        return res.status(200).json({ success: true, message: "Order cancelled successfully", order });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

exports.calculateDeliveryFee = async (req, res) => {
    try {
        const fee = surgePricingService.calculateDeliveryFee(req.body);
        return res.status(200).json({ success: true, deliveryFee: fee });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.orderId);

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        order.status = status;
        await order.save();

        return res.status(200).json({ success: true, message: "Order status updated", order });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate("userId", "name email").populate("restaurantId").populate("deliveryPartner");
        res.status(200).json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate("userId", "name email").populate("restaurantId").populate("deliveryPartner");
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        res.status(200).json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        res.status(200).json({ success: true, message: "Order updated", order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        res.status(200).json({ success: true, message: "Order deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};