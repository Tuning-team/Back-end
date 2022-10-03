const jwt = require("jsonwebtoken");
const axios = require("axios");
const qs = require("qs");

class Auth {
  authMiddleware = async (req, res, next) => {
    try {
      const { authorization } = req.headers;
      const [tokenType, tokenValue] = authorization.split(" ");

      if (tokenType !== "Bearer") {
        res.status(400).json({ success: false, message: "로그인이 필요합니다!" });
        return;
      }

      // 토큰이 만료됐으면, error catch "로그인 후 사용하세요. "
      let { user_id, accessToken, refreshToken } = jwt.verify(tokenValue, process.env.MY_SECRET_KEY);

      console.log("accessToken", accessToken);
      console.log("refreshToken", refreshToken);

      // accessToken 유효 검사
      // let userInfo = await axios.get(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`);

      // const isAccessVerified = userInfo.data.id ? true : false;

      // accessToken 사용 가능, refreshToken이 없으면 : refreshToken 발급

      // accessToken, refreshToken 모두 불가한 경우 : 로그인 기한이 만료되었습니다. 다시 로그인해주세요.

      // accessToken 만료되었으나 refreshToken 존재하는 경우 : accessToken 재발급

      // accessToken & refreshToken 사용 가능 :

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
