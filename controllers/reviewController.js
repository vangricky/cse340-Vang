const reviewModel = require("../models/review-model");
const utilities = require("../utilities");

const reviewController = {};

reviewController.getReviews = async (req, res, next) => {
  const inventory_id = req.params.inventoryId;
  try {
    const reviews = await reviewModel.getReviewsByInventoryId(inventory_id);
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error.message);
    res.status(500).json({ message: "Error fetching reviews" });
  }
};

reviewController.addReview = async (req, res, next) => {
  const { review_content } = req.body;
  const inventory_id = req.params.inventoryId;
  const account_id = req.locals.accountData.account_id;
  try {
    const review = await reviewModel.addReview(review_content, account_id, inventory_id);
    res.redirect(`/inv/detail/${inventory_id}`);
  } catch (error) {
    console.error("Error adding review:", error.message);
    req.flash("error", "Unable to add review.");
    res.redirect(`/inv/detail/${inventory_id}`);
  }
};

reviewController.updateReview = async (req, res, next) => {
  const { review_id, review_content } = req.body;
  try {
    const updatedReview = await reviewModel.updateReview(review_id, review_content);
    req.flash("notice", "Review updated successfully.");
    res.redirect("/account");
  } catch (error) {
    console.error("Error updating review:", error.message);
    req.flash("error", "Unable to update review.");
    res.redirect("/account");
  }
};

reviewController.deleteReview = async (req, res, next) => {
  const { review_id } = req.body;
  try {
    await reviewModel.deleteReview(review_id);
    req.flash("notice", "Review deleted successfully.");
    res.redirect("/account");
  } catch (error) {
    console.error("Error deleting review:", error.message);
    req.flash("error", "Unable to delete review.");
    res.redirect("/account");
  }
};

module.exports = reviewController;
