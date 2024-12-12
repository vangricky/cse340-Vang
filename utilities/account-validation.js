const utilities = require("../utilities");
const { body, validationResult } = require("express-validator");
const accountModel = require("../models/account-model");
const validate = {};

/* ******************************
 * Registration Data Validation Rules
 * ***************************** */
validate.registrationRules = () => {
  return [
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a first name."),
    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a last name."),
    body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required.")
      .custom(async (email) => {
        const emailExists = await accountModel.checkExistingEmail(email);
        if (emailExists) {
          throw new Error("Email already exists. Please use a different email.");
        }
      }),
    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password must meet the security requirements."),
  ];
};

validate.checkRegData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    return res.status(400).render("account/register", {
      title: "Register",
      nav,
      errors: errors.array(),
      ...req.body,
    });
  }
  next();
};

/* ******************************
 * Login Validation Rules
 * ***************************** */
validate.loginRules = () => {
  return [
    body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .withMessage("A valid email is required."),
    body("account_password")
      .trim()
      .notEmpty()
      .withMessage("Password is required."),
  ];
};

validate.checkLoginData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    return res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: errors.array(),
      ...req.body,
    });
  }
  next();
};

/* *******************************
 * Account Update Validation Rules
 * ******************************* */
validate.updateAccountRules = () => {
  return [
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("First name is required."),
    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Last name is required."),
    body("account_email")
      .trim()
      .escape()
      .isEmail()
      .withMessage("A valid email is required.")
      .custom(async (email, { req }) => {
        const account = await accountModel.getAccountById(req.body.account_id);
        if (email !== account.account_email) {
          const emailExists = await accountModel.checkExistingEmail(email);
          if (emailExists) {
            throw new Error("Email already exists. Please use a different email.");
          }
        }
      }),
  ];
};

validate.checkUpdateData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    return res.status(400).render("account/update-account", {
      title: "Update Account Information",
      nav,
      errors: errors.array(),
      ...req.body,
    });
  }
  next();
};

/* *******************************
 * Password Update Validation Rules
 * ******************************* */
validate.updatePasswordRules = () => {
  return [
    body("new_password")
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage(
        "Password must be at least 12 characters long and include an uppercase letter, a number, and a special character."
      ),
    body("confirm_password")
      .trim()
      .custom((confirmPassword, { req }) => {
        if (confirmPassword !== req.body.new_password) {
          throw new Error("Passwords must match.");
        }
        return true;
      }),
  ];
};

validate.checkUpdatePasswordData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    return res.status(400).render("account/update-account", {
      title: "Change Password",
      nav,
      errors: errors.array(),
      ...req.body,
    });
  }
  next();
};

module.exports = validate;
