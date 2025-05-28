const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/User");

// Helper function to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};
// console.log("Auth controller loaded");
exports.signup = async (req, res) => {
  // Validate request
  console.log("Received signup request:", req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  const { username, email, password } = req.body;
  try {
    // Check if user already exists
    const user = await User.findOne({
      $or: [{ email: email }, { username: username }],
    });
    console.log("Checking for existing user:", { email, username });
    if (user) {
      return res.status(400).json({
        message: "User already exists with this email or username",
      });
    }

    // Create new user
    const newUser = new User({
      username,
      email,
      password,
    });

    await newUser.save();
    // console.log("User created successfully:", newUser);

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Error during signup:", error.message);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

exports.login = async (req, res) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  const { email, password } = req.body;

  try {
    //Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    //check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // Generate JWT token
    const token = generateToken(user);
    res.status(200).json({
      message: "Logged in successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Error during login:", err.message);
    return res.status(500).json({
      message: "Server error",
    });
  }
};
