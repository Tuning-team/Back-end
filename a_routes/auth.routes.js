require("dotenv").config(); // 환경변수 적용

const express = require("express");
const router = express.Router();
const axios = require("axios");
const passport = require("passport");
const UserRepository = require("../c_repositories/users.repository");
const userRepository = new UserRepository();

const Auth = require("./middleware/auth");
const { authMiddleware } = new Auth();

const jwt = require("jsonwebtoken");
const qs = require("qs");

// 구글에 사용자의 인증을 요청하는 API
router.get("/google", passport.authenticate("google"));

const googleCallback_jwt = (req, res, next) => {
  try {
    passport.authenticate(
      "google",
      {
        failureRedirect: `${process.env.ACCESS_POINT}/login`,
        failureMessage: true,
      },
      (err, user, info) => {
        if (err) return next(err);

        const { _id, displayName, profilePicUrl, email } = user.user;
        const { accessToken } = user;

        const token = jwt.sign(
          { isLogin: true, user_id: _id },
          process.env.MY_SECRET_KEY,
          {
            expiresIn: "24h",
          }
        );

        result = { displayName, profilePicUrl, email, token };

        res
          .status(201)
          .redirect(`${process.env.ACCESS_POINT}/google_login/${token}`);
      }
    )(req, res, next);
  } catch (error) {
    next(error);
  }
};

const googleCallback_original = (req, res, next) => {
  try {
    passport.authenticate(
      "google",
      {
        failureRedirect: `${req.headers.origin}/login`,
        failureMessage: true,
      },
      (err, user, info) => {
        if (err) return next(err);
        res.status(200).redirect(`${req.headers.origin}`);
        return;
      }
    )(req, res, next);
  } catch (error) {
    next(error);
  }
};

const googleCallback_woPassport = async (req, res, next) => {
  try {
    const { code } = req.query;

    let data = {
      code: code,
      client_id:
        "603162325798-hb44n9gjugoc6aoinmb0964ovrqi8uqe.apps.googleusercontent.com",
      client_secret: "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",
      redirect_uri: "http://localhost:4000/api/google_callback",
      grant_type: "authorization_code",
    };

    const result = await axios({
      method: "POST",
      headers: {
        host: "accounts.google.com",
        "content-type": "application/x-www-form-urlencoded",
      },
      data: qs.stringify(data),
      url: "https://accounts.google.com/o/oauth2/token",
    });

    const userInfo = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    console.log(userInfo.data);

    res.status(200).redirect(`${req.headers.origin}`);
  } catch (error) {
    next(error);
  }
};

router.get("/google_callback", googleCallback_jwt);

module.exports = router;
