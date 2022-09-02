const express = require("express");
const router = express.Router();

const authRouter = require("./auth.routes.js");
const searchRouter = require("./search.routes.js");
const commentsRouter = require("./comments.routes.js");
const collectionsRouter = require("./collections.routes.js");

router.use("/collections", [collectionsRouter]);
router.use("/search", [searchRouter]);
router.use("/comments", [commentsRouter]);
router.use("/", [authRouter]);

module.exports = router;
