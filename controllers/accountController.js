const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("./account/login", {
    title: "Login",
    nav,
    errors: null
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("./account/registration", {
    title: "Registration",
    nav,
    errors: null
  })
}

/* **************************************** aeaeaeaeaeaeaeA1$
*  Process Registration awqjgfewy1A$
* *************************************** */ 
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email, account_password } = req.body;

  // Hash the password
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(account_password, 10);
  } catch (error) {
    req.flash("notice", "Sorry, there was an error processing your registration.");
    return res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }

  // Register the account
  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );

  if (regResult.rowCount > 0) {
    req.flash(
      "notice",
      `Congratulations, you're registered ${account_firstname}. Please log in.`
    );
    return res.redirect("/account/login");
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    return res.status(500).render("account/register", {
      title: "Registration",
      nav,
    });
  }
}

/* ****************************************
*  Process Login
* *************************************** */
async function loginAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body;
  const loginResult = await accountModel.checkLoginAccount(
    account_email,
    account_password
  );
  if (loginResult > 0) {
    req.flash(
      "notice",
      `Congratulations, you\'re login.`
    )
    return res.redirect("/");
  } else {
    req.flash("notice", "Sorry, the login failed.")
    res.status(501).render("account/login", {
      title: "Login",
      nav,
    })
  }
}

/* **************************************** aaaaaaa1qqaA3#
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
buildLogin.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
buildRegister.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
registerAccount.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
loginAccount.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = { buildLogin, buildRegister, registerAccount, loginAccount}
