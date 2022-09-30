const express = require("express");
const router = express.Router();

const VideoService = require("../b_services/videos.service");
const videoService = new VideoService();

router.get("/:collection_id", videoService.getVideosOn);
router.get("/detail/:video_id", videoService.getVideosDetail);

module.exports = router;

// router.post("/add/:videoId", videoService.addPLVideosOfChannelToSearch); //영상 아이디를 하나 넣으면 그 채널 전체의 재생목록 영상을 검색가능하게 함
