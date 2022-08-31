const express = require("express");
const router = express.Router();
const axios = require("axios");
const passport = require("passport");

router.get("/", (req, res) => {
  console.log("req.user:", req.user);
});
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google_callback",
  passport.authenticate("google", { failureRedirect: "http://localhost:3000" }),
  (req, res) => {
    console.log("sessionID", res.req.sessionID);
    console.log("user", res.req.user.user);
    console.log("accessToken", res.req.user.accessToken);
    res
      .cookie("accessToken", `Bearer ${res.req.user.accessToken}`, {
        maxAge: 30000,
        httpOnly: true,
      })
      .cookie("userInfo", res.req.user.user, {
        maxAge: 30000,
        httpOnly: true,
      })
      .redirect("http://localhost:3000");
  }
);
router.get("/logout", (req, res) => {
  req.logout();
  req.session.save(() => {
    res.redirect("http://localhost:3000");
  });
});
module.exports = router;

// async (req, res, next) => {
//   try {

//     var data = {};
//     const params = new URLSearchParams({
//       code: req.query.code,
//       client_id:
//       process.env.GOOGLE_CLIENT_ID,
//       client_secret: process.env.GOOGLE_CLIENT_SECRET,
//       redirect_uri: "https://localhost/api/google_callback",
//       grant_type: "authorization_code",
//     }).toString();

//     const url = "https://accounts.google.com/o/oauth2/token?" + params;
//     const result = await axios.post(url, data, {
//       headers: {
//         Host: "accounts.google.com",
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//     });

//     console.log("구글로 접속한 유저의 엑세스 토큰 발행 완료:", result.data.access_token);
//     // 이게 있으면 이제 유저의 ID, Email 등 유튜브 정보 들을 구글이 줄 수 있다.

//     const getUserInfo = await axios.get("https://www.googleapis.com/v1/people/me?personFields=names,emailAddressesaccess_token="+result.data.access_token, {
//       headers: {
//         Host: "accounts.google.com",
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//     });

//     console.log(getUserInfo.email)

//     res.cookie("token", `Bearer ${result.data.access_token}`, {
//       maxAge: 30000,
//       httpOnly: true,
//     }).redirect(
//       "http://localhost:3000"
//     );
//   } catch (error) {
//     res.status(400).send({ message: error + "구글 로그인 실패" });
//   }
// }
