const pool = require("../database/")

/* *****************************
*   Get Cart Info by Account
* *************************** */
async function cart(account_id){
  try {
    const sql = "SELECT * FROM cart WHERE account_id = $1"
    const data = await pool.query(sql, [account_id])
    return data.rows
  } catch (error) {
    return new Error("No matching cart found")
  }
}

/* *****************************
*   Register in Cart
* *************************** */
 async function registerInCart(account_id, inv_id, cart_quantity){
  try {
    const sql = "INSERT INTO cart (account_id, inv_id, cart_quantity) VALUES ($1, $2, $3) RETURNING *"
    return await pool.query(sql, [account_id, inv_id, cart_quantity])
  } catch (error) {
    return error.message
  }
}

/* *****************************
*   Change the Quantity in Cart
* *************************** */
async function registerQuantityCart(account_id, inv_id, cart_quantity){
  try {
    const sql = "UPDATE cart SET cart_quantity = $1 WHERE account_id = $2 AND inv_id = $3 RETURNING *"
    return await pool.query(sql, [cart_quantity, account_id, inv_id])
  } catch (error) {
    return error.message
  }
}

/* *****************************
*   Get Cart and Inventory Info by Account
* *************************** */
async function getCart(account_id){
  try {
    const sql = "SELECT * FROM cart a JOIN inventory b ON a.inv_id = b.inv_id WHERE a.account_id = $1"
    const data = await pool.query(sql, [account_id])
    return data.rows
  } catch (error) {
    return new Error("No matching cart found")
  }
}

/* *****************************
*   Delet Element Fron Cart
* *************************** */
async function deletElementCart(account_id, inv_id){
  try {
    const sql = "DELETE FROM cart WHERE account_id = $1 AND inv_id = $2"
    return await pool.query(sql, [account_id, inv_id])
  } catch (error) {
    return new Error("No matching cart found")
  }
}

/* *****************************
*   Delet Cart
* *************************** */
// delet cart
async function deletCart(account_id){
  try {
    const sql = "DELETE FROM cart WHERE account_id = $1"
    return await pool.query(sql, [account_id])
  } catch (error) {
    return new Error("No matching cart found")
  }
}

/* *****************************
*   Register Payment
* *************************** */
 async function registerPayment(account_id, payment_name, payment_address, payment_expiration, payment_code, payment_amount){
  try {
    const sql = "INSERT INTO payment (account_id, payment_name, payment_address, payment_expiration, payment_code, payment_amount) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *"
    return await pool.query(sql, [account_id, payment_name, payment_address, payment_expiration, payment_code, payment_amount])
  } catch (error) {
    return error.message
  }
}

module.exports = { cart, registerInCart, registerQuantityCart, getCart, deletElementCart, deletCart, registerPayment };