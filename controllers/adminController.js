const FraudLog = require("../models/FraudLog");
const Order = require("../models/order");
const User = require("../models/User");
const surgePricingService = require("../services/surgePricingService");

const getFraudOrders = async (req, res) => {
    try {
        const fraudOrders = await FraudLog.find().populate("userId").populate("orderId").sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            fraudOrders
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const approveOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        order.status = "approved";
        await order.save();

        const fraudLog = await FraudLog.findOne({ orderId: order._id });
        if (fraudLog) {
            fraudLog.actionTaken = "Approved";
            await fraudLog.save();
        }

        res.json({
            success: true,
            message: "Order approved"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const rejectOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        order.status = "rejected";
        await order.save();

        const fraudLog = await FraudLog.findOne({ orderId: order._id });
        if (fraudLog) {
            fraudLog.actionTaken = "Rejected";
            await fraudLog.save();
        }

        res.json({
            success: true,
            message: "Order rejected"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const restrictUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        user.isBlocked = true;
        user.blockReason = req.body.reason || "Suspicious activity";
        await user.save();

        res.json({
            success: true,
            message: "User restricted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getSurgeSettings = async (req, res) => {
    try {
        res.status(200).json({ success: true, settings: surgePricingService.getSurgeSettings() });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const setSurgeSettings = async (req, res) => {
    try {
        const settings = surgePricingService.updateSurgeSettings(req.body);
        res.status(200).json({ success: true, message: "Surge settings updated", settings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getFraudOrders,
    approveOrder,
    rejectOrder,
    restrictUser,
    getSurgeSettings,
    setSurgeSettings
};