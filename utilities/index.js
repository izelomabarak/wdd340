const invModel = require("../models/inventory-model")
const accountModel = require("../models/account-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  console.log(data)
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '<form id="updateForm" action="/cart/add" method="post">'
      grid += '<input type="hidden" name="inv_id" value="' + vehicle.inv_id + '">'
      grid += '<div class="addToCart">'
      grid += '<button type="submit">Add to the cart</button>'
      grid += '</div>'
      grid += '</form>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the car view HTML
* ************************************ */
Util.buildCarDetailsGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<div id="car-display-details">'
    grid +=  '<img src="' + data[0].inv_thumbnail 
    +'" alt="Image of '+ data[0].inv_make + ' ' + data[0].inv_model 
    +' on CSE Motors" />'
    grid += '<div class="carDetails">'
    grid += '<h2>' + data[0].inv_make + ' ' + data[0].inv_model + '</h2>'
    grid += '<div class="carEspifications">'
    grid += '<h2 class="price">' + 'Price:' + ' $' + new Intl.NumberFormat('en-US').format(data[0].inv_price) + '</h2>'
    grid += '<div class="carDetailsInfo">'
    grid += '<h2>' + 'Description: ' + '</h2>'
    grid += '<p>' + data[0].inv_description + '</p>'
    grid += '</div>'
    grid += '<div class="carDetailsInfo2">'
    grid += '<h2>' + 'Color: ' + '</h2>'
    grid += '<p>' + data[0].inv_color + '</p>'
    grid += '</div>'
    grid += '<div class="carDetailsInfo">'
    grid += '<h2>' + 'Miles: ' + '</h2>'
    grid += '<p>' + data[0].inv_miles + '</p>'
    grid += '</div>'
    grid += '</div>'
    grid += '<form id="updateForm" class="addToCart" action="/cart/add" method="post">'
    grid += '<input type="hidden" name="inv_id" value="' + data[0].inv_id + '">'
    grid += '<button type="submit">Add to the cart</button>'
    grid += '</form>'
    grid += '</div>'
    grid += '</div>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicle could be found.</p>'
  }
  return grid
}


/* ***************************
 *  Build option for Add Inventory
 * ************************** */
Util.optionFormCar = async function (classification_id = null) {
    let data = await invModel.getClassifications()
    let classificationList =
      '<select name="classification_id" id="classificationList" required>'
    classificationList += "<option value=''>Choose a Classification</option>"
    data.rows.forEach((row) => {
      classificationList += '<option value="' + row.classification_id + '"'
      if (
        classification_id != null &&
        row.classification_id == classification_id
      ) {
        classificationList += " selected "
      }
      classificationList += ">" + row.classification_name + "</option>"
    })
    classificationList += "</select>"
    return classificationList
  }
  
/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
 if (req.cookies.jwt) {
  jwt.verify(
   req.cookies.jwt,
   process.env.ACCESS_TOKEN_SECRET,
   function (err, accountData) {
    if (err) {
     req.flash("Please log in")
     res.clearCookie("jwt")
     return res.redirect("/account/login")
    }
    res.locals.accountData = accountData
    res.locals.loggedin = 1
    if (accountData.account_type === "Employee" || accountData.account_type === "Admin"){
      res.locals.loggedin = 2
    }
    next()
   })
 } else {
  next()
 }
}

/* ****************************************
 *  Check Login
 * ************************************ */
 Util.checkLoginAccount = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

 /* ****************************************
 *  Check Login Level
 * ************************************ */
 Util.checkLoginLevel = (req, res, next) => {
  if (res.locals.loggedin === 2) {
    next()
  } else {
    req.flash("notice", "Your acount dont have permision to use this function, only employee or admin can use this, log in whit a acoun whit this grades to acces to this page.")
    return res.redirect("/account/login")
  }
 }

/* ****************************************
 *  Modify Header
 * ************************************ */
Util.addHeader = async (req, res, next) => {
  res.locals.header = '';
  if(res.locals.loggedin){
    const account_id = res.locals.accountData.account_id
    const accountData = await accountModel.getAccountById(account_id)
    const name = accountData.account_firstname + " " + accountData.account_lastname
    res.locals.header += '<a class="buyCart" href="/cart/">Check Your Cart</a>'
    res.locals.header += '<a title="Click to view account" href="/account/">Welcome ' + name + '</a>';
    res.locals.header += '<a title="Click to logout" href="/account/logout">Logout</a>';
  } else {
    res.locals.header += '<a title="Click to log in" href="/account/login">My Account</a>';
  }
  next();
}

/* ****************************************
* Create List of Items
* ************************************ */
Util.getCart = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="cart-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/'+ vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<div class="buttons">'
      grid += '<form id="updateForm" class="addInformation" action="/cart/add" method="post">'
      grid += '<input type="hidden" name="inv_id" value="' + vehicle.inv_id + '">'
      grid += '<button type="submit" >Add More</button>'
      grid += '</form>'
      grid += '<form id="updateForm" class="addInformation" action="/cart/eliminate" method="post">'
      grid += '<input type="hidden" name="inv_id" value="' + vehicle.inv_id + '">'
      grid += '<button type="submit" >Rest Item</button>'
      grid += '</form>'
      grid += '</div>'
      const numberItems = parseFloat(vehicle.cart_quantity)
      const priceP = parseFloat(vehicle.inv_price)
      const priceFinal = numberItems * priceP
      grid += '<div class="values">'
      grid += '<span>Price: $' 
      + new Intl.NumberFormat('en-US').format(priceFinal) + '</span>'
      grid += '<p>Number of Items: ' + vehicle.cart_quantity + '</p>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid = '<p class="notice">Sorry, your cart is empty.</p>'
  }
  return grid
}

/* ****************************************
* Get Total Cost of the Cart
* ************************************ */
Util.getTotal = async function(data){
  let grid
  let total = 0;
  if(data.length > 0){
    data.forEach(vehicle => { 
      let cost = parseFloat(vehicle.inv_price);
      cost = cost * parseFloat(vehicle.cart_quantity)
      total = total + cost;
    })
    let taxes = total * .0825
    const shipping = 40
    let totalCost = total + taxes + shipping
    grid = '<span>Total: $' + new Intl.NumberFormat('en-US').format(total) + '</span>'
    grid += '<span>Taxes: $' + new Intl.NumberFormat('en-US').format(taxes) + '</span>'
    grid += '<span>Shipping: $' + new Intl.NumberFormat('en-US').format(shipping) + '</span>'
    grid += '<span>Final Cost: $' + new Intl.NumberFormat('en-US').format(totalCost) + '</span>'
  } else { 
    grid = '<p class="notice">Sorry, your cart is empty.</p>'
  }
  return grid
}

/* ****************************************
* Get Total Cost of the Cart
* ************************************ */
Util.getAmountTotal = async function(data){
  let total = 0;
  data.forEach(vehicle => { 
    let cost = parseFloat(vehicle.inv_price);
    cost = cost * parseFloat(vehicle.cart_quantity)
    total = total + cost;
  })
  let taxes = total * .0825
  const shipping = 40
  let totalCost = total + taxes + shipping
  return totalCost
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util