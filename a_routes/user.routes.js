const express = require("express");
const router = express.Router();

const UserRepository = require("../c_repositories/users.repository");
const userRepository = new UserRepository();

const Auth = require("./middleware/auth");
const { authMiddleware } = new Auth();

router.get(
  "/keep",
  // authMiddleware,
  userRepository.getCollectionsByKeepingArray
); // 내가 담은 컬렉션 목록 조회

router.put(
  "/keep/:collection_id",
  // authMiddleware,
  userRepository.keepCollection
); // 컬렉션 담기

router.delete(
  "/keep/:collection_id",
  // authMiddleware,
  userRepository.notKeepCollection
); // 컬렉션 담기 취소(삭제)

module.exports = router;
