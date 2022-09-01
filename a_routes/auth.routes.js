const express = require("express");
const router = express.Router();
const axios = require("axios");
const passport = require("passport");
const UserRepository = require("../c_repositories/users.repository");
const userRepository = new UserRepository();
// const session = require("express-session");

// 세션ID를 가진 사용자가 접속했을 때,유저 정보 받아보기
router.get("/user", async (req, res) => {
  console.log(
    "여기에" + req.session.passport.user.user.displayName + "님이 접속했습니다."
  );
  res.send(req.session.passport.user);
});

router.get("/user/:user_id", async (req, res) => {
  const user = await userRepository.getUserById(req.params.user_id);
  console.log(user);
  res.send(user);
});

router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("http://localhost:3000");
  });
});

module.exports = router;

// 구글 로그인 관련
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google_callback",
  passport.authenticate("google", { failureRedirect: "http://localhost:3000" }),
  (req, res) => {
    console.log("req.user", req.user);
    res.redirect("http://localhost:3000");
    // console.log("sessionID", res.req.sessionID);
    // console.log("sessionID", res.req.session);
    // console.log("user", res.req.user.user);
    // console.log("accessToken", res.req.user.accessToken);
  }
);
