const express = require("express");
const { body } = require("express-validator");
const reviewController = require("../controllers/reviewController");
const { authenticateJWT } = require("../middleware/auth");

const router = express.Router();

console.log("Review routes loaded");
// Update a review (authenticated)
router.put(
  "/:id",
  authenticateJWT,
  [
    body("rating")
      .optional()
      .isInt({ min: 1, max: 5 })
      .withMessage("Rating must be between 1 and 5"),
    body("comment")
      .optional()
      .notEmpty()
      .withMessage("Comment cannot be empty"),
  ],
  reviewController.updateReview
);

// Delete a review (authenticated)

router.delete("/:id", authenticateJWT, reviewController.deleteReview);

module.exports = router;
