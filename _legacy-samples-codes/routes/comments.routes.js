// app.js -> index.js의 Router를 통해 들어온 이파일은,
// 기본값 'api/comments'로 연결된 요청을 처리합니다.

// 이 파일에서 사용할 라우터 객체 생성
const express = require("express");
const router = express.Router();

// 각 api 접근할 때마다 사용자 인증을 위한 미들웨어 임포트
const Auth = require("../middlewares/auth-middleware"); // 유저인증 클래스
const auth = new Auth(); // 유저 인증 클래스의 인스턴스 확보
const authMiddleware = auth.authMiddleware; // ---> 미들웨어로 사용할 인스턴스 메소드

// 라우터가 나누어 보낼 컨트롤러 인스턴스 확보
const CommentsController = require("../controllers/comments.controller");
const commentsController = new CommentsController();

console.log("** --- Comment Router ---");

// TASK 1. 댓글 작성 with POST ('/api/comments/_postId')
router.post("/:_postId", authMiddleware, commentsController.leaveComment);
// TASK 2. 댓글 목록 조회 with GET ('/api/comments/_postId')
router.get("/:_postId", commentsController.getCommentsOn);
// TASK 3. 댓글 수정 with PUT ('/api/comments/_commentId')
router.put("/:_commentId", authMiddleware, commentsController.updateComment);
// TASK 4.게시글 삭제 with DELETE ('/api/comments/_commentId')
router.delete("/:_commentId", authMiddleware, commentsController.deleteComment);

console.log("** --- Comment Router Set ---");

module.exports = router;

/**
 * @swagger
 *  /api/comments/{_postId}:
 *    post:
 *      tags:
 *      - Comments
 *      description: 댓글 작성
 *      operationId : postAComment
 *      parameters:
 *      - in: "path"
 *        name: _postId
 *        description: 어느 포스트에 댓글을 작성할지
 *        required: true
 *        schema:
 *          type: string
 *          example: '5'
 *      responses:
 *        200:
 *          description: "댓글을 생성하였습니다."
 *        400-1:
 *          description: "댓글 내용을 입력해주세요."
 *        400-2:
 *          description: "해당 게시글이 없습니다."
 */

/**
 * @swagger
 *  /api/comments/{_postId}:
 *    get:
 *      tags:
 *      - Comments
 *      description: 댓글 목록 조회
 *      operationId : getCommentsList
 *      parameters:
 *      - in: "path"
 *        name: _postId
 *        description: 어느 포스트의 댓글을 표시할지
 *        required: true
 *        schema:
 *          type: string
 *          example: '5'
 *      responses:
 *        200:
 *          schema:
 *           type: object
 *           properties:
 *             commentId:
 *               type: string
 *             userId:
 *               type: integer
 *             nickname:
 *               type: string
 *             comment:
 *               type: string
 *             createdAt:
 *               type: string
 *             updatedAt:
 *               type: string
 */

/**
 * @swagger
 *  /api/comments/{_commentId}:
 *    put:
 *      tags:
 *      - Comments
 *      description: 댓글 수정
 *      operationId : editComment
 *      parameters:
 *      - in: "path"
 *        name: _commentId
 *        description: 어떤 댓글을 수정할지
 *        required: true
 *        schema:
 *          type: string
 *          example: '12'
 *      - in: "body"
 *        name: comment
 *        description: 댓글을 어떻게 수정할지
 *        required: true
 *        schema:
 *          type: object
 *          properties:
 *            comment:
 *              type: string
 *              example: '이러이러하게 수정을 하고 싶어요!'
 *      responses:
 *        200:
 *          description: "댓글을 수정하였습니다."
 *        400-1:
 *          description: "해당 댓글이 없습니다."
 *        400-2:
 *          description: "댓글 내용을 입력해주세요."
 *        400-3:
 *          description: "수정 권한이 없습니다."
 */

/**
 * @swagger
 *  /api/comments/{_commentId}:
 *    delete:
 *      tags:
 *      - Comments
 *      description: 댓글 삭제
 *      operationId : deleteComment
 *      parameters:
 *      - in: "path"
 *        name: _commentId
 *        description: 어떤 댓글을 수정할지
 *        required: true
 *        schema:
 *          type: string
 *          example: '12'
 *      responses:
 *        200:
 *          description: "댓글을 삭제하였습니다."
 *        400-1:
 *          description: "해당 댓글이 없습니다."
 *        400-2:
 *          description: "삭제 권한이 없습니다."
 */
