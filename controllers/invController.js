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
  const classificationSelect = await utilities.optionFormCar()
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    classificationSelect
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
      errors: null,
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
  let grid = await utilities.optionFormCar()
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
      errors: null,
      title: "Add New Car",
      grid,
      nav
    })
  }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Return Edit View
 * ************************** */
invCont.editeInventory = async function (req, res, next) {
  const inv_id = parseInt(req.params.inventoryId)
  const itemData = await invModel.getCarByInventoryId(inv_id)
  let grid = await utilities.optionFormCar(itemData[0].classification_id)
  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
  let nav = await utilities.getNav()
  console.log(itemData)
  res.render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    grid,
    errors: null,
    inv_id: itemData[0].inv_id,
    inv_make: itemData[0].inv_make,
    inv_model: itemData[0].inv_model,
    inv_year: itemData[0].inv_year,
    inv_description: itemData[0].inv_description,
    inv_image: itemData[0].inv_image,
    inv_thumbnail: itemData[0].inv_thumbnail,
    inv_price: itemData[0].inv_price,
    inv_miles: itemData[0].inv_miles,
    inv_color: itemData[0].inv_color,
    classification_id: itemData[0].classification_id
  })
}

/* **************************************** 
*  Inventory Update
* *************************************** */ 
invCont.updateCar = async function (req, res) {
  let nav = await utilities.getNav();
  const { inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body;

  // Register the car
  const updateResult = await invModel.updateCar(
    inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id
  );

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    return res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.optionFormCar(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the ubdate failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    grid: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

/* **************************************** 
*  Return delete View
* *************************************** */ 
invCont.deleteInventory = async function (req, res, next) {
  const inv_id = parseInt(req.params.inventoryId)
  let nav = await utilities.getNav()
  const itemData = await invModel.getCarByInventoryId(inv_id)
  let grid = await utilities.optionFormCar(itemData[0].classification_id)
  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
  console.log(itemData)
  res.render("inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    grid,
    errors: null,
    inv_id: itemData[0].inv_id,
    inv_make: itemData[0].inv_make,
    inv_model: itemData[0].inv_model,
    inv_year: itemData[0].inv_year,
    inv_price: itemData[0].inv_price,
    classification_id: itemData[0].classification_id
  })
}

/* **************************************** 
*  Inventory Delete
* *************************************** */ 
invCont.deleteCar = async function (req, res) {
  let nav = await utilities.getNav();
  const inv_id = parseInt(req.body.inv_id);
  const {  inv_make, inv_model, inv_year, inv_price, classification_id } = req.body;

  // Delet the car
  const deleteResult = await invModel.deleteCar(
    inv_id
  );

  if (deleteResult) {
    req.flash("notice", `The car was successfully deleted.`)
    return res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.optionFormCar(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/delet-confirm", {
    title: "Delete " + itemName,
    nav,
    grid: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_price,
    classification_id
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