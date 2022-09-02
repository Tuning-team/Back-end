const express = requrie("express");
const router = express.Router();

const CategoryService = require("../b_services/categories.service");
const categoryService = new CategoryService();

router.get("/:categoty_id", categoryService.getCategoryOn);

module.exports = router;