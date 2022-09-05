const express = require("express");
const router = express.Router();

const CommentService = require("../b_services/comments.service");
const commentService = new CommentService();

router.post("/:collection_id", commentService.leaveCommentOn); //댓글 작성
router.get("/:collection_id", commentService.getCommentOn); //댓글 목록 조회
router.put("/:comment_id", commentService.updateComment); //댓글 수정
router.delete("/:comment_id", commentService.deleteComment); //댓글 삭제

module.exports = router;
