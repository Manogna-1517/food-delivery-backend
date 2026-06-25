const mongoose = require("mongoose");

const deliveryPartnerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: String,
    latitude: Number,
    longitude: Number,
    available: {
        type: Boolean,
        default: true
    },
    currentOrders: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model(
    "DeliveryPartner",
    deliveryPartnerSchema
);