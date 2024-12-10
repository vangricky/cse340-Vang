const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
    errors: null
  })
}

/* ***************************
 *  Build vehicle detail view
 * ************************** */
invCont.buildVehicleDetail = async function (req, res, next) {
  const inventoryId = req.params.inventoryId;
  const vehicleData = await invModel.getVehicleById(inventoryId); 
  const htmlContent = await utilities.buildVehicleDetailHTML(vehicleData);
  let nav = await utilities.getNav();
  res.render("./inventory/detail", {
    title: `${vehicleData.inv_make} ${vehicleData.inv_model}`,
    nav,
    htmlContent,
    errors: null
  });
};

invCont.buildManagementView = async function (req, res, next) {
  const nav = await utilities.getNav()
  
  req.flash("notice", "Welcome to the Inventory Manager.")
  res.render("./inventory/management", {
    title: `Inventory Management`,
    nav,
    errors: null
  })
}

invCont.buildAddClassificationView = async function (req, res, next) {
  const nav = await utilities.getNav()
  req.flash("notice", "Add A Classification");
  res.render("./inventory/add-classification", {
    title: `Add Classification`,
    nav,
    errors: null
  })
}

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
    res.redirect("/error");
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
    }
  } catch (error) {
    console.error("Error adding inventory item:", error.message);
    const nav = await utilities.getNav();
    const classificationDropdown = await utilities.buildClassificationList(classification_id);
    req.flash("error", "Failed to add the inventory item. Please try again.");
    return res.render("./inventory/add-inventory", {
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
  console.log("Submitted form data:", req.body);

};






module.exports = invCont;