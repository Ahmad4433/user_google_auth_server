const googleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const googleAuth = require("../middlewares/googleAuth");
const strategy = (app) => {
  passport.use(
    new googleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK,
      },
      (accessToken, refreshToken, profile, done) => {
        return done(null, profile);
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });

  app.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: ["email", "profile"],
      prompt: "select_account",
    })
  );

  app.get(
    "/auth/google/callback",
    passport.authenticate("google", {
      failureRedirect: process.env.FAILUREURL,
    }),
    googleAuth,
    async (req, res, next) => {
      res.redirect(process.env.SUCCESS_URL);
    }
  );
};

module.exports = strategy;
