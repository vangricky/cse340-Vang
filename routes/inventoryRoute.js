// Needed Resources
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
  classValidate.checkClassificationData,
  utilities.handleErrors(classificationController.addClassification)
);

router.post(
  "/add-inventory",
  checkAdminAccess,
  inventoryValidation.newInventoryRules(),
  utilities.handleErrors(inventoryValidation.checkInventoryData),
  utilities.handleErrors(invController.addInventory)
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
  utilities.handleErrors(inventoryValidation.checkUpdateData),
  utilities.handleErrors(invController.updateInventory)
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