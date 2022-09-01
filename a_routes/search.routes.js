const express = require("express");
const router = express.Router();

const SearchService = require("../b_services/search.Service");
const searchService = new SearchService();

router.get("/videos/db", searchService.videoSearchViaDB);
router.get("/videos/youtube", searchService.videoSearchViaYoutube);

module.exports = router;
