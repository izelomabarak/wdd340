const utilities = require("../utilities/")
const cartModel = require("../models/cart-model")

const cartCont = {}

//cart view
cartCont.buildCart = async function (req, res, next) {
  let id = res.locals.accountData.account_id
  let data = await cartModel.getCart(id)
  let nav = await utilities.getNav()
  let elements = await utilities.getCart(data)
  let total = await utilities.getTotal(data)
  res.render("./cart/", {
    title: "Your Cart",
    nav,
    elements, 
    total,
    errors: null
  })
}

//buy view
cartCont.buildBuy = async function (req, res, next) {
  let id = res.locals.accountData.account_id
  let data = await cartModel.getCart(id)
  let total = await utilities.getTotal(data)
  let nav = await utilities.getNav()
  res.render("./cart/buy", {
    title: "Login",
    nav,
    total,
    errors: null
  })
}

//add
cartCont.addCart = async function (req, res, next) {
  let account_id = res.locals.accountData.account_id
  const { inv_id } = req.body
  let info = await cartModel.cart(account_id)
  let number = 0
  let repeted = 0
  info.forEach(element => {
    if (element.inv_id == inv_id){
        number = element.cart_quantity
        repeted = 1
    }
  });
  if (repeted === 1){
    number = parseFloat(number)
    number = number + 1
    let ubdated = await cartModel.registerQuantityCart(account_id, inv_id, number)
    let nav = await utilities.getNav()
    let data = await cartModel.getCart(account_id)
    let elements = await utilities.getCart(data)
    let total = await utilities.getTotal(data)
    req.flash("notice", "Product Add to Cart")
    res.render("./cart/", {
        title: "Your Cart",
        nav,
        elements, 
        total,
        errors: null
    })
  } else {
    let ubdated = await cartModel.registerInCart(account_id, inv_id, 1)
    let nav = await utilities.getNav()
    let data = await cartModel.getCart(account_id)
    let elements = await utilities.getCart(data)
    let total = await utilities.getTotal(data)
    req.flash("notice", "Product Add to Cart")
    res.render("./cart/", {
        title: "Your Cart",
        nav,
        elements, 
        total,
        errors: null
    })
  }
}

//eliminate
cartCont.eliminateCart = async function (req, res, next) {
  let account_id = res.locals.accountData.account_id
  const { inv_id } = req.body
  let info = await cartModel.cart(account_id)
  let number = 0
  info.forEach(element => {
    if (element.inv_id == inv_id){
        number = element.cart_quantity
    }
  });
  if (parseFloat(number) === 1){
    let ubdated = await cartModel.deletElementCart(account_id, inv_id)
    let nav = await utilities.getNav()
    let data = await cartModel.getCart(account_id)
    let elements = await utilities.getCart(data)
    let total = await utilities.getTotal(data)
    req.flash("notice", "Product Eliminated to Cart")
    res.render("./cart/", {
        title: "Your Cart",
        nav,
        elements, 
        total,
        errors: null
    })
  } else {
    number = parseFloat(number)
    number = number - 1
    let ubdated = await cartModel.registerQuantityCart(account_id, inv_id, number)
    let nav = await utilities.getNav()
    let data = await cartModel.getCart(account_id)
    let elements = await utilities.getCart(data)
    let total = await utilities.getTotal(data)
    req.flash("notice", "Product Eliminated to Cart")
    res.render("./cart/", {
        title: "Your Cart",
        nav,
        elements, 
        total,
        errors: null
    })
  }
}

//fulfit payment 
cartCont.registerPayment = async function (req, res) {
  let nav = await utilities.getNav()
  const { firstname, lastname, street, city, state, zip, payment_expiration, payment_code } = req.body
  const payment_name = firstname + lastname
  const payment_address = street + city + state + zip
  const account_id = res.locals.accountData.account_id
  let data = await cartModel.getCart(account_id)
  const totalCost = await utilities.getAmountTotal(data)
  const payment_amount = parseFloat(totalCost)
  const regResult = await cartModel.registerPayment(
    account_id,
    payment_name,
    payment_address,
    payment_expiration,
    payment_code,
    payment_amount
  );
  if (regResult.rowCount > 0) {
    req.flash(
      "notice",
      `Congratulations, you'r payment was sucsesfuld`
    );
    return res.redirect("/");
  } else {
    req.flash("notice", "Sorry, the payment faild");
    let total = await utilities.getTotal(data)
    return res.status(500).render("/cart/buy", {
    title: "Login",
    nav,
    total,
    errors: null,
    firstname, 
    lastname, 
    street, 
    city, 
    state, 
    zip, 
    payment_expiration, 
    payment_code
  })
  }
}

module.exports = cartCont