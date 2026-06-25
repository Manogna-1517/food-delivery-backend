const mongoose = require("mongoose");

const fraudLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order"
    },

    riskScore: Number,

    reason: String,

    actionTaken: {
        type: String,
        default: "Pending Review"
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("FraudLog", fraudLogSchema);