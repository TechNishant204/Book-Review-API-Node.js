const passport = require("passport");

exports.authenticateJWT = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(401).json({
        message: "Unauthorized access",
        error: info ? info.message : "No user found",
      });
    }
    req.user = user; // Attach user to request object
    next(); // Proceed to the next middleware or route handler
  })(req, res, next);
};
