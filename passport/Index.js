const passport = require("passport");
const googleStrategy = require("./googleStrategy");
const Users = require("../d_schemas/user");

module.exports = () => {
  // 로그인에 성공할 때 처음 실행되면서 사용자 정보를 sessionStore에 저장

  console.log("serializeUser");
  passport.serializeUser((data, done) => {
    console.log("--- serializeUser 내부");
    done(null, data); // data = { user, accessToken } -> 세션에 저장
  });

  console.log("deserializeUser");
  // 저장된 데이터를 가지고, 필요한 정보를 조회한다.
  passport.deserializeUser((data, done) => {
    console.log("--- deserializeUser 내부");

    Users.findOne({ googleId: data.user.googleId })
      .then((user) => {
        done(null, user);
      })
      .catch((err) => done(err));
  });

  console.log("googleStrategy 설정");
  googleStrategy();
};
