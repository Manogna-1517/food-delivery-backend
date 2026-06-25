const deliveryAssignmentService = require("../services/deliveryAssignmentService");
const DeliveryPartner = require("../models/DeliveryPartner");

exports.setStatus = async (req, res) => {
    try {
        const { partnerId, available } = req.body;

        if (!partnerId) {
            return res.status(400).json({ success: false, message: "partnerId is required" });
        }

        const partner = await deliveryAssignmentService.updatePartnerAvailability(partnerId, available !== false);
        return res.status(200).json({ success: true, message: "Delivery status updated", partner });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

exports.getDeliveryPartners = async (req, res) => {
    try {
        const partners = await DeliveryPartner.find().sort({ available: -1, currentOrders: 1 });
        return res.status(200).json({ success: true, partners });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};