const express = require("express");
const {
  registerController,
  loginController,
  currentUserController,
} = require("../controllers/authController");
const authMiddelware = require("../middlewares/authMiddleware");

const router = express.Router();

//routes


//LOGIN || POST
router.post("/login", loginController);
//REGISTER || POST

router.post("/register", registerController);

//GET CURRENT USER || GET
router.get("/current-user", authMiddelware, currentUserController);



module.exports = router;