const { validationResult } = require("express-validator");
const Review = require("../models/Review");
const Book = require("../models/Book");

// Create new review
/**
     * Creates a new review instance
     * @param {string} bookId - The ID of the book being reviewed
     * @param {string} userId - The ID of the user creating the review
     * @param {number} rating -\
     * 
     *  The rating given to the book (typically 1-5)
     * @param {string} comment - The text review/comment for the book
     * @returns {Object} The newly created review object
*/
exports.createReview = async (req, res) => {
  //Validate Request

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }
  try {
    const { rating, comment } = req.body;
    const bookId = req.params.id;
    const userId = req.user._id;

    //Check if book exists
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    // Check if user has already reviewed this book
    const existingReview = await Review.findOne({
      book: bookId,
      user: userId,
    });

    if (existingReview) {
      return res.status(400).json({
        message: "You have already reviewed this book",
      });
    }


    const newReview = new Review({
      book: bookId,
      user: userId,
      rating,
      comment,
    });

    await newReview.save();

    res.status(201).json({
      message: "Review created successfully",
      data: newReview,
    });
  } catch (error) {
    console.error("Error creating review:", error.message);
    res.status(500).json({
      message: "Server error while creating review",
    });
  }
};

exports.updateReview = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  try {
    const { rating, comment } = req.body;
    const reviewId = req.params.id;
    const userId = req.user._id;

    // find review
    const review = await Review.findById(userId);

    if (!review) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

    //Check if the review belongs to the user
    if (review.user.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "You are not authorized to update this review",
      });
    }

    //Update review
    review.rating = rating || review.rating;
    review.comment = comment || review.comment;
    await review.save();

    res.status(200).json({
      message: "Review updated successfully",
      data: await Review.findById(review._id).populate("user", "username"),
    });
  } catch (error) {
    console.error("Error updating review:", error.message);
    res.status(500).json({
      message: "Server error while updating review",
    });
  }
};

// Delete a review
exports.deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const userId = req.user._id;

    //find a review
    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

    //Check if the review belongs to the user
    if (review.user.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "You can only delete your own reviews",
      });
    }

    //Delete review
    await Review.findByIdAndDelete(reviewId);
    res.status(200).json({
      message: "Review deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting review:", err.message);
    res.status(500).json({
      message: "Server error while deleting review",
    });
  }
};
