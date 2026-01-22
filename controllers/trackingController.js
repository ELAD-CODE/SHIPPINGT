const trackingService = require('../services/trackingService');

async function detectCourier(req, res) {
    const { trackingNumber } = req.params;
    try {
        const data = await trackingService.detectCourier(trackingNumber);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err });
    }
}

async function createTracking(req, res) {
    const { trackingNumber, carrierCode, title } = req.body;
    try {
        const data = await trackingService.createTracking(trackingNumber, carrierCode, title);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err });
    }
}

async function getTracking(req, res) {
    const { carrierCode, trackingNumber } = req.params;
    try {
        const data = await trackingService.getTracking(trackingNumber, carrierCode);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err });
    }
}

module.exports = {
    detectCourier,
    createTracking,
    getTracking
};
