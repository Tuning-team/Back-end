const express = require("express");
const router = express.Router();

const CommentService = require("../b_services/comments.service");
const commentService = new CommentService
//댓글 작성
router.post("/:collection_id", commentService.leaveCommentOn);
//댓글 목록 조회
router.get("/:collection_id", commentService.getCommentOn);
//댓글 수정
router.put("/:comment_id", commentService.updateComment);
//댓글 삭제
router.delete("/:commnet_id", commentService.deleteComment); 

module.exports = router;