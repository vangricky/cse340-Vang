const utilities = require("../utilities");
const { body, validationResult } = require("express-validator");
const classificationModel = require("../models/classification-model");
const validate = {};

/*  **********************************
* Classification Data Validation Rules
* ********************************* */

// validate.classificationRules = () => {
//     return [
//         body("classification").trim().notEmpty().withMessage("Classification name is required.").matches(/^[a-zA-Z0-9]+$/).withMessage("Classification name cannot contain spaces or special characters.")
//         .isLength({ min: 3, max: 30 }).withMessage("Classification name must be between 3 and 30 characters long.") 
//     ]
// }