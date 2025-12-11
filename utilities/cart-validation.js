const cartModel = require("../models/cart-model")
const utilities = require(".")
  const { body, validationResult } = require("express-validator")
  const validate = {}

//login buy
  validate.buyRules = () => {
    return [
      body("firstname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."),
  
      body("lastname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a last name."), 

      body("street")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a street"),
  
      body("city")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a city."), 

      body("state")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a state."),
  
      body("zip")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a zip."), 
    
      body("cardNumber")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a cart number."),
  
      body("payment_expiration")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a expiation."), 

      body("payment_code")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a CVV."), 
    ]
  }

//return errors or continue
    validate.checkBuyData = async (req, res, next) => {
      const { firstname, lastname, street, city, state, zip, payment_expiration, payment_code } = req.body
      let errors = []
      let id = res.locals.accountData.enter_id
      let data = await cartModel.getCart(id)
      let total = await utilities.getTotal(data)
      errors = validationResult(req)
      if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("./cart/buy", {
          errors,
          title: "Registration",
          nav,
          total, 
          firstname, 
          lastname, 
          street, 
          city, 
          state, 
          zip, 
          payment_expiration, 
          payment_code
        })
        return
      }
      next()
    }

module.exports = validate