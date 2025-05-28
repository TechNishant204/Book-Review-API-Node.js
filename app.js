const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const db = require("./config/db");
const passport = require("passport");
require("dotenv").config();
require("./config/passport");
const authRoutes = require("./routes/authRoutes");
const bookRoutes = require("./routes/bookRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const searchRoutes = require("./routes/searchRoutes");

// Initialize Express App
const app = express();

// Connect to Database
db.connectDB();

//Middlewares
app.use(morgan("dev")); // Logging middleware for development
app.use(cors()); // CORS middleware
app.use(express.json()); // parse JSON request body
app.use(express.urlencoded({ extended: true })); // parse URL encoded request body

// Initialize Passport for authentication
app.use(passport.initialize());

//Routes
// app.use is used for mounting middleware at a specific path
console.log("Setting up routes...");
app.use("/api/auth", authRoutes);
app.use("/api/book", bookRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/search", searchRoutes);

// Default route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Book Review API!" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "An unexpected error occurred",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

module.exports = app;
