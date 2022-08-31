const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const axios = require("axios");
const Users = require("../d_schemas/user");
const VideoDataBaseCreator = require("../evertyday-data-setter/video-db.creator");

const videoDataBaseCreator = new VideoDataBaseCreator();

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
          const newUser = {
            googleId: profile.id,
            email: profile.emails[0].value,
            displayName: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            profilePicUrl: profile.photos[0].value,
          };

          // 토큰 만들어서 전달
          let user = await Users.findOne({ googleId: newUser.googleId });

          if (user) {
            console.log("있음");
            return done(null, { user, accessToken });
          } else {
            console.log("없어서 만듦");
            user = await Users.create(newUser);
            // 새로 가입한 유저 -> 엑세스 토큰 넣어 videoSearch에 구독채널의 주요 영상 추가
            await videoDataBaseCreator.createAllVideosOnSubscribed(accessToken);
            return done(null, { user, accessToken });
          }
        } catch (error) {
          console.log(error);
          done(error);
        }
      }
    )
  );
};
