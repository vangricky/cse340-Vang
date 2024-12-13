const express = require("express");
const router = express.Router();
const reviewModel = require("../models/review-model");
const utilities = require("../utilities");

router.post("/add", utilities.checkLogin, async (req, res) => {
  try {
    const { review_content, inv_id } = req.body;
    const account_id = res.locals.accountData.account_id;
    await reviewModel.addReview(review_content, account_id, inv_id);
    req.flash("notice", "Review added successfully.");
    res.redirect(`/inv/detail/${inv_id}`);
  } catch (error) {
    console.error("Error adding review:", error.message);
    req.flash("error", "Failed to add review. Please try again.");
    res.redirect(`/inv/detail/${inv_id}`);
  }
});

module.exports = router;
