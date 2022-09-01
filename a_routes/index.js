const express = require("express");
const router = express.Router();
const authRouter = require("./auth.routes.js");
<<<<<<< HEAD
const searchRouter = require("./search.routes.js");
=======
const Users = require("../d_schemas/user")
const Comments = require("../d_schemas/comment")
const Collection = require("../d_schemas/collection");

>>>>>>> feature

router.use("/search", [searchRouter]);
router.use("/", [authRouter]);

router.use("/comments", [Comments]);
router.use("/collections", [Collection]);

// 이 파일에서 만든 router 객체를 외부에 공개 -> app.js에서 사용할 수 있도록
module.exports = router;
