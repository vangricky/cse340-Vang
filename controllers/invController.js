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
  const nav = await utilities.getNav();
  req.flash("notice", "Add An Inventory");
  res.render("./inventory/add-inventory", {
    title: `Add Inventory`,
    nav,
    errors: null
  })
}



module.exports = invCont;