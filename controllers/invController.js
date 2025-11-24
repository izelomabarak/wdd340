const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

invCont.errorCode = async function (req, res, next) {
  const inventoryId = req.params.inventoryId
  const carName = `${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model}`
  res.render("./inventory/classification", {
    title: carName,
    nav,
    grid,
  })
}

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
*  Deliver add classification view
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
*  Deliver add inventory view
* *************************************** */
invCont.buildAddInventory = async function (req, res, next) {
  let grid = await utilities.optionFormCar()
  let nav = await utilities.getNav()
  res.render("inventory/add-inventory", {
    title: "Add New Car",
    nav,
    grid,
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
    res.render("inventory/add-classification", {
      errors,
      title: "Add New Classification",
      nav,
      classification_name
    })
  }
}

/* **************************************** 
*  Inventory Adding
* *************************************** */ 
invCont.addCar = async function (req, res) {
  let nav = await utilities.getNav();
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body;

  // Register the car
  const regResult = await invModel.addCar(
    inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id
  );

  if (regResult.rowCount > 0) {
    req.flash(
      "notice",
      `Car "${inv_make}""${inv_model}" added successfully to the Inventory.`
    );
    return res.redirect("/inv");
  } else {
    req.flash("notice", "Sorry, the adition of car failed.");
    res.render("inventory/add-inventory", {
      errors,
      title: "Add New Car",
      nav,
      classification_name
    })
  }
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
invCont.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

  module.exports = invCont