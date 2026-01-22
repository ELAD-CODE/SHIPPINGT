const express = require('express');
const router = express.Router();
const trackingController = require('../controllers/trackingController');

// זיהוי חברת שילוח
router.get('/detect/:trackingNumber', trackingController.detectCourier);

// יצירת מעקב
router.post('/trackings', trackingController.createTracking);

// קבלת סטטוס מעקב
router.get('/trackings/:carrierCode/:trackingNumber', trackingController.getTracking);

module.exports = router;
