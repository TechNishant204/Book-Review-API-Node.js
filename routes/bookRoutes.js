const express = require("express");
const { body } = require("express-validator");
const bookController = require("../controllers/bookController");
const reviewController = require("../controllers/reviewController");
const { authenticateJWT } = require("../middleware/auth");

const router = express.Router();

//Get all books
router.get("/", bookController.getBooks);

// Get book by ID
router.get("/:id", bookController.getBookById);

// Create a book(authenticated)

router.post(
  "/",
  authenticateJWT,
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("author").notEmpty().withMessage("Author is required"),
    body("genre").notEmpty().withMessage("Genre is required"),
    body("publishYear")
      .isInt({ min: 1900, max: new Date().getFullYear() })
      .withMessage("Publish year must be a valid year"),
    body("description").notEmpty().withMessage("Description is required"),
  ],
  bookController.createBook
);

// Add a review to a book(authenticated)
router.post(
  "/:id/reviews",
  authenticateJWT,
  [
    body("rating")
      .isInt({ min: 1, max: 5 })
      .withMessage("Rating must be between 1 and 5"),
    body("comment").notEmpty().withMessage("Comment is required"),
  ],
  reviewController.createReview
);

module.exports = router;
