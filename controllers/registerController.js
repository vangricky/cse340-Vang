const utilities = require("../utilities")

/* ****************************************
*  Deliver Register View
* *************************************** */

async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("register/register", {
    title: "Login",
    nav,
  })
}

module.exports = buildRegister;