const express = require("express");
const router = express.Router();
const profiles = require("../controller/profiles");
// const auth = require("../controller/auth");

// TASK 1 : 내 프로필 조회
router.get("/", profiles.getProfile);
// TASK 2 : 내 프로필 수정
router.put("/", profiles.updateProfile);
// TASK 5 : 로그인된 유저가 _id 유저를 팔로우
router.put("/follow/:_id", profiles.followAction);
// TASK 6 : 로그인된 유저가 _id 유저를 언팔로우
router.put("/unfollow/:_id", profiles.unfollowAction);
// TASK 8 : 프로필을 검색하여, 리스트로 보기
router.get("/search", profiles.searchProfiles);
// TASK 9 : 팔로우할 프로필 추천
router.get("/whoTofollow", profiles.whoTofollow);
// TASK 3 : _id를 가진 유저가 팔로잉 하는 유저들의 리스트
router.get("/:_id/followings", profiles.userFollows);
// TASK 4 : _id를 가진 유저를 팔로잉 하는 유저들의 리스트
router.get("/:_id/followers", profiles.userFollowedBy);
// TASK 7 : 특정 유저(:_id)의 프로필 보기
router.get("/:_id", profiles.getOthersProfile);

// 이 파일의 router 객체를 외부에 공개합니다.
module.exports = router;
