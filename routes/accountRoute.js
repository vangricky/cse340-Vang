const express = require("express")
const router = new express.Router()
const accController = require("../controllers/accController")
const util = require("../utilities")

router.get("/login", accController)

module.exports = router;