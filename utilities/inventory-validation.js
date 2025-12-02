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
      res.render("inventory/add-classification", {
        errors,
        title: "Add New Classification",
        nav,
        classification_name,
        })
      return
    }
    next()
  }

  // /*  **********************************
  // *  Login Data Validation Rules
  // * ********************************* */
  validate.inventoryRules = () => {
    return [
      body("inv_make")
        .trim()
        .notEmpty()
        .isLength({ min: 3 })
        .withMessage("Please enter a valid make."),

      body("inv_model")
        .trim()
        .notEmpty()
        .isLength({ min: 3 })
        .withMessage("Please enter a valid model."),

      body("inv_description")
        .trim()
        .notEmpty()
        .withMessage("Please enter a valid description."),

      body("inv_image")
        .trim()
        .notEmpty()
        .isLength({ min: 3 })
        .withMessage("Please enter a valid image."),

        
      body("inv_thumbnail")
        .trim()
        .notEmpty()
        .isLength({ min: 3 })
        .withMessage("Please enter a valid thumbnail."),

        
      body("inv_price")
        .notEmpty()
        .isFloat({ min: 0 })
        .withMessage("Please enter a valid price."),

        
      body("inv_year")
        .notEmpty()
        .isInt({ min: 1900, max: 9999 })
        .withMessage("Please enter a valid year."),

        
      body("inv_miles")
        .notEmpty()
        .isInt({ min: 0 })
        .withMessage("Please enter a valid miles."),

      body("inv_color")
        .trim()
        .notEmpty()
        .withMessage("Please enter a valid color."),
        
      body("classification_id")
        .trim()
        .notEmpty()
        .withMessage("Please enter a valid classification."),

    ]
  }
  
  /* ******************************
  * Check data and return errors or continue to registration
  * ***************************** */
  validate.checkInvData = async (req, res, next) => {
    const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      let grid = await utilities.optionFormCar(classification_id)
      res.render("inventory/add-inventory", {
        errors,
        title: "login",
        nav,
        grid,
        classification_id,
        inv_make,
        inv_model,
        inv_description,
        inv_image, 
        inv_thumbnail, 
        inv_price, 
        inv_year, 
        inv_miles, 
        inv_color,
      })
      return
    }
    next()
  }

  /* ******************************
  * Check data and return errors or continue to update
  * ***************************** */
  validate.checkIpdData = async (req, res, next) => {
    const { inv_id, classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      let grid = await utilities.optionFormCar(classification_id)
      const itemName = `${inv_make} ${inv_model}`
      res.render("inventory/edit-inventory", {
        errors,
        title: "Edit " + itemName,
        nav,
        grid,
        inv_id,
        classification_id,
        inv_make,
        inv_model,
        inv_description,
        inv_image, 
        inv_thumbnail, 
        inv_price, 
        inv_year, 
        inv_miles, 
        inv_color,
      })
      return
    }
    next()
  }

module.exports = validate