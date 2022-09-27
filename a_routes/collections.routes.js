const express = require("express");
const router = express.Router();

const CollectionsService = require("../b_services/collections.service");
const collectionsService = new CollectionsService();

const Auth = require("./middleware/auth");
const { authMiddleware } = new Auth();

router.post("/", authMiddleware, collectionsService.createCollection); // 컬렉션 생성
router.get("/search", collectionsService.getCollectionsBySearch); // 검색어에 맞는 컬렉션 리스트
router.get("/", collectionsService.getAllCollectionsByCategoryId); // 카테고리에 포함된 컬렉션 목록 조회
router.get("/mykeeps", authMiddleware, collectionsService.getAllCollectionsUserKeeps); // 내가 담은 컬렉션 목록 조회
router.get("/mylikes", authMiddleware, collectionsService.getAllCollectionsUserLikes); // 내가 좋아한 컬렉션 목록 조회
router.get("/mine", authMiddleware, collectionsService.getAllCollectionsByUserId); // 내가 만든 컬렉션 목록 조회
router.post("/recommendation", collectionsService.getAllCollectionsByCategories); // 추천 카테고리 한번에
router.put("/today", collectionsService.giveTodaysPopularCategories); // 컬렉션 좋아요 내림차순 10개까지 조회
router.get("/:collection_id", collectionsService.getCollection); // 컬렉션 상세 조회
router.put("/:collection_id", authMiddleware, collectionsService.editCollection); // 컬렉션 수정
router.delete("/:collection_id", authMiddleware, collectionsService.deleteCollection); // 컬렉션 삭제
router.put("/like/:collection_id", authMiddleware, collectionsService.likeCollection); // 컬렉션 좋아요 또는 좋아요 취소
router.put("/keep/:collection_id", authMiddleware, collectionsService.keepCollection); // 컬렉션 담기 또는 담기 취소
router.put("/:collection_id", authMiddleware, collectionsService.addVideoOnCollection); // 컬렉션에 영상 추가,
router.get("/whokeep/:collection_id", collectionsService.whoKeepCollection); // 컬렉션 담은 이용자 조회
router.delete("/remove/:collection_id", authMiddleware, collectionsService.removeVideoFromCollection); // 컬렉션에서 영상 삭제

module.exports = router;
