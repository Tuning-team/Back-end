const express = require("express");
const router = express.Router();

const SearchService = require("../b_services/search.Service");
const searchService = new SearchService();

const Auth = require("./middleware/auth");
const { authMiddleware } = new Auth();


router.get("/videos/db", searchService.videoSearchViaDB);
router.get("/videos/youtube", authMiddleware, searchService.videoSearchViaYoutube);

module.exports = router;
