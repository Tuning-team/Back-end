const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const User = require("../schemas/user");
require("dotenv").config();

module.exports = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/google/callback",
        passReqToCallback: true,
      },
      async (accessToken, refreshToken, profile, done) => {
        // console.log(accessToken);
        // console.log(refreshToken);

        const newUser = {
          GOOGLE_ID: profile.id,
          DISPLAY_NAME: profile.displayName,
          FIRST_NAME: profile.name.givenName,
          LAST_NAME: profile.name.familyName,
          EMAIL: profile.emails[0].value,
          PROFILE_PIC: profile.photos[0].value,
          REGISTER_FROM: "google",
        };
        try {
          let user = await User.findOne({ GOOGLE_ID: profile.id });

          if (user) {
            return done(null, user);
          } else {
            newser = await User.create(newUser);
            return done(null, user);
          }
        } catch (error) {
          console.log(error);
          done(error);
        }
      }
    )
  );
};
