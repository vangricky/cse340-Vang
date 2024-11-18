const pool = require("../database/")

/* *****************************
*   Add New Classification
* *************************** */
async function addClassification(classification) {
    try {
        const sql = "INSERT INTO classification (classification) VALUES ($1) RETURNING *"
        return await pool.query(sql, [classification]);
    } catch (error) {
        return error.message
    }
}

module.exports = { addClassification }