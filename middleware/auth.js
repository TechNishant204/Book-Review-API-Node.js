const passport = require("passport");

exports.authenticateJWT = (req, res, next) => {
  // console.log("Authenticating JWT...");
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(401).json({
        message: "Unauthorized access",
        error: info ? info.message : "No user found",
      });
    }
    req.user = user; // Attach user to request object
    console.log("User authenticated successfully req.user:", req.user);
    next(); // Proceed to the next middleware or route handler
  })(req, res, next);
};
