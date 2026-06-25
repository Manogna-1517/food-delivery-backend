const DeliveryPartner = require("../models/DeliveryPartner");
const Restaurant = require("../models/Restaurant");

const toRadians = (value) => (value * Math.PI) / 180;

const calculateDistanceInKm = (lat1, lon1, lat2, lon2) => {
    const earthRadiusKm = 6371;
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusKm * c;
};

const assignDeliveryPartner = async ({ restaurantId, restaurantLatitude, restaurantLongitude }) => {
    const restaurant = restaurantId ? await Restaurant.findById(restaurantId) : null;
    const latitude = restaurantLatitude ?? restaurant?.latitude ?? 0;
    const longitude = restaurantLongitude ?? restaurant?.longitude ?? 0;

    const partners = await DeliveryPartner.find({ available: true }).sort({ currentOrders: 1 });

    if (!partners.length) {
        return null;
    }

    const rankedPartners = partners
        .map((partner) => ({
            partner,
            distance: calculateDistanceInKm(latitude, longitude, partner.latitude || 0, partner.longitude || 0)
        }))
        .sort((a, b) => a.distance - b.distance || a.partner.currentOrders - b.partner.currentOrders);

    const selected = rankedPartners[0]?.partner;

    if (selected) {
        selected.currentOrders = (selected.currentOrders || 0) + 1;
        await selected.save();
    }

    return selected;
};

const updatePartnerAvailability = async (partnerId, available) => {
    return DeliveryPartner.findByIdAndUpdate(partnerId, { available }, { new: true });
};

module.exports = {
    assignDeliveryPartner,
    updatePartnerAvailability
};