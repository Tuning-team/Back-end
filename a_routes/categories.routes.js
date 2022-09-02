const express = require("express");
const router = express.Router();

const CategoryService = require("../b_services/categories.service");
const categoryService = new CategoryService();

router.get("/", categoryService.getCategoryOn);

module.exports = router;
