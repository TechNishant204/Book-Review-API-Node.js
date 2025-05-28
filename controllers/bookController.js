const { validationResult } = require("express-validator");
const Book = require("../models/Book");
const Review = require("../models/Review");

// console.log("Book controller loaded");
// Get all books with pagination and filters
exports.getBooks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit; //calculate how many items to skip (or, equivalently, what offset to use) when retrieving data from a database

    // Filters
    const filter = {};

    if (req.query.author) {
      filter.author = { $regex: req.query.author, $options: "i" };
    }

    if (req.query.genre) {
      filter.genre = { $regex: req.query.genre, $options: "i" };
    }

    //Execute query
    const books = await Book.find(filter)
      .sort({ createdAt: -1 }) // Sort by createdAt in descending order
      .skip(skip)
      .limit(limit);

    // Get total count of books for pagination
    const totalCount = await Book.countDocuments(filter); //counts the number of documents that match filter.

    res.json({
      data: books,
      pagination: {
        totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error getting books:", error.message);
    res.status(500).json({
      message: "Server error",
    });
  }
};

// Get a single book by ID
exports.getBookById = async (req, res) => {
  try {
    const bookId = req.params.id;

    // Get book
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const reviews = await Review.find({ book: bookId })
      .populate("user", "username")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // get total Review count
    const totalReviews = await Review.countDocuments({ book: bookId });

    // Calculate average Rating
    const avgRatingResult = await Review.aggregate([
      { $match: { book: bookId } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
        },
      },
    ]);

    const averageRating =
      avgRatingResult.length > 0
        ? parseFloat(avgRatingResult[0].avgRating.toFixed(1))
        : 0;

    res.json({
      data: {
        ...book._doc, // Spread operator to include all book fields
        averageRating,
        reviews: {
          data: reviews,
          pagination: {
            total: totalReviews,
            page,
            limit,
            pages: Math.ceil(totalReviews / limit),
          },
        },
      },
    });
  } catch (error) {
    console.error("Error getting book by ID: ", error.message);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

// create a new book
exports.createBook = async (req, res) => {
  console.log("Creating book...");
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  try {
    const { title, author, genre, publishYear, description } = req.body;

    // Create book
    const newBook = new Book({
      title,
      author,
      genre,
      publishYear,
      description,
      addedBy: req.user._id,
    });

    await newBook.save();
    console.log("Book created successfully:", newBook);

    res.status(201).json({
      message: "Book created successfully",
      data: newBook,
    });
  } catch (error) {
    console.error("Error creating book:", error.message);
    res.status(500).json({
      message: "Server error",
    });
  }
};

// Search books by title or author
exports.searchBooks = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        message: "Search query is required",
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Search using regex for partial match
    const search = {
      $or: [
        { title: { $regex: query, $options: "i" } }, // i' flag means it will match both uppercase and lowercase characters
        { author: { $regex: query, $options: "i" } },
      ],
      // Allows you to search for documents that match at least one of the conditions in an array
    };

    //Execute query
    const books = await Book.find(search)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count
    const total = await Book.countDocuments(search);

    res.json({
      data: books,
      pagination: {
        total,
        page,
        limit,
        pages: math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error searching books:", error.message);
    res.status(500).json({
      message: "Server error",
    });
  }
};
