const express = require("express");
const authMiddelware = require("../middlewares/authMiddleware");
const {
  createInventoryController,
  getInventoryController,
  getDonarsController,
  getHospitalController,
  getOrganisationController,
  getOrganisationForHospitalController,
  getInventorHospitalController,
  getRecentInventoryController,
} = require("../controllers/inventoryController");

const router = express.Router();

//routes
// ADD INVENTORY || POST
router.post("/create-inventory", authMiddelware, createInventoryController);

//GET ALL BLOOD RECORDS
router.get("/get-inventory", authMiddelware, getInventoryController);

//GET ALL RECENT BLOOD RECORDS
router.get("/get-recent-inventory", authMiddelware, getRecentInventoryController);

//GET HOSPITAL BLOOD RECORDS
router.post("/get-inventory-hospital", authMiddelware, getInventorHospitalController);

//GET ALL DONARS RECORDS
router.get("/get-donars", authMiddelware, getDonarsController);

//GET ALL HOSPITAL RECORDS
router.get("/get-hospitals", authMiddelware, getHospitalController);

//GET ALL ORGANISATION RECORDS
router.get("/get-organisation", authMiddelware, getOrganisationController);

//GET ALL ORGANISATION RECORDS
router.get("/get-organisation-for-hospital", authMiddelware, getOrganisationForHospitalController);


module.exports = router;