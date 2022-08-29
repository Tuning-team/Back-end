// express와 이 파일의 router 객체 초기화
const express = require("express");
const router = express.Router();

const authRouter = require("./auth.js");
const postsRouter = require("./posts.js");
const commentsRouter = require("./comments.js");
const profilesRouter = require("./profiles.js");
const authMiddleware = require("../middleware/auth");

router.use("/posts", authMiddleware, [postsRouter]);
router.use("/comments", authMiddleware, [commentsRouter]);
router.use("/profiles", authMiddleware, [profilesRouter]);
router.use("/", [authRouter]);

// 이 파일에서 만든 router 객체를 외부에 공개 -> app.js에서 사용할 수 있도록
module.exports = router;
