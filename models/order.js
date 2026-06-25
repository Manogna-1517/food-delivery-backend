const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant"
    },

    deliveryPartner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DeliveryPartner"
    },

    amount: {
        type: Number,
        required: true
    },

    deliveryFee: {
        type: Number,
        default: 0
    },

    couponCode: {
        type: String,
        default: ""
    },

    items: {
        type: Array,
        default: []
    },

    status: {
        type: String,
        enum: [
            "placed",
            "accepted",
            "preparing",
            "out_for_delivery",
            "delivered",
            "cancelled",
            "approved",
            "rejected"
        ],
        default: "placed"
    },

    isFraud: {
        type: Boolean,
        default: false
    },

    riskScore: {
        type: Number,
        default: 0
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Order", orderSchema);