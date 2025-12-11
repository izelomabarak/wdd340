// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/")
const cartController = require("../controllers/cartController")
const cartValidate = require('../utilities/cart-validation')

//cart view
router.get("/", utilities.checkLoginAccount, utilities.handleErrors(cartController.buildCart));

//buy view
router.get("/buy", utilities.checkLoginAccount, utilities.handleErrors(cartController.buildBuy));

//add cart
router.post(
  "/add", utilities.checkLoginAccount, utilities.handleErrors(cartController.addCart)
)

//eliminate cart
router.post(
  "/eliminate", utilities.checkLoginAccount, utilities.handleErrors(cartController.eliminateCart)
)

//buy atemp
router.post(
  "/buy",
  utilities.checkLoginAccount,
  cartValidate.buyRules(),
  cartValidate.checkBuyData,
  utilities.handleErrors(cartController.registerPayment)
)

//error handeler
router.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = router;