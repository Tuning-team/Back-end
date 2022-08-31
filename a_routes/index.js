const express = require("express");
const router = express.Router();
const authRouter = require("./auth.routes.js");

router.use("/", [authRouter]);

// 이 파일에서 만든 router 객체를 외부에 공개 -> app.js에서 사용할 수 있도록
module.exports = router;
