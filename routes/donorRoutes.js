// routes/donorRoutes.js
const express = require('express');
const router = express.Router();
const donorMiddleware = require('../middlewares/donorMiddleware');
const {
  getNearbyCampsController,
  getRecentDonationsController,
  getDashboardController
} = require('../controllers/donorController');

// Protected donor routes
router.get('/camps', donorMiddleware, getNearbyCampsController);
router.get('/recent-donations', donorMiddleware, getRecentDonationsController);
router.get('/dashboard', donorMiddleware, getDashboardController);

module.exports = router;