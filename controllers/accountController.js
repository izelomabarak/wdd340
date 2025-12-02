const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

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

/* ****************************************
*  Deliver account management view
* *************************************** */
async function buildManagement (req, res, next) {
  let nav = await utilities.getNav()//getAccountById
  const level = res.locals.loggedin
  const AccountId = res.locals.accountData.account_id
  const accountData = await accountModel.getAccountById(AccountId)
  if (level === 2){
    const grid = `<h2>Welcome ${accountData.account_firstname}</h2>
    <h3>Edit Account</h3>
    <p>
    Modify or update account information
    <a href="/account/update-view/${AccountId}">Update account information</a>.
    </p>
    
    <h3>Inventory Management</h3>
    <p>
    Manage Inventory
    <a href="/inv/">Inventory Management</a>.
    </p>
    `
    res.render("./account/index", {
      title: "Acount Management",
      nav,
      grid,
      errors: null
  })} else {
    const grid = `<h2>Welcome ${accountData.account_firstname}</h2>
    <h3>Edit Account</h3>
    <p>
    Modify or update account information
    <a href="/account/update-view/${AccountId}">Update account information</a>.
    </p>
    `
    res.render("./account/index", {
      title: "Acount Management",
      nav,
      grid,
      errors: null
  })
  }
}

/* ****************************************
*  Deliver update view
* *************************************** */
async function buildUpdate(req, res, next) {
  const AccountId = parseInt(res.locals.accountData.account_id)
  const accountData = await accountModel.getAccountById(AccountId)
  let nav = await utilities.getNav()
  res.render("./account/update-view", {
    title: "Edit Account",
    nav,
    errors: null,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email,
    account_id: AccountId
  })
}

/* **************************************** 
*  Process Registration 
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
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

async function logout(req, res) {
  res.clearCookie("jwt");
  req.flash("notice", `You Logout`)
  res.redirect("/");
}

/* **************************************** 
*  Account Update
* *************************************** */ 
async function updateAccount (req, res) {
  let nav = await utilities.getNav();
  const { account_id, account_firstname, account_lastname, account_email } = req.body;

  const updateResult = await accountModel.updateAccount(
    account_id, account_firstname, account_lastname, account_email
  );

  if (updateResult) {
    req.flash("notice", `Your Account was sucsesfuly Ubdated.`)
    return res.redirect("/account/")
  } else {
    req.flash("notice", "Sorry, the ubdate failed.")
    res.status(501).render("account/update-view", {
    title: "Edit Account",
    nav,
    errors: null,
    account_id, 
    account_firstname, 
    account_lastname, 
    account_email
    })
  }
}

/* **************************************** 
*  Password Update
* *************************************** */ 
async function updatePassword (req, res) {
  let nav = await utilities.getNav();
  const { account_id, account_password } = req.body;

  // Hash the password
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(account_password, 10);
  } catch (error) {
    req.flash("notice", "Sorry, there was an error processing your pasword.");
    return res.status(500).render("account/update-view", {
      title: "Registration",
      nav,
      errors: null,
      account_id
    });
  }

  const updateResult = await accountModel.updatePassword(
    account_id, hashedPassword
  );

  if (updateResult) {
    req.flash("notice", `Your Password was sucsesfuly Changed.`)
    return res.redirect("/account/")
  } else {
    req.flash("notice", "Sorry, the ubdate failed.")
    res.status(501).render("account/update-view", {
    title: "Edit Account",
    nav,
    errors: null,
    account_id
    })
  }
}

/* **************************************** 
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */ 
buildLogin.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
buildRegister.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
registerAccount.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
accountLogin.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
buildManagement.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
logout.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
buildUpdate.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
updateAccount.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
updatePassword.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildManagement, logout, buildUpdate, updateAccount, updatePassword }
