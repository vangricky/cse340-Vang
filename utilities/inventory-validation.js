const { check, validationResult } = require("express-validator");

/* ***************************
 *  Inventory Validation Rules
 * ************************** */
exports.newInventoryRules = () => {
  return [
    check("inv_make", "Make is required").trim().notEmpty(),
    check("inv_model", "Model is required").trim().notEmpty(),
    check("inv_year", "Year is required and must be a 4-digit number")
      .trim()
      .isNumeric()
      .isLength({ min: 4, max: 4 }),
    check("inv_description", "Description is required").trim().notEmpty(),
    check("inv_price", "Price is required and must be a number")
      .trim()
      .isFloat(),
    check("inv_miles", "Miles is required and must be a number")
      .trim()
      .isNumeric(),
    check("inv_color", "Color is required").trim().notEmpty(),
    check("classification_id", "Classification is required").trim().notEmpty(),
  ];
};

/* ***************************
 *  Validate Update Inventory Data
 * ************************** */
exports.checkUpdateData = async (req, res, next) => {
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;

  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    const utilities = require("./index"); // Adjust path if needed
    const nav = await utilities.getNav();
    const classificationSelect = await utilities.buildClassificationList(
      classification_id
    );
    const itemName = `${inv_make} ${inv_model}`;
    req.flash("error", "Please correct the following errors:");
    return res.status(400).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect,
      errors: errors.array(),
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image: req.body.inv_image,
      inv_thumbnail: req.body.inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    });
  }
  next();
};
