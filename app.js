const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const db = require("./config/db");
const passport = require("passport");
require("dotenv").config();
require("./config/passport");

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
app.use("/signup", require("./routes/authRoutes"));
app.use("/login", require("./routes/authRoutes"));
app.use("/search", require("./routes/bookRoutes"));
app.use("/reviews", require("./routes/reviewRoutes"));
app.use("/search", require("./routes/searchRoutes"));

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
