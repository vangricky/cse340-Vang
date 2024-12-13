const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const utilities = require("../utilities");

router.get("/inventory/:inv_id", utilities.handleErrors(reviewController.getReviewsByInventoryId));
router.post("/add", utilities.checkLogin, utilities.handleErrors(reviewController.addReview));
router.get("/edit/:review_id", utilities.checkLogin, utilities.handleErrors(reviewController.editReviewView));
router.post("/update", utilities.checkLogin, utilities.handleErrors(reviewController.updateReview));
router.post("/delete", utilities.checkLogin, utilities.handleErrors(reviewController.deleteReview));

module.exports = router;
