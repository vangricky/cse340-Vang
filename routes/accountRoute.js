const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")

//login view page
router.get("/login", utilities.handleErrors(accountController.buildLogin))
//register view page
router.get("/register", utilities.handleErrors(accountController.buildRegister));

//register post req
router.post("/register", utilities.handleErrors(accountController.registerAccount))


module.exports = router;