const axios = require('axios');
const { trackingApiKey, trackingBaseUrl } = require('../config/config');

const headers = {
    'Tracking-Api-Key': trackingApiKey,
    'Content-Type': 'application/json'
};

async function detectCourier(trackingNumber) {
    try {
        const response = await axios.get(`${trackingBaseUrl}/couriers/detect?tracking_number=${trackingNumber}`, { headers });
        return response.data;
    } catch (err) {
        throw err.response?.data || err;
    }
}

async function createTracking(trackingNumber, carrierCode, title = '') {
    try {
        const response = await axios.post(`${trackingBaseUrl}/trackings`, {
            tracking_number: trackingNumber,
            carrier_code: carrierCode,
            title: title
        }, { headers });

        return response.data;
    } catch (err) {
        throw err.response?.data || err;
    }
}

async function getTracking(trackingNumber, carrierCode) {
    try {
        const response = await axios.get(`${trackingBaseUrl}/trackings/${carrierCode}/${trackingNumber}`, { headers });
        return response.data;
    } catch (err) {
        throw err.response?.data || err;
    }
}

module.exports = {
    detectCourier,
    createTracking,
    getTracking
};
