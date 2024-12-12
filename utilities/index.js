const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Util = {}
const inventoryValidation = require("./inventory-validation");


/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  console.log(data)
  let list = "<ul class='nav-list'>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* ***************************
 *  Build HTML for specific vehicle detail
 * ************************** */
Util.buildVehicleDetailHTML = function (vehicle) {
  if (!vehicle) return "<p>Vehicle not found.</p>";
  
  let html = `<h1 class="vehicle-name">${vehicle.inv_make} ${vehicle.inv_model}</h1>`;
  html += `<img class="details-img" src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}" />`;
  html += `<div class="details">`;
  html += `<p><strong>Make:</strong> ${vehicle.inv_make}</p>`;
  html += `<p><strong>Model:</strong> ${vehicle.inv_model}</p>`;
  html += `<p><strong>Year:</strong> ${vehicle.inv_year}</p>`;
  html += `<p><strong>Price:</strong> $${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</p>`;
  html += `<p><strong>Mileage:</strong> ${new Intl.NumberFormat('en-US').format(vehicle.inv_miles)} miles</p>`;
  html += `<p><strong>Description:</strong> ${vehicle.inv_description}</p>`;
  html += `</div>`;
  
  return html;
};

Util.buildClassificationList = async function (selectedClassification = null) {
  try {
    const data = await invModel.getClassifications(); // Fetch classifications
    let classificationList =
      '<select class="login-inputs" name="classification_id" id="classificationList" required>';
    classificationList += "<option value=''>Choose a Classification</option>";
    data.rows.forEach((row) => {
      classificationList += `<option value="${row.classification_id}"`;
      if (selectedClassification && row.classification_id === selectedClassification) {
        classificationList += " selected";
      }
      classificationList += `>${row.classification_name}</option>`;
    });
    classificationList += "</select>";
    return classificationList;
  } catch (error) {
    console.error("Error building classification list:", error.message);
    throw error;
  }
};



/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET, (err, accountData) => {
      if (err) {
        req.flash("notice", "Please log in.");
        res.clearCookie("jwt");
        res.locals.loggedin = false;
        return res.redirect("/account/login");
      }
      res.locals.accountData = accountData;
      res.locals.loggedin = true;
      next();
    });
  } else {
    res.locals.loggedin = false;
    next();
  }
};





/*****************************************
* Middleware For Handling Errors
* Wrap other functions in this for
* General Error Handling
****************************************/
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

/* ****************************************
 *  Check Login
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

 /**
 * Middleware to check if the user is logged in and has the correct account type.
 * Only allows access if the account type is "Employee" or "Admin".
 */
Util.checkAdminAccess = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET, (err, accountData) => {
      if (err || !accountData) {
        req.flash("notice", "You must be logged in to access this page.");
        return res.redirect("/account/login");
      }

      // Check account type
      if (accountData.account_type === "Employee" || accountData.account_type === "Admin") {
        res.locals.accountData = accountData;
        res.locals.loggedin = true;
        next(); // User has access
      } else {
        req.flash("notice", "You do not have permission to access this page.");
        return res.redirect("/account/login");
      }
    });
  } else {
    req.flash("notice", "You must be logged in to access this page.");
    res.redirect("/account/login");
  }
};


 module.exports = {
  ...Util,
  inventoryValidation,
};