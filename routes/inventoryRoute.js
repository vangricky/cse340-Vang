//Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController")
const utilities = require("../utilities/index.js")

//Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to get a specific vehicle's details by inventory ID
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildVehicleDetail));

router.get("/management", utilities.handleErrors(invController.buildManagementView))

router.get("/add-classification", utilities.handleErrors(invController.buildAddClassificationView))

module.exports = router;