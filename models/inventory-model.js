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
}

/* ***************************
 *  Get a specific vehicle by inventory ID
 * ************************** */
async function getVehicleById(inventoryId) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory WHERE inv_id = $1`,
      [inventoryId]
    );
    return data.rows[0];
  } catch (error) {
    console.error("getVehicleById error " + error);
  }
}

async function addNewInventory(invMake, invModel, invYear, invDesc) {
  try {
    const sql = "INSERT INTO inventory (inv_make, inv_model, inv_year, inv_description) VALUES ($1, $2, $3, $4) RETURNING *"
    return await pool.query(sql, [invMake, invModel, invYear, invDesc])
  } catch (error) {
    return error.message
  }
}



module.exports = {getClassifications, getInventoryByClassificationId, getVehicleById, addNewInventory}