const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const axios = require("axios");
const Users = require("../d_schemas/user");
const VideoDataBaseCreator = require("../everyday-data-setter/video-db.creator");
const videoDataBaseCreator = new VideoDataBaseCreator();

require("dotenv").config();

module.exports = () => {
  console.log(
    "googleStrategy가 export한 함수 실행 passport는 이런 정보를 가진 GoogleStrategy 객체를 use하겠다. 그리고 콜백함수 등록 ."
  );
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "https://tube-tuning.com/api/google_callback",
        scope: ["https://www.googleapis.com/auth/youtube", "profile", "email"],
      },
      // 누군가 로그인을 했을 때 실행되는 콜백 함수
      async (accessToken, refreshToken, profile, done) => {
        console.log(
          "GoogleStrategy 객체의 콜백함수 실행중 - 기존유저 또는 새로운 유저 -> 시리얼라이저로 보내서 세션을 만듬"
        );

        try {
          const newUser = {
            googleId: profile.id,
            email: profile.emails[0].value,
            displayName: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            profilePicUrl: profile.photos[0].value,
          };

          let user = await Users.findOne({ googleId: newUser.googleId });

          if (user) {
            // await videoDataBaseCreator.getAllSubscribedChannel(accessToken);
            // 새로 가입한 유저 -> 구독채널의 주요 영상 추가 (엑세스 토큰 활용)

            return done(null, { user, accessToken });
          } else {
            user = await Users.create(newUser);
            // await videoDataBaseCreator.getAllSubscribedChannel(accessToken);
            // 새로 가입한 유저 -> 구독채널의 주요 영상 추가 (엑세스 토큰 활용)
            return done(null, { user, accessToken });
          }
          // done의 2번째 인자 -> session.user = { user, accessToken }
        } catch (error) {
          console.log(error);
          done(error);
        }
      }
    )
  );
};
