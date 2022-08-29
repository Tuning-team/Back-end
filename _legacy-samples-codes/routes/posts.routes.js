// app.js -> index.js의 Router를 통해 들어온 이파일은,
// 기본값 'api/posts'로 연결된 요청을 처리합니다.

// 이 파일에서 사용할 라우터 객체 생성
const express = require("express");
const router = express.Router();

// 각 api 접근할 때마다 사용자 인증을 위한 미들웨어 임포트
const Auth = require("../middlewares/auth-middleware"); // 유저인증 클래스
const auth = new Auth(); // 유저 인증 클래스의 인스턴스 확보
const authMiddleware = auth.authMiddleware; // ---> 미들웨어로 사용할 인스턴스 메소드

// 라우터가 나누어 보낼 컨트롤러 인스턴스 확보
const PostsController = require("../controllers/posts.controller"); // 컨트롤러 임포트
const postsController = new PostsController(); // 컨트롤러 임포트

console.log("** --- Post Router ---");

// TASK 1 : 게시글 목록 조회 with GET ('/api/posts')
router.get("/", postsController.getAllPosts);
// TASK 2 : 게시글 작성 with POST ('/api/posts')
router.post("/", authMiddleware, postsController.createNewPost);
// TASK 7 : 내가 좋아한 게시글 조회 ('/api/posts/like)
router.get("/like", authMiddleware, postsController.listMyLikedPosts);
// TASK 3 : 게시글 상세조회 with GET ('/api/posts/:_postId')
router.get("/:_postId", postsController.getPostDetail);
// TASK 4 : 게시글 수정 with PUT ('/api/posts/:_postId')
router.put("/:_postId", authMiddleware, postsController.updatePost);
// TASK 5 : 게시글 삭제 with DELETE ('/api/posts/:_postId')
router.delete("/:_postId", authMiddleware, postsController.deletePost);
// TASK 6 : 게시글 좋아요 누르기 ('/api/posts/:_postId/like)
router.put("/:_postId/like", authMiddleware, postsController.likePost);

console.log("** --- Post Router Set ---");

// 이 파일의 router 객체를 외부에 공개합니다.
module.exports = router;

/**
 * @swagger
 *  /api/posts:
 *    get:
 *      tags:
 *      - Posts
 *      description: 게시글 목록 조회
 *      operationId : getPostList
 *      responses:
 *        200:
 *          schema:
 *           type: object
 *           properties:
 *             postId:
 *               type: string
 *             userId:
 *               type: string
 *             nickname:
 *               type: string
 *             title:
 *               type: string
 *             createdAt:
 *               type: string
 *             updatedAt:
 *               type: string
 *             likes:
 *               type: integer
 */

/**
 * @swagger
 *  /api/posts:
 *    post:
 *      tags:
 *      - Posts
 *      description: 게시글 작성
 *      operationId : post_a_Post
 *      parameters:
 *      - in: "body"
 *        name: "body"
 *        description: "Create a Blog Post"
 *        required: true
 *        schema:
 *          type: object
 *          properties:
 *            title:
 *              type: string
 *              example: '게시글 제목'
 *            content:
 *              type: string
 *              example: '안녕하세요, 이런저런 이야기를 쓰고 있습니다.'
 *      responses:
 *        200:
 *          description: "게시글을 생성하였습니다."
 */

/**
 * @swagger
 *  /api/posts/like:
 *    get:
 *      tags:
 *      - Posts
 *      description: 내가 좋아한 포스트 목록 보기
 *      operationId : postsILiked
 *      responses:
 *        200:
 *          schema:
 *           type: object
 *           properties:
 *             postId:
 *               type: string
 *             userId:
 *               type: string
 *             nickname:
 *               type: string
 *             title:
 *               type: string
 *             createdAt:
 *               type: string
 *             updatedAt:
 *               type: string
 *             likes:
 *               type: integer
 */

/**
 * @swagger
 *  /api/posts/{_postId}:
 *    get:
 *      tags:
 *      - Posts
 *      description: 게시글 상세조회
 *      operationId : viewPostDetail
 *      parameters:
 *      - in: "path"
 *        name: _postId
 *        description: 게시글 ID
 *        required: true
 *        schema:
 *          type: string
 *          example: '5'
 *      responses:
 *        200:
 *          schema:
 *            type: object
 *            properties:
 *              postId:
 *                type: string
 *              userId:
 *                type: string
 *              nickname:
 *                type: string
 *              title:
 *                type: string
 *              createdAt:
 *                type: string
 *              updatedAt:
 *                type: string
 *              likes:
 *                type: integer
 *        400-1:
 *          description: "해당 게시글이 없습니다."
 */

/**
 * @swagger
 *  /api/posts/{_postId}:
 *    put:
 *      tags:
 *      - Posts
 *      description: 게시글 수정
 *      operationId : editPost
 *      parameters:
 *      - in: "body"
 *        name: "body"
 *        description: "edit that Post"
 *        required: true
 *        schema:
 *          type: object
 *          properties:
 *            title:
 *              type: string
 *              example: '수정할 게시글 제목'
 *            content:
 *              type: string
 *              example: '이러이러하게 수정을 하고 싶어요!'
 *      - in: "path"
 *        name: params
 *        description: 어떤 포스트를 수정할지 선택할 id
 *        required: true
 *        schema:
 *          type: object
 *          properties:
 *            _postId:
 *              type: integer
 *              example: 6
 *      responses:
 *        200:
 *          description: "게시글을 수정하였습니다."
 *        400-1:
 *          description: "해당 게시글이 없습니다."
 *        400-2:
 *          description: "수정 권한이 없습니다."
 */

/**
 * @swagger
 *  /api/posts/{_postId}:
 *    delete:
 *      tags:
 *      - Posts
 *      description: 게시글 삭제
 *      operationId : deletePost
 *      parameters:
 *      - in: "path"
 *        name: params
 *        description: 어떤 포스트를 수정할지 선택할 id
 *        required: true
 *        schema:
 *          type: object
 *          properties:
 *            _postId:
 *              type: integer
 *              example: 6
 *      responses:
 *        200:
 *          description: "게시글을 수정하였습니다."
 *        400-1:
 *          description: "해당 게시글이 없습니다."
 *        400-2:
 *          description: "삭제 권한이 없습니다."
 */

/**
 * @swagger
 *  /api/posts/{_postId}/like:
 *    put:
 *      tags:
 *      - Posts
 *      description: 좋아요 or 좋아요 취소
 *      operationId : likeIt
 *      parameters:
 *      - in: "path"
 *        name: "path"
 *        description: 좋아요 누를 포스트 id
 *        required: true
 *        schema:
 *          type: string
 *          example: '5'
 *      responses:
 *        200-1:
 *          description: "게시글의 좋아요를 등록하였습니다."
 *        200-2:
 *          description: "게시글의 좋아요를 취소하였습니다."
 *        400-1:
 *          description: "해당 게시글이 없습니다."
 */
