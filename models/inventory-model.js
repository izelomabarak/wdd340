const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
  console.log(data)
}

/* ***************************
 *  Get Car items by inventory_Id
 * ************************** */
async function getCarByInventoryId(inventory_Id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory 
      WHERE inv_id = $1`,
      [inventory_Id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* *****************************
*   Add new classification
* *************************** */
async function addClassification(classification_name){
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING classification_id"
    return await pool.query(sql, [classification_name])
  } catch (error) {
    return error.message
  }
}

/* **********************
 *   Check for existing classification
 * ********************* */
async function checkExistingClassification(classification_name){
  try {
    const sql = "SELECT * FROM classification WHERE classification_name = $1"
    const email = await pool.query(sql, [classification_name])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
getClassifications.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
getInventoryByClassificationId.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
getCarByInventoryId.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
addClassification.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
checkExistingClassification.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = {getClassifications, getInventoryByClassificationId, getCarByInventoryId, addClassification, checkExistingClassification};