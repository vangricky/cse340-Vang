const utilities = require("../utilities");
const { body, validationResult } = require("express-validator");
const classificationModel = require("../models/classification-model");
const validate = {};

/*  **********************************
* Classification Data Validation Rules
* ********************************* */

validate.classificationRules = () => {
    return [
        body("classification")
            .trim()
            .notEmpty()
            .withMessage("Classification name is required.")
            .matches(/^[a-zA-Z0-9]+$/)
            .withMessage("Classification name cannot contain spaces or special characters.")
            .isLength({ min: 3, max: 30 })
            .withMessage("Classification name must be between 3 and 30 characters long.")
    ];
};

validate.checkClassificationData = async (req, res, next) => {
    const { classification } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        res.render("inventory/add-classification", {
            errors,
            title: "Add Classification",
            nav,
            classification
        })
        return
    }
    next()
}


module.exports = validate