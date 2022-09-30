const express = require("express");
const router = express.Router();

const CollectionsService = require("../b_services/collections.service");
const collectionsService = new CollectionsService();

const Auth = require("./middleware/auth");
const { authMiddleware } = new Auth();
// const authMiddleware = (req, res, next) => {
// res.locals.user_id = process.env.TEMP_USER_ID;
// next();
// }; // dev-test용 authMiddleware

router.post("/", authMiddleware, collectionsService.createCollection);
router.get("/search", collectionsService.getCollectionsBySearch);
router.get("/", collectionsService.getAllCollectionsByCategoryId);
router.get("/mykeeps", authMiddleware, collectionsService.getAllCollectionsUserKeeps);
router.get("/mylikes", authMiddleware, collectionsService.getAllCollectionsUserLikes);
router.get("/mine", authMiddleware, collectionsService.getAllCollectionsByUserId);
router.post("/recommendation", collectionsService.getAllCollectionsByCategories);
router.put("/today", collectionsService.giveTodaysPopularCategories);
router.get("/:collection_id", collectionsService.getCollection);
router.put("/:collection_id", authMiddleware, collectionsService.editCollection);
router.delete("/:collection_id", authMiddleware, collectionsService.deleteCollection);
router.put("/visible/:collection_id", collectionsService.visibleCollection);
router.put("/like/:collection_id", authMiddleware, collectionsService.likeCollection);
router.put("/keep/:collection_id", authMiddleware, collectionsService.keepCollection);
router.put("/:collection_id", authMiddleware, collectionsService.addVideoOnCollection);
router.get("/whokeep/:collection_id", collectionsService.whoKeepCollection);
router.delete("/remove/:collection_id", authMiddleware, collectionsService.removeVideoFromCollection);

module.exports = router;
