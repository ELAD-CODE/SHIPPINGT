require('dotenv').config();

module.exports = {
    port: process.env.PORT || 3000,
    trackingApiKey: process.env.TRACKINGMORE_API_KEY,
    trackingBaseUrl: 'https://api.trackingmore.com/v4'
};
