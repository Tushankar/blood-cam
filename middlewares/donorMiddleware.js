const userModel = require("../models/userModel");

module.exports = async (req, res, next) => {
  try {
    // Verify user exists in request
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    // Get full user document
    const user = await userModel.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Check role spelling matches your schema
    if (user.role !== "donar") {
      return res.status(403).json({
        success: false,
        message: "Donor access required"
      });
    }

    next();
  } catch (error) {
    console.error("Middleware error:", error);
    res.status(500).json({
      success: false,
      message: "Authorization check failed"
    });
  }
};