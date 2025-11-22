// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId));

// Route to build Management page
router.get("/", utilities.handleErrors(invController.buildManagementView));

// Route to build account view
router.get("/add-classification", utilities.handleErrors(invController.buildClassification));

// Route to submit the acount
router.post(
  "/add-classification",
  invValidate.classificationRules(),
  invValidate.checkClaData,
  utilities.handleErrors(invController.addClassification)
)

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
router.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = router;