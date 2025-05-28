const express = require("express");
const bookController = require("../controllers/bookController");

const router = express.Router();

console.log("Search routes loaded");
// Search books
router.get("/", bookController.searchBooks);

module.exports = router;
