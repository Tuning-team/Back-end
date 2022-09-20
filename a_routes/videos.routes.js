const express = require("express");
const router = express.Router();

const VideoService = require("../b_services/videos.service");
const videoService = new VideoService();

router.get("/:collection_id", videoService.getVideosOn); // 컬렉션의 비디오들 조회
router.get("/detail/:video_id", videoService.getVideosDetail); // 비디오 상세조회
// router.post("/add/:videoId", videoService.addPLVideosOfChannelToSearch); //영상 아이디를 하나 넣으면 그 채널 전체의 재생목록 영상을 검색가능하게 함

module.exports = router;
