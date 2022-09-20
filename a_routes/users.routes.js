const express = require("express");
const router = express.Router();

const Auth = require("./middleware/auth");
const { authMiddleware } = new Auth();

const UserService = require("../b_services/users.service");
const userService = new UserService();

router.get("/", authMiddleware, userService.getLoggedInUser);
router.get("/:user_id", userService.getUserById);
router.put("/follow/:user_id", authMiddleware, userService.followUnfollow);
router.get("/follow/:user_id", userService.getFollowings);

module.exports = router;
