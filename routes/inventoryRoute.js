// inventoryRoute.js - Fixed inventoryValidation.checkInventoryData Error
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const classificationController = require("../controllers/classificationController");
const utilities = require("../utilities/index.js");
const classValidate = require("../utilities/classification-validation");
const inventoryValidation = require("../utilities/inventory-validation"); // Import validation

// Middleware to check admin access
const checkAdminAccess = utilities.checkAdminAccess;

// Route to build inventory by classification view
router.get(
  "/",
  checkAdminAccess,
  utilities.handleErrors(invController.buildManagementView)
);

router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
);

router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
);

// Route to get a specific vehicle's details by inventory ID
router.get(
  "/detail/:inventoryId",
  utilities.handleErrors(invController.buildVehicleDetail)
);

router.get(
  "/add-classification",
  checkAdminAccess,
  utilities.handleErrors(invController.buildAddClassificationView)
);

router.get(
  "/add-inventory",
  checkAdminAccess,
  utilities.handleErrors(invController.buildAddInventoryView)
);

// Add classification POST request
router.post(
  "/add-classification",
  checkAdminAccess,
  classValidate.classificationRules(),
  utilities.handleErrors(classValidate.checkClassificationData),
  utilities.handleErrors(classificationController.addClassification)
);

router.post(
  "/add-inventory",
  checkAdminAccess,
  inventoryValidation.newInventoryRules(), // Ensure this returns an array of rules
  utilities.handleErrors((req, res, next) => inventoryValidation.checkUpdateData(req, res, next)), // Use checkUpdateData for consistency
  utilities.handleErrors((req, res, next) => invController.addInventory(req, res, next)) // Wrap with handleErrors
);

// Route to edit inventory item by ID
router.get(
  "/edit/:inv_id",
  checkAdminAccess,
  utilities.handleErrors(invController.editInventoryView)
);

// Route to handle inventory updates
router.post(
  "/update",
  checkAdminAccess,
  inventoryValidation.newInventoryRules(),
  utilities.handleErrors((req, res, next) => inventoryValidation.checkUpdateData(req, res, next)),
  utilities.handleErrors((req, res, next) => invController.updateInventory(req, res, next))
);

// Route to render the delete confirmation view
router.get(
  "/delete/:inv_id",
  checkAdminAccess,
  utilities.handleErrors(invController.deleteConfirmationView)
);

// Route to handle the deletion of an inventory item
router.post(
  "/delete",
  checkAdminAccess,
  utilities.handleErrors(invController.deleteInventoryItem)
);

module.exports = router;
