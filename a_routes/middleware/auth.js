const jwt = require("jsonwebtoken");

class Auth {
  authMiddleware = (req, res, next) => {
    try {
      const { authorization } = req.headers;
      const [tokenType, tokenValue] = authorization.split(" ");

      if (tokenType !== "Bearer") {
        res.status(400).json({ success: false, message: "로그인이 필요합니다!" });
        return;
      }

      let { user_id, accessToken, refreshToken } = jwt.verify(tokenValue, process.env.MY_SECRET_KEY);
      res.locals.user_id = user_id;
      next();
    } catch (e) {
      res.status(401).send({
        errorMessage: "로그인 후 사용하세요",
      });
      return;
    }
  };
}

module.exports = Auth;

// ------- 코드 아카이브 -------

// const passport = require("passport");
// const Users = require("../../d_schemas/user");

// authMiddleware_session = (req, res, next) => {
//   try {
//     const user_id = req.session.passport ? req.session.passport.user.user._id : process.env.TEMP_USER_ID;
//     if (!user_id) {
//       res.status(400).json({ success: false, message: "로그인이 필요합니다!" });
//       return;
//     }

//     res.locals.user_id = user_id;
//     next();
//   } catch (e) {
//     res.status(401).send({ errorMessage: "로그인 후 사용하세요" });
//     return;
//   }
// };
