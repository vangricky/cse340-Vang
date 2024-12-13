const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  try {
    const data = await invModel.getInventoryByClassificationId(classification_id);
    let nav = await utilities.getNav();

    // Check if data is empty
    if (!data || data.length === 0) {
      req.flash("notice", "Sorry, no vehicles available at this time.");
      return res.render("./inventory/classification", {
        title: "Vehicle Inventory",
        nav,
        grid: null,
        errors: null,
      });
    }

    const grid = await utilities.buildClassificationGrid(data);
    const className = data[0].classification_name;
    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
      errors: null,
    });
  } catch (error) {
    console.error("Error building inventory by classification ID:", error.message);
    req.flash("error", "Unable to load the inventory. Please try again later.");
    res.redirect("/");
  }
};

/* ***************************
 *  Build vehicle detail view
 * ************************** */
invCont.buildVehicleDetail = async function (req, res, next) {
  try {
    const inventoryId = req.params.inventoryId;
    const vehicleData = await invModel.getVehicleById(inventoryId);
    if (!vehicleData) {
      throw new Error("Vehicle not found");
    }
    const htmlContent = await utilities.buildVehicleDetailHTML(vehicleData);
    let nav = await utilities.getNav();
    res.render("./inventory/detail", {
      title: `${vehicleData.inv_make} ${vehicleData.inv_model}`,
      nav,
      htmlContent,
      errors: null,
    });
  } catch (error) {
    console.error("Error building vehicle detail view:", error.message);
    req.flash("error", "Unable to load the vehicle details. Please try again.");
    res.redirect("/");
  }
};

invCont.buildManagementView = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();
    const classificationSelect = await utilities.buildClassificationList();
    req.flash("notice", "Welcome to the Inventory Manager.");
    res.render("./inventory/management", {
      title: `Inventory Management`,
      nav,
      classificationSelect,
      errors: null,
    });
  } catch (error) {
    console.error("Error loading management view:", error.message);
    req.flash("error", "Unable to load the management page. Please try again.");
    res.redirect("/");
  }
};

invCont.buildAddClassificationView = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();
    req.flash("notice", "Add A Classification");
    res.render("./inventory/add-classification", {
      title: `Add Classification`,
      nav,
      errors: null,
    });
  } catch (error) {
    console.error("Error loading add classification view:", error.message);
    req.flash("error", "Unable to load the page. Please try again.");
    res.redirect("/");
  }
};

invCont.buildAddInventoryView = async function (req, res, next) {
  try {
    const nav = await utilities.getNav(); // Navigation
    const classificationDropdown = await utilities.buildClassificationList(); // Fetch and build the dropdown
    res.render("./inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationDropdown, // Pass the dropdown to the view
      errors: null,
    });
  } catch (error) {
    console.error("Error loading add-inventory view:", error.message); // Log the error
    req.flash("error", "Unable to load the page. Please try again.");
    res.redirect("/");
  }
};

invCont.addInventory = async function (req, res, next) {
  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;

  try {
    const newInventory = await invModel.addNewInventory(
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    );
    if (newInventory) {
      req.flash("notice", "The new inventory item was successfully added.");
      return res.redirect("/inv/add-inventory");
    } else {
      throw new Error("Failed to add inventory item.");
    }
  } catch (error) {
    console.error("Error adding inventory item:", error.message);
    const nav = await utilities.getNav();
    const classificationDropdown = await utilities.buildClassificationList();
    req.flash("error", "Failed to add the inventory item. Please try again.");
    res.render("./inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationDropdown,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      errors: error.message,
    });
  }
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  try {
    const classification_id = parseInt(req.params.classification_id); // Parse classification_id to an integer
    const invData = await invModel.getInventoryByClassificationId(classification_id); // Fetch data from the model
    if (invData && invData.length > 0) {
      return res.json(invData); // Return inventory data as JSON
    } else {
      throw new Error("No inventory data found.");
    }
  } catch (error) {
    console.error("Error fetching inventory as JSON:", error.message);
    res.status(500).json({ message: "Internal Server Error. Please try again later." });
  }
};

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.inv_id); // Parse inventory ID from URL
    const nav = await utilities.getNav(); // Build navigation
    const itemData = await invModel.getVehicleById(inv_id); // Fetch inventory data
    if (!itemData) {
      throw new Error("Item not found.");
    }
    const classificationSelect = await utilities.buildClassificationList(itemData.classification_id); // Build classification dropdown
    res.render("./inventory/edit-inventory", {
      title: `Edit ${itemData.inv_make} ${itemData.inv_model}`,
      nav,
      classificationSelect,
      ...itemData,
      errors: null,
    });
  } catch (error) {
    console.error("Error loading edit inventory view:", error.message);
    req.flash("error", "Unable to load the edit page. Please try again.");
    res.redirect("/");
  }
};

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;

  try {
    const updateResult = await invModel.updateInventory(
      inv_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id
    );
    if (updateResult) {
      req.flash("notice", `The ${updateResult.inv_make} ${updateResult.inv_model} was successfully updated.`);
      return res.redirect("/inv/");
    } else {
      throw new Error("Update failed.");
    }
  } catch (error) {
    console.error("Error updating inventory:", error.message);
    const nav = await utilities.getNav();
    const classificationSelect = await utilities.buildClassificationList(classification_id);
    req.flash("error", "Update failed. Please try again.");
    res.status(501).render("inventory/edit-inventory", {
      title: `Edit ${inv_make} ${inv_model}`,
      nav,
      classificationSelect,
      inv_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
      errors: error.message,
    });
  }
};

/* ***************************
 *  Deliver Delete Confirmation View
 * ************************** */
invCont.deleteConfirmationView = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.inv_id);
    const itemData = await invModel.getVehicleById(inv_id); // Fetch item details
    if (!itemData) {
      throw new Error("Item not found.");
    }
    const nav = await utilities.getNav();
    res.render("./inventory/delete-confirm", {
      title: `Delete ${itemData.inv_make} ${itemData.inv_model}`,
      nav,
      ...itemData,
      errors: null,
    });
  } catch (error) {
    console.error("Error loading delete confirmation view:", error.message);
    req.flash("error", "Unable to load the delete confirmation page. Please try again.");
    res.redirect("/");
  }
};

/* ***************************
 *  Delete Inventory Item
 * ************************** */
invCont.deleteInventoryItem = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.body.inv_id);
    const deleteResult = await invModel.deleteInventoryItem(inv_id); // Perform deletion

    if (deleteResult.rowCount > 0) {
      req.flash("notice", "The vehicle was successfully deleted.");
      res.redirect("/inv/");
    } else {
      throw new Error("Failed to delete the vehicle.");
    }
  } catch (error) {
    console.error("Error deleting inventory item:", error.message);
    req.flash("error", "Failed to delete the vehicle. Please try again.");
    res.redirect(`/inv/delete/${req.body.inv_id}`);
  }
};

module.exports = invCont;
