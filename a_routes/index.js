const express = require("express");
const router = express.Router();

const authRouter = require("./auth.routes.js");
const searchRouter = require("./search.routes.js");
const commentsRouter = require("./comments.routes.js");
const collectionsRouter = require("./collections.routes.js");
const categoriesRouter = require("./categories.routes.js");
const videosRouter = require("./videos.routes.js");

router.use("/comments", [commentsRouter]); // 끝!
router.use("/categories", [categoriesRouter]); // 끝!
router.use("/videos", [videosRouter]);

router.use("/collections", [collectionsRouter]);
router.use("/search", [searchRouter]);
router.use("/", [authRouter]);

module.exports = router;
