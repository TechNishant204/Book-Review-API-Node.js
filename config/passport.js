/*
 Why Passport?
Passport.js is a flexible authentication middleware for Node.js that simplifies the process of 
implementing various authentication strategies, such as local login and OAuth. 
It allows developers to easily integrate authentication into their applications, making it a popular choice for web development.  
*/
const passport = require("passport");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const User = require("../models/User");

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  new JwtStrategy(options, async (payload, done) => {
    try {
      const user = await User.findById(payload.id);
      if (user) {
        return done(null, user); // ✅ Success
      } else {
        return done(null, false); // ✅ No user found
      }
    } catch (err) {
      return done(err, false); // ✅ Error occurred
    }
  })
);
