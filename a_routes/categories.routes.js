const express = require("express");
const router = express.Router();

const CategoryService = require("../b_services/categories.service");
const categoryService = new CategoryService();

const Auth = require("./middleware/auth");
const { authMiddleware } = new Auth();

router.get("/", categoryService.getCategoryOn);
router.get("/interest/:category_id", categoryService.getInterestedList);
router.put("/interest/:category_id", authMiddleware, categoryService.interestCategory);

module.exports = router;
