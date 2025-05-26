const express = require("express");
const bookController = require("../controllers/bookController");

const router = express.Router();

// Search books
router.get("/", bookController.searchBooks);

module.exports = router;
