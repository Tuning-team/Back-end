const express = require("express");
const router = express.Router();

const SearchService = require("../b_services/search.Service");
const searchService = new SearchService();

const Auth = require("./middleware/auth");
const { authMiddleware } = new Auth();
// const authMiddleware = (req, res, next) => {
// res.locals.user_id = process.env.TEMP_USER_ID;
// next();
// }; // dev-test용 authMiddleware

router.get("/videos/db", searchService.videoSearchViaDB);
router.get("/videos/youtube", searchService.videoSearchViaYoutube);

module.exports = router;
