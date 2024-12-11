//Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const classificationController = require("../controllers/classificationController");
const utilities = require("../utilities/index.js");
const classValidate = require("../utilities/classification-validation")
const inventoryValidation = require("../utilities/inventory-validation"); // Import validation


//Route to build inventory by classification view
router.get("/", utilities.handleErrors(invController.buildManagementView))

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

// router.get(
//   "/management",
//   utilities.handleErrors(invController.buildManagementView)
// );

router.get(
  "/add-classification",
  utilities.handleErrors(invController.buildAddClassificationView)
);

router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventoryView))

//add classification post req
router.post(
  "/add-classification", classValidate.classificationRules(), classValidate.checkClassificationData,
  utilities.handleErrors(classificationController.addClassification)
);

router.post(
  "/add-inventory",
  utilities.handleErrors(invController.addInventory) 
);

// Route to edit inventory item by ID
router.get(
  "/edit/:inv_id",
  utilities.handleErrors(invController.editInventoryView)
);

// Route to handle inventory updates
router.post(
  "/update",
  inventoryValidation.newInventoryRules(), // Apply validation rules
  utilities.handleErrors(inventoryValidation.checkUpdateData), // Validate data
  utilities.handleErrors(invController.updateInventory) // Update inventory
);

// Route to render the delete confirmation view
router.get(
  "/delete/:inv_id",
  utilities.handleErrors(invController.deleteConfirmationView)
);

// Route to handle the deletion of an inventory item
router.post(
  "/delete",
  utilities.handleErrors(invController.deleteInventoryItem)
);



module.exports = router;
