const surgeSettings = {
    baseFee: 3,
    multiplier: 1,
    peakMultiplier: 1.6,
    peakHours: [{ start: 11, end: 14 }, { start: 18, end: 22 }],
    demandWindow: 50
};

const isPeakHour = (hour, settings = surgeSettings) => {
    return settings.peakHours.some((range) => hour >= range.start && hour <= range.end);
};

const calculateDeliveryFee = ({ orderCount = 0, hour = new Date().getHours() } = {}) => {
    const multiplier = isPeakHour(hour) ? surgeSettings.peakMultiplier : surgeSettings.multiplier;
    const demandFactor = 1 + Math.min(orderCount / surgeSettings.demandWindow, 0.8);
    return Number((surgeSettings.baseFee * multiplier * demandFactor).toFixed(2));
};

const updateSurgeSettings = (updates = {}) => {
    Object.assign(surgeSettings, updates);
    return surgeSettings;
};

const getSurgeSettings = () => ({ ...surgeSettings });

module.exports = {
    calculateDeliveryFee,
    updateSurgeSettings,
    getSurgeSettings
};