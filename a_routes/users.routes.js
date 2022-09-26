const express = require("express");
const router = express.Router();

const Auth = require("./middleware/auth");
const { authMiddleware } = new Auth();

const UserService = require("../b_services/users.service");
const userService = new UserService();
const CategoryService = require("../b_services/categories.service");
const categoryService = new CategoryService();

const UserRepository = require("../c_repositories/users.repository");
const userRepository = new UserRepository();

router.get("/", authMiddleware, userService.getLoggedInUser); // 로그인한 유저 정보 가져오기
router.get("/interest", authMiddleware, userService.getInterestCategories); // 관심사 조회
router.get("/keep", authMiddleware, userService.getCollectionsByKeepingArray);
router.get("/:user_id", userService.getUserById); // 고유 id로 유저 정보 찾기
router.put("/follow/:user_id", authMiddleware, userService.followUnfollow); // 유저 팔로우/언팔로우
router.get("/follow/:user_id", userService.getFollowings); // 팔로잉 하고 있는 유저 조회
router.put("/interest/:category_id", authMiddleware, userService.setInterestCategories); // 관심사 등록 및 수정
router.delete("/interest/:category_id", authMiddleware, userService.removeInterestCategories); // 관심사 삭제
// router.put("/keep/:collection_id", authMiddleware, userService.keepCollection);
// router.delete("/keep/:collection_id", authMiddleware, userService.notKeepCollection);

/*authMiddleware,*/

module.exports = router;
