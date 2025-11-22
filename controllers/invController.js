const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

invCont.buildByInventoryId = async function (req, res, next) {
  const inventoryId = req.params.inventoryId
  const data = await invModel.getCarByInventoryId(inventoryId)
  const grid = await utilities.buildCarDetailsGrid(data)
  let nav = await utilities.getNav()
  const carName = `${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model}`
  res.render("./inventory/classification", {
    title: carName,
    nav,
    grid,
  })
}

/* ****************************************
 * Build Management View
 **************************************** */
invCont.buildManagementView = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav
    })
}

/* ****************************************
*  Deliver classification view
* *************************************** */
invCont.buildClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null
  })
}

/* **************************************** 
*  Process Adding
* *************************************** */ 
invCont.addClassification = async function (req, res) {
  let nav = await utilities.getNav();
  const { classification_name } = req.body;

  // Register the Classification
  const regResult = await invModel.addClassification(
    classification_name
  );

  if (regResult.rowCount > 0) {
    req.flash(
      "notice",
      `Classification "${classification_name}" added successfully.`
    );
    return res.redirect("/inv");
  } else {
    req.flash("notice", "Sorry, the adition of clasification failed.");
    return res.render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
    });
  }
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
invCont.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

  module.exports = invCont