const express = require("express");
const router = express.Router();
const comments = require("../controller/comments");
const auth = require("../controller/auth");

//  ---------------- 여기부터 API 시작 ----------------

// TASK 2 : 댓글 작성 with POST ('/api/comments')
router.get("/create", comments.createCommentsPage);
router.post("/:postId/create", comments.createComments);
// TASK 1 : 댓글 조회 with GET ('/api/comments')
router.get("/:postId", comments.getAllComments);
// TASK 3 : 댓글 수정 with POST ('/api/comments')
router.put("/", comments.updateComments);
// // TASK 4 : 댓글 삭제 with POST ('/api/comments')
router.delete("/", comments.deleteComments);

// 이 파일의 router 객체를 외부에 공개합니다.
module.exports = router;
