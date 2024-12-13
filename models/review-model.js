const pool = require("../database");

async function getReviewsByInventoryId(inv_id) {
    const sql = "SELECT r.*, a.account_firstname || ' ' || LEFT(a.account_lastname, 1) AS username FROM reviews r JOIN accounts a ON r.account_id = a.account_id WHERE r.inv_id = $1 ORDER BY r.review_date DESC";
    const data = await pool.query(sql, [inv_id]);
    return data.rows;
}

async function getReviewsByAccountId(account_id) {
    const sql = "SELECT r.*, i.inv_make, i.inv_model FROM reviews r JOIN inventory i ON r.inv_id = i.inv_id WHERE r.account_id = $1 ORDER BY r.review_date DESC";
    const data = await pool.query(sql, [account_id]);
    return data.rows;
}

async function addReview(review_content, account_id, inv_id) {
    const sql = "INSERT INTO reviews (review_content, account_id, inv_id) VALUES ($1, $2, $3) RETURNING *";
    const data = await pool.query(sql, [review_content, account_id, inv_id]);
    return data.rows[0];
}

async function updateReview(review_id, review_content) {
    const sql = "UPDATE reviews SET review_content = $1, review_date = CURRENT_TIMESTAMP WHERE review_id = $2 RETURNING *";
    const data = await pool.query(sql, [review_content, review_id]);
    return data.rows[0];
}

async function deleteReview(review_id) {
    const sql = "DELETE FROM reviews WHERE review_id = $1 RETURNING *";
    const data = await pool.query(sql, [review_id]);
    return data.rowCount;
}

module.exports = { getReviewsByInventoryId, getReviewsByAccountId, addReview, updateReview, deleteReview };
