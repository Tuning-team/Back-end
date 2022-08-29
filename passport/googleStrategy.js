const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const axios =require("axios")

// const User = require("../schemas/user");
require("dotenv").config();

module.exports = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/google_callback",
      },
      async (accessToken, refreshToken, profile, done) => {

        try {
          console.log("accessToken", accessToken);
          console.log("refreshToken", refreshToken);
  
          const newUser = {
            GOOGLE_ID: profile.id,
            DISPLAY_NAME: profile.displayName,
            FIRST_NAME: profile.name.givenName,
            LAST_NAME: profile.name.familyName,
            EMAIL: profile.emails[0].value,
            PROFILE_PIC: profile.photos[0].value,
          };
  
          const subscription = await axios.get("https://www.googleapis.com/youtube/v3/subscriptions?key=AIzaSyBJg1gJLZT0As7NGbFDHpWFLO_mi4JDw0c&part=snippet&mine=true&maxResults=50&access_token="+accessToken);

          console.log("subscription", subscription.data.items)
          console.log("newUser", newUser)

          // 토큰 만들어서 전달
          // let user = await User.findOne({ GOOGLE_ID: profile.id });
          // if (user) {
            return done(null, newUser);
            // return done(null, user);
          // } else {
            // newser = await User.create(newUser);
            // return done(null, "user");
            // return done(null, user);
          // }

          

        } catch (error) {
          console.log(error);
          done(error);
        }
      }
    )
  );
};
