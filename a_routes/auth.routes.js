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
    passport.authenticate(
      "google",
      {
        failureRedirect: "https://localhost:3000/login",
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
          .json({ user: result, msg: "구글 로그인에 성공하였습니다." });
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
        failureRedirect: "https://localhost:3000/login",
        failureMessage: true,
      },
      (err, user, info) => {
        if (err) return next(err);
        res.status(200).redirect("https://localhost:3000/");
        return;
      }
    )(req, res, next);
  } catch (error) {
    next(error);
  }
};

router.get("/google_callback", googleCallback_jwt);

module.exports = router;
