const pool = require("../database");

async function getReviewsByInventoryId(inv_id) {
  try {
    const sql = `
      SELECT r.review_id, r.review_content, r.review_date, a.account_firstname, a.account_lastname
      FROM reviews r
      JOIN account a ON r.account_id = a.account_id
      WHERE r.inv_id = $1
      ORDER BY r.review_date DESC
    `;
    const data = await pool.query(sql, [inv_id]);
    return data.rows;
  } catch (error) {
    console.error("Error fetching reviews:", error.message);
    throw error;
  }
}

async function addReview(review_content, account_id, inv_id) {
  try {
    const sql = `
      INSERT INTO reviews (review_content, account_id, inv_id)
      VALUES ($1, $2, $3) RETURNING *
    `;
    const data = await pool.query(sql, [review_content, account_id, inv_id]);
    return data.rows[0];
  } catch (error) {
    console.error("Error adding review:", error.message);
    throw error;
  }
}

async function updateReview(review_id, review_content) {
  try {
    const sql = `
      UPDATE reviews SET review_content = $1, review_date = CURRENT_TIMESTAMP
      WHERE review_id = $2 RETURNING *`;
    const data = await pool.query(sql, [review_content, review_id]);
    return data.rows[0];
  } catch (error) {
    console.error("Error updating review:", error.message);
    throw error;
  }
}

async function deleteReview(review_id) {
  try {
    const sql = `DELETE FROM reviews WHERE review_id = $1 RETURNING *`;
    const data = await pool.query(sql, [review_id]);
    return data.rows[0];
  } catch (error) {
    console.error("Error deleting review:", error.message);
    throw error;
  }
}

module.exports = { getReviewsByInventoryId, addReview, updateReview, deleteReview };
