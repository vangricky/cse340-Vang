const express = require("express")
const router = new express.Router()
const registerController = require("../controllers/registerController")
const utilities = require("../utilities")

router.get("/", utilities.handleErrors(registerController.buildRegister));
router.post("/register", utilities.handleErrors(registerController.buildRegister));

module.exports = router;