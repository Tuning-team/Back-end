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

// 세션ID를 가진 사용자가 접속했을 때,유저 정보 받아보기
router.get("/user", authMiddleware, async (req, res) => {
  const user_id = res.locals.user_id;
  const user = await userRepository.getUserById(user_id);

  res.status(200).json({ success: true, user });
});

router.get("/user/:user_id", async (req, res) => {
  const user = await userRepository.getUserById(req.params.user_id);
  res.status(200).json({ success: true, user });
});

router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.status(200).redirect(process.env.REDIRECT_PATH);
  });
});

// 구글에 사용자의 인증을 요청하는 API
router.get("/google", passport.authenticate("google"));

const googleCallback_jwt = (req, res, next) => {
  try {
    console.log(req.headers.origin);
    passport.authenticate(
      "google",
      {
        failureRedirect: `https://www.tube-tuning.com/login`,
        failureMessage: true,
      },
      (err, user, info) => {
        if (err) return next(err);

        console.log(user);
        const { _id, displayName, profilePicUrl, email } = user.user;
        const { accessToken } = user;

        const token = jwt.sign({ user_id: _id }, process.env.MY_SECRET_KEY, {
          expiresIn: "24h",
        });

        result = { displayName, profilePicUrl, email, token };

        res
          .status(201)
          .redirect(`https://www.tube-tuning.com/google_login/${token}`);
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

    console.log(result.data.access_token);

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
