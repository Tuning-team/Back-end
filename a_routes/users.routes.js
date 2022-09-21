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

router.get("/", authMiddleware, userService.getLoggedInUser);
router.get("/interest", authMiddleware, userService.getInterestCategories);
router.get("/keep", authMiddleware, userService.getCollectionsByKeepingArray);
router.get("/:user_id", userService.getUserById);
router.put("/follow/:user_id", authMiddleware, userService.followUnfollow);
router.get("/follow/:user_id", userService.getFollowings);
router.put("/interest/:category_id", authMiddleware, userService.setInterestCategories);
router.delete("/interest/:category_id", authMiddleware, userService.removeInterestCategories);
router.put("/keep/:collection_id", authMiddleware, userService.keepCollection);
router.delete("/keep/:collection_id", authMiddleware, userService.notKeepCollection);

/*authMiddleware,*/

module.exports = router;
