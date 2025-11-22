const inventoryModel = require("../models/inventory-model")
const utilities = require(".")
  const { body, validationResult } = require("express-validator")
  const validate = {}

  /*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
  validate.classificationRules = () => {
    return [
      body("classification_name")
        .trim()
        .notEmpty()
        .matches(/^[A-Za-z]+$/)
        .withMessage("Classification Name does not meet requirements.")
        .custom(async (classification_name) => {
          const clasificationExists = await inventoryModel.checkExistingClassification(classification_name)
          if (clasificationExists > 0){
            throw new Error("Clasification exists. Please use a different Clasification")
          }
        }),
    ]
  }
  
  /* ******************************
  * Check data and return errors or continue to registration
  * ***************************** */
  validate.checkClaData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("inv/add-classification", {
        errors,
        title: "Add New Classification",
        nav,
        classification_name
      })
      return
    }
    next()
  }

  // /*  **********************************
  // *  Login Data Validation Rules
  // * ********************************* */
//   validate.loginRules = () => {
//     return [
//       body("account_email")
//         .trim()
//         .isEmail()
//         .normalizeEmail()
//         .withMessage("This Email does not have a acount, you mus log in.")
//         .custom(async (account_email) => {
//           const emailExists = await accountModel.checkExistingEmail(account_email)
//           if (emailExists === 0){
//             throw new Error("This Email does not have a acount, you mus log in.")
//           }
//         }),
  
//       body("account_password")
//         .trim()
//         .notEmpty()
//         .withMessage("Incorrect Password, Tried Again")
//         .custom(async (value, { req }) => {
//           const account_email = req.body.account_email; 
//           const account_password = value;

//           const result = await accountModel.checkLoginAccount(
//             account_email,
//             account_password
//           );

//           if (result === 0) {
//             throw new Error("Incorrect Password, Try Again");
//           }
//         })
//     ]
//   }
  
  /* ******************************
  * Check data and return errors or continue to registration
  * ***************************** */
//   validate.checkLogData = async (req, res, next) => {
//     const { account_email } = req.body
//     let errors = []
//     errors = validationResult(req)
//     if (!errors.isEmpty()) {
//       let nav = await utilities.getNav()
//       res.render("account/login", {
//         errors,
//         title: "login",
//         nav,
//         account_email,
//       })
//       return
//     }
//     next()
//   }

module.exports = validate