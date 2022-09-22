const jwt = require("jsonwebtoken");

class Auth {
  authMiddleware_session = (req, res, next) => {
    console.log("------ 🤔 Authorization Checking ------");

    try {
      const user_id = req.session.passport ? req.session.passport.user.user._id : process.env.TEMP_USER_ID;

      console.log("use_id", user_id);

      if (!user_id) {
        res.status(400).json({
          success: false,
          message: "로그인이 필요합니다!",
        });
        return;
      }
      console.log("------ ✅  Authorization Checked ------");
      res.locals.user_id = user_id;
      next();
    } catch (e) {
      res.status(401).send({
        errorMessage: "로그인 후 사용하세요",
      });
      return;
    }
  };

  authMiddleware = (req, res, next) => {
    console.log("------ 🤔 Authorization Checking ------");

    try {
      const { authorization } = req.headers;
      const [tokenType, tokenValue] = authorization.split(" ");

      if (tokenType !== "Bearer") {
        res.status(400).json({
          success: false,
          message: "로그인이 필요합니다!",
        });
        return;
      }

      let { user_id } = jwt.verify(tokenValue, process.env.MY_SECRET_KEY);

      console.log("------ ✅  Authorization Checked ------");
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

// 미들웨어 사용할 수 있게 export
module.exports = Auth;
