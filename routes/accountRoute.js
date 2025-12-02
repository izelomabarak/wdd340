// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')

// Route to build account view
router.get("/", utilities.checkLoginAccount, utilities.handleErrors(accountController.buildManagement));

// Route to build account view
router.get("/login", utilities.handleErrors(accountController.buildLogin));
//Login prove acount clihient: hello@hola.com pasword: 123fiscatdogosoD#
//Login prove acount Admin: work@pleace.com pasword: paswordepiC1$

// Route to modify account
router.get("/update-view/:account_id", utilities.handleErrors(accountController.buildUpdate));

// Route to build account view
router.get("/registration", utilities.handleErrors(accountController.buildRegister));

// Route to logout account
router.get("/logout", utilities.handleErrors(accountController.logout));

// Route to submit the acount
router.post(
  "/registration",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLogData,
  utilities.handleErrors(accountController.accountLogin)
)

//Edit Acoount
router.post("/update", 
  regValidate.editRules(),
  regValidate.checkEdiData,
  utilities.handleErrors(accountController.updateAccount))

//Edit Password
router.post("/password", 
  regValidate.passwordRules(),
  regValidate.checkPasData,
  utilities.handleErrors(accountController.updatePassword))

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
router.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = router;