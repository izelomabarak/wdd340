// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require("../utilities/inventory-validation")

//error
router.get("/error", utilities.handleErrors(invController.errorCode));

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId));

// Route to build Management page
router.get("/", utilities.checkLoginLevel, utilities.handleErrors(invController.buildManagementView));

// Route to build add classification view
router.get("/add-classification", utilities.checkLoginLevel, utilities.handleErrors(invController.buildClassification));

// Route to build add inventory view
router.get("/add-inventory", utilities.checkLoginLevel, utilities.handleErrors(invController.buildAddInventory));

// Route to build add new someting view
router.get("/getInventory/:classification_id", utilities.checkLoginLevel, utilities.handleErrors(invController.getInventoryJSON));

// Route to build add edit the data view
router.get("/edit/:inventoryId", utilities.checkLoginLevel, utilities.handleErrors(invController.editeInventory));

// Route to build add edit the data view
router.get("/delete/:inventoryId", utilities.checkLoginLevel, utilities.handleErrors(invController.deleteInventory));

// Route to submit the classification
router.post(
  "/add-classification",
  utilities.checkLoginLevel,
  invValidate.classificationRules(),
  invValidate.checkClaData,
  utilities.handleErrors(invController.addClassification)
)

// Route to submit the car
router.post(
  "/add-inventory",
  utilities.checkLoginLevel,
  invValidate.inventoryRules(),
  invValidate.checkInvData,
  utilities.handleErrors(invController.addCar)
)

//Edit Fulfit
router.post("/update", 
  utilities.checkLoginLevel,
  invValidate.inventoryRules(),
  invValidate.checkIpdData,
  utilities.handleErrors(invController.updateCar))

//Delet Fulfit
router.post("/delete", 
  utilities.checkLoginLevel,
  utilities.handleErrors(invController.deleteCar))

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
router.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = router;