const express = require("express");
const router = express.Router();
const auth = require("../controller/auth");
const passport = require("passport");

//TASK 1 : 메인화면
// router.route("/").get(ensureGuest, auth.mainPage);
// TASK 2 : 회원가입
router.route("/signup").post(auth.registerDirect);
router.route("/google").get(auth.googleLogin);
// router.route("/login").get(auth.loginPage);
// router.route("/login").post(auth.login);
router.post("/login", auth.logIn);

// router.get(
//   "/google/callback",
//   passport.authenticate("google", { failureRedirect: "/api" }),
//   (req, res) => {
//     // Successful authentication, redirect home.
//     res.redirect("/api");
//   }
// );

router.get("/google", passport.authenticate("google", { scope: ["profile"] }));
router.get("/google/callback", auth.googleCallback);

// router.get("/logout", (req, res, next) => {
//   req.logout((error) => {
//     if (error) {
//       return next(error);
//     }
//     res.redirect("/api");
//   });
// });

router.route("/submitTest").post(auth.submitTest);

module.exports = router;
