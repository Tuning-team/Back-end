const express = require("express");
const router = express.Router();
const posts = require("../controller/posts");
const Post = require("../schemas/post");
const User = require("../schemas/user");

// const auth = require("../controller/auth");

// TASK 1 : 게시글 조회 with GET ('/api/posts')
router.get("/", posts.getPostsAll);
// TASK 2 : 게시글 작성 with POST ('/api/posts')
router.get("/create", posts.createPostPage);
router.post("/create", posts.createPost);
// TASK 3 : 게시글 수정 with PUT ('/api/posts')
router.put("/", posts.updatePost);
// TASK 4 : 게시글 삭제 with DELETE ('/api/posts')
router.delete("/:post_id", posts.deletePost);
// TASK 5 : 게시글 검색
router.get("/search", posts.searchPosts);

// 이 파일의 router 객체를 외부에 공개합니다.
module.exports = router;
