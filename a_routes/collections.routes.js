// app.js -> index.js의 Router를 통해 들어온 이파일은,
// 기본값 'api/posts'로 연결된 요청을 처리합니다.

// 이 파일에서 사용할 라우터 객체 생성
const express = require("express");
const router = express.Router();

// 라우터가 나누어 보낼 서비스 인스턴스 확보
const CollectionsService = require("../b_services/collections.service");
const collectionsService = new CollectionsService();

// 내가 모은 컬렉션 목록 조회
router.get("/mine", collectionsService.getAllCollectionsByUserId);
// 카테고리에 포함된 컬렉션
router.get("/", collectionsService.getAllCollectionsByCategoryId);
// 컬렉션 상세 조회
router.get("/:collection_id", collectionsService.getCollection);
// 컬렉션 생성
router.post("/", collectionsService.createCollection);
// 컬렉션 삭제
router.delete("/:collection_id", collectionsService.deleteCollection);
// 검색어에 맞는 컬렉션 리스트
router.get("/");
// 컬렉션 좋아요
router.put("/like", collectionsService.likeCollection);
// 컬렉션 좋아요 취소
router.put("/like", collectionsService.disLikeCollection);
// 컬렉션에 영상 추가
router.put("/:collection_id");


module.exports = router;