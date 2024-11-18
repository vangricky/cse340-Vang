const utilities = require("../utilities");
const classificationModel = require("../models/classification-model")

async function addClassification(req, res) {
    let nav = await utilities.getNav();
    const { classification } = req.body
    req.flash("notice", "Successfully Inserted.")
}