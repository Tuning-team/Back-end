const express = require("express");
const router = express.Router();

const VideoService = require("../b_services/videos.service");
const videoService = new VideoService();

router.get("/:collection_id", videoService.getVideosOn); // 컬렉션의 비디오들 조회
router.get("/detail/:video_id", videoService.getVideosDetail); //비디오 상세조회

module.exports = router;
