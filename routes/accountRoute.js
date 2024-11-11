const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require("../utilities/account-validation")

//login view page
router.get("/login", utilities.handleErrors(accountController.buildLogin))
//register view page
router.get("/register", utilities.handleErrors(accountController.buildRegister));
//account management view, after logging in.
router.get("/accounts", utilities.handleErrors(accountController.buildManager))

//register post req
router.post("/register",
regValidate.registrationRules(),
regValidate.checkRegData,
 utilities.handleErrors(accountController.registerAccount))

 // Process the login attempt
router.post("/login",
regValidate.loginRules(),
regValidate.checkLoginData,
utilities.handleErrors(accountController.accountLogin))


module.exports = router;