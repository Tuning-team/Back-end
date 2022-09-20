const express = require("express");
const router = express.Router();

const authRouter = require("./auth.routes.js");
const searchRouter = require("./search.routes.js");
const commentsRouter = require("./comments.routes.js");
const collectionsRouter = require("./collections.routes.js");
const categoriesRouter = require("./categories.routes.js");
const videosRouter = require("./videos.routes.js");
const usersRouter = require("./user.routes");


router.use("/", authRouter);
router.use("/comments", commentsRouter);
router.use("/categories", categoriesRouter);
router.use("/videos", videosRouter);
router.use("/collections", collectionsRouter);
router.use("/search", searchRouter);
router.use("/user", usersRouter);

module.exports = router;
