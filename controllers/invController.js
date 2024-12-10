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
  const classificationSelect = await utilities.buildClassificationList()
  req.flash("notice", "Welcome to the Inventory Manager.")
  res.render("./inventory/management", {
    title: `Inventory Management`,
    nav,
    classificationSelect,
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



/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  try {
    const classification_id = parseInt(req.params.classification_id); // Parse classification_id to an integer
    const invData = await invModel.getInventoryByClassificationId(classification_id); // Fetch data from the model
    if (invData.length > 0 && invData[0].inv_id) {
      return res.json(invData); // Return inventory data as JSON
    } else {
      next(new Error("No data returned")); // Throw an error if no data is found
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
  const inv_id = parseInt(req.params.inv_id); // Parse inventory ID from URL
  let nav = await utilities.getNav(); // Build navigation
  const itemData = await invModel.getVehicleById(inv_id); // Fetch inventory data
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id); // Build classification dropdown
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`; // Vehicle name

  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id,
  });
};


/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
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
    const itemName = updateResult.inv_make + " " + updateResult.inv_model;
    req.flash("notice", `The ${itemName} was successfully updated.`);
    res.redirect("/inv/");
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id);
    const itemName = `${inv_make} ${inv_model}`;
    req.flash("error", "Update failed. Please try again.");
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect,
      errors: null,
      inv_id,
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
    });
  }
};





module.exports = invCont;