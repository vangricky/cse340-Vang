const utilities = require("../utilities");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav();
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null,
    });
}

async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  });
}

async function buildManager(req, res, next) {
  let nav = await utilities.getNav();
  const accountData = res.locals.accountData;
  res.render("account/accounts", {
    title: "Account Manager",
    nav,
    errors: null,
    accountData,
  });
}

/* ****************************************
*  Build Update Account View
* *************************************** */
async function buildUpdateAccountView(req, res, next) {
  const account_id = parseInt(req.params.account_id);

  try {
    // Early validation for invalid account_id
    if (isNaN(account_id)) {
      req.flash("error", "Invalid account ID.");
      return res.redirect("/account/accounts");
    }

    console.log("Received account_id:", account_id); // Debugging log

    let nav = await utilities.getNav();
    const accountData = await accountModel.getAccountById(account_id);

    console.log("Fetched accountData:", accountData); // Debugging log

    if (!accountData) {
      req.flash("error", "Account not found.");
      return res.redirect("/account/accounts");
    }

    res.render("account/update-account", {
      title: "Update Account Information",
      nav,
      errors: null,
      account_id: accountData.account_id,
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account_lastname,
      account_email: accountData.account_email,
    });
  } catch (error) {
    console.error("Error loading update account view:", error.message);
    req.flash("error", "Unable to load account update view. Please try again.");
    res.redirect("/account/accounts");
  }
}


/* ****************************************
*  Update Account Information
* *************************************** */
async function updateAccount(req, res, next) {
  const { account_id, account_firstname, account_lastname, account_email } = req.body;
  let nav = await utilities.getNav();

  try {
    const updateResult = await accountModel.updateAccount(
      account_id,
      account_firstname,
      account_lastname,
      account_email
    );

    if (updateResult > 0) {
      req.flash("notice", "Account information updated successfully.");
      return res.redirect("/account/accounts");
    } else {
      req.flash("error", "Failed to update account information.");
      return res.render("account/update-account", {
        title: "Update Account Information",
        nav,
        errors: null,
        account_id,
        account_firstname,
        account_lastname,
        account_email,
      });
    }
  } catch (error) {
    console.error("Error updating account information:", error.message);
    req.flash("error", "An error occurred while updating the account.");
    return res.render("account/update-account", {
      title: "Update Account Information",
      nav,
      errors: null,
      account_id,
      account_firstname,
      account_lastname,
      account_email,
    });
  }
}

/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email, account_password } = req.body;

  try {
    const hashedPassword = await bcrypt.hashSync(account_password, 10);

    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    );

    if (regResult) {
      req.flash(
        "notice",
        `Congratulations, you're registered ${account_firstname}. Please log in.`
      );
      return res.redirect("/account/login");
    } else {
      req.flash("error", "Registration failed. Please try again.");
      return res.render("account/register", {
        title: "Register",
        nav,
        errors: null,
      });
    }
  } catch (error) {
    console.error("Error during registration:", error.message);
    req.flash("error", "An error occurred during registration.");
    res.status(500).render("account/register", {
      title: "Register",
      nav,
      errors: null,
    });
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;

  try {
    const accountData = await accountModel.getAccountByEmail(account_email);

    if (!accountData || !(await bcrypt.compare(account_password, accountData.account_password))) {
      req.flash("error", "Invalid email or password.");
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      });
    }

    delete accountData.account_password;
    const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 });
    res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });

    res.redirect("/account/accounts");
  } catch (error) {
    console.error("Login error:", error.message);
    req.flash("error", "Login failed. Please try again.");
    res.redirect("/account/login");
  }
}

/* ****************************************
 *  Update Account Password
 * *************************************** */
async function updatePassword(req, res, next) {
  const { account_id, new_password } = req.body;
  let nav = await utilities.getNav();

  try {
    const hashedPassword = await bcrypt.hashSync(new_password, 10);

    const updateResult = await accountModel.updatePassword(account_id, hashedPassword);

    if (updateResult.rowCount > 0) {
      req.flash("notice", "Password updated successfully.");
      res.redirect("/account/accounts");
    } else {
      req.flash("error", "Failed to update the password.");
      res.redirect(`/account/update/${account_id}`);
    }
  } catch (error) {
    console.error("Error updating password:", error.message);
    req.flash("error", "An error occurred while updating the password.");
    res.redirect(`/account/update/${account_id}`);
  }
}

/* ****************************************
 *  Process Logout
 * *************************************** */
async function logout(req, res, next) {
  try {
    res.clearCookie("jwt");
    req.flash("notice", "You have successfully logged out.");
    res.redirect("/");
  } catch (error) {
    console.error("Logout error:", error.message);
    req.flash("error", "Logout failed. Please try again.");
    res.redirect("/account/accounts");
  }
}

module.exports = {
  buildLogin,
  buildRegister,
  buildManager,
  registerAccount,
  accountLogin,
  buildUpdateAccountView,
  updateAccount,
  updatePassword,
  logout,
};
