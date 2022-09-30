const express = require("express");
const router = express.Router();

const CommentService = require("../b_services/comments.service");
const commentService = new CommentService();

const Auth = require("./middleware/auth");
const { authMiddleware } = new Auth();
// const authMiddleware = (req, res, next) => {
// res.locals.user_id = process.env.TEMP_USER_ID;
// next();
// }; // dev-test용 authMiddleware


router.post("/:collection_id", commentService.leaveCommentOn);
router.get("/:collection_id", commentService.getCommentOn);
router.put("/:comment_id", authMiddleware, commentService.updateComment);
router.delete("/:comment_id", authMiddleware, commentService.deleteComment);
router.put("/like/:comment_id", commentService.likeCommentOn);

module.exports = router;
