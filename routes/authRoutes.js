const express = require("express");
const { body } = require("express-validator");
const authController = require("../controllers/authController");
const router = express.Router();

console.log("Auth routes loaded");
// SignUp routes
router.post(
  "/signup",
  //   [
  //     body("username")
  //       .isLength({ min: 3, max: 30 })
  //       .withMessage("Username must be between 3 and 30 characters"),
  //     body("email").isEmail().withMessage("Please provide a valid email address"),
  //     body("password")
  //       .isLength({ min: 6 })
  //       .withMessage("Password must be at least 6 characters long"),
  //   ],
  authController.signup
);

//Login route
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please provide a valid email address"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  authController.login
);

module.exports = router;
