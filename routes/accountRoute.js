const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require("../utilities/account-validation")

//login view page
router.get("/login", utilities.handleErrors(accountController.buildLogin))
//register view page
router.get("/register", utilities.handleErrors(accountController.buildRegister));

//register post req
router.post("/register",
regValidate.registrationRules(),
regValidate.checkRegData,
 utilities.handleErrors(accountController.registerAccount))

 // Process the login attempt
router.post(
    "/login",
    (req, res) => {
      res.status(200).send('login process')
    }
  )


module.exports = router;