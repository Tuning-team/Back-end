const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const axios = require("axios");
const Users = require("../d_schemas/user");

require("dotenv").config();

module.exports = () => {
// googleStrategy가 export한 함수 실행 passport는 이런 정보를 가진 GoogleStrategy 객체를 use하겠다. 그리고 콜백함수 등록 
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.REDIRECT_PATH}/api/google_callback`,
        scope: ["https://www.googleapis.com/auth/youtube", "profile", "email"],
        passReqToCallback: false,
      },
      // 누군가 로그인을 했을 때 실행되는 콜백 함수
      async (accessToken, refreshToken, profile, done) => {

        //   "GoogleStrategy 객체의 콜백함수 실행중 - 기존유저 또는 새로운 유저 -> 시리얼라이저로 보내서 세션을 만듬"

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
            return done(null, { user, accessToken }); // 세션에 저장
          } else {
            user = await Users.create(newUser);
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
