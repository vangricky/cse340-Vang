//Needed Resources
const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities");
const regValidate = require("../utilities/account-validation");

//login view page
router.get("/login", utilities.handleErrors(accountController.buildLogin));

//register view page
router.get("/register", utilities.handleErrors(accountController.buildRegister));

//account management view, after logging in.
router.get("/accounts", utilities.checkLogin, utilities.handleErrors(accountController.buildManager));

// Logout route
router.get("/logout", utilities.handleErrors(accountController.logout));


//route to render account update view
router.get(
    "/update/:account_id",
    utilities.checkLogin,
    utilities.handleErrors(accountController.buildUpdateAccountView)
  );

//route to process account update
router.post(
    "/update",
    regValidate.updateAccountRules(),
    utilities.handleErrors(regValidate.checkUpdateData),
    utilities.handleErrors(accountController.updateAccount)
  );

//route to process password update
router.post(
  "/update-password",
  utilities.checkLogin,
  regValidate.updatePasswordRules(),
  utilities.handleErrors(regValidate.checkUpdatePasswordData),
  utilities.handleErrors(accountController.updatePassword)
);

//register post req
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

//process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);
  

module.exports = router;
