// controllers/donorController.js
const Camp = require("../models/campModel");
const Inventory = require("../models/inventoryModel");
const User = require("../models/userModel");

// Get nearby camps (improved version)
const getNearbyCampsController = async (req, res) => {
  try {
    // Get user from authenticated request
    const user = await User.findById(req.user._id).select('city state');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const camps = await Camp.find({
      city: user.city,
      state: user.state,
      date: { $gte: new Date() }
    })
    .sort({ date: 1 })
    .populate('organizer', 'name email');

    res.status(200).json({
      success: true,
      count: camps.length,
      camps
    });

  } catch (error) {
    console.error("Camps Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching camps",
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

// Get recent donations (improved version)
const getRecentDonationsController = async (req, res) => {
  try {
    const donations = await Inventory.find({ inventoryType: "in" })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate({
        path: 'organisation',
        select: 'organisationName address'
      })
      .populate({
        path: 'donar',
        select: 'name bloodGroup'
      });

    res.status(200).json({
      success: true,
      count: donations.length,
      donations
    });

  } catch (error) {
    console.error("Donations Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching donations",
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

// Add dashboard controller
const getDashboardController = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('donations');

    res.status(200).json({
      success: true,
      user
    });
    
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching dashboard data"
    });
  }
};

module.exports = {
  getNearbyCampsController,
  getRecentDonationsController,
  getDashboardController // Add this if needed
};