const utilities = require("../utilities");
const classificationModel = require("../models/classification-model");

async function addClassification(req, res) {
  let nav = await utilities.getNav();
  const { classification } = req.body;

  const classificationResult = await classificationModel.addClassification(
    classification
  );

  if (classificationResult) {
    req.flash(
      "notice",
      `Classification: ${classification}, successfully inserted.`
    );
    res.status(201).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Failed to insert classification, please try again.");
    res.status(501).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
    });
  }
}

module.exports = { addClassification };
