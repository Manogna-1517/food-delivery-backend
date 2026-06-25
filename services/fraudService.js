const User = require("../models/User");
const Order = require("../models/order");

const calculateRiskScore = (user, context = {}) => {
    let score = 0;

    const cancelCount = user.cancelCount || 0;
    const refundCount = user.refundCount || 0;
    const couponUsageCount = user.couponUsageCount || 0;
    const recentOrderCount = context.recentOrderCount || 0;
    const hasCoupon = Boolean(context.couponCode);

    if (cancelCount >= 3) {
        score += 40;
    }

    if (refundCount >= 3) {
        score += 40;
    }

    if (couponUsageCount >= 5) {
        score += 20;
    }

    if (recentOrderCount >= 3) {
        score += 25;
    }

    if (hasCoupon) {
        score += 10;
    }

    return score;
};

const checkFraud = async (userId, context = {}) => {
    try {
        const user = await User.findById(userId);

        if (!user) {
            return {
                riskScore: 0,
                isFraud: false
            };
        }

        const recentOrders = await Order.find({
            userId,
            createdAt: { $gte: new Date(Date.now() - 15 * 60 * 1000) }
        }).countDocuments();

        const riskScore = calculateRiskScore(user, {
            ...context,
            recentOrderCount: recentOrders
        });

        return {
            riskScore,
            isFraud: riskScore >= 40
        };

    } catch (error) {
        console.log(error);

        return {
            riskScore: 0,
            isFraud: false
        };
    }
};

module.exports = {
    calculateRiskScore,
    checkFraud
};