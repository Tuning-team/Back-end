const passport = require("passport");
const googleStrategy = require("./googleStrategy");
const Users = require("../d_schemas/user");

module.exports = () => {
  // 로그인에 성공할 때 처음 실행되면서 사용자 정보를 sessionStore에 저장
  passport.serializeUser((data, done) => {
    done(null, data);
  });

  passport.deserializeUser((data, done) => {
    Users.findOne({ googleId: data.user.googleId })
      .then((user) => {
        done(null, user);
      })
      .catch((err) => done(err));
  });

  googleStrategy();
};
