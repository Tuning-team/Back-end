require("dotenv").config();

const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");

const googleCallback = (req, res, next) => {
  try {
    passport.authenticate(
      "google",
      {
        failureRedirect: `${process.env.ACCESS_POINT}/login`,
        failureMessage: true,
      },
      (err, user, info) => {
        if (err) return next(err);

        // 로그인 완료: 확보한 정보
        const { _id, displayName, profilePicUrl, email } = user.user;
        const { accessToken, refreshToken } = user;

        console.log("refreshToken", refreshToken);

        const token = jwt.sign(
          {
            isLogin: true,
            user_id: _id,
            accessToken,
            refreshToken,
          },
          process.env.MY_SECRET_KEY,
          { expiresIn: "24h" }
        );

        res.status(201).redirect(`${process.env.ACCESS_POINT}/google_login/${token}`);
      }
    )(req, res, next);
  } catch (error) {
    next(error);
  }
};

router.get("/google", passport.authenticate("google"));
router.get("/google_callback", googleCallback);

module.exports = router;
