
const CollectionRepository = require("../c_repositories/collections.repository");
const UserRepository = require("../c_repositories/users.repository");

const { collection } = require("../d_schemas/user");
const axios = require("axios");
const { Collection } = require("mongoose");

class CollectionsService {
  collectionRepository = new CollectionRepository();
  userRepository = new UserRepository();

  // 내가 담은 컬렉션 목록 조회
  getCollectionsByKeepingArray = async (req, res) => {
    try {
      let user_id = res.locals.user_id;

      const keepdataAll =
        await this.userRepository.getCollectionsByKeepingArray(
          keepCollectionsArr
        );

      let resultData = keepdataAll.map((e) => {
        return {
          collection_id: e.collection_id,
          keptBy: e.keptBy,
        };
      });
      res.status(200).json({
        success: true,
        message: "컬렉션을 확인하였습니다.",
        data: resultData,
      });
      return;
    } catch (error) {
      console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
      res.status(400).json({
        success: false,
        message: "내가 담은 컬렉션 목록 조회에 실패하였습니다.",
      });
    }
  };

  // 컬렉션 담기
  keepCollection = async (req, res) => {
    try {
      const { collection_id } = req.params;
      const user_id = res.locals.user_id;

      const thisCollection = await this.collectionRepository.getCollectionById(
        collection_id
      );

      const { keepCollectionsArr } = await this.userRepository.getUserById(
        user_id
      );

      if (!thisCollection) {
        res
          .status(400)
          .json({ success: false, message: "해당 컬렉션이 없습니다." });
      } else if (!keepCollectionsArr.includes(collection_id)) {
        await this.collectionRepository.keepCollection(collection_id);
        await this.userRepository.keepCollection(user_id, collection_id);
        res.status(200).json({
          success: true,
          message: "컬렉션을 담았습니다.",
        });
      }
      // else if (keepCollectionsArr.includes(collection_id)) {
      //   await this.collectionRepository.notKeepCollection(collection_id);
      //   await this.userRepository.notKeepCollection(user_id, collection_id);
      //   res.status(200).json({
      //     success: true,
      //     message: "컬렉션 담기를 취소하였습니다.",
      //   });
      // }
    } catch (error) {
      console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
      res.status(400).json({
        success: false,
        message: "컬렉션 담기에 실패하였습니다.",
      });
    }
  };

  // 컬렉션 담기 취소
  notKeepCollection = async (req, res) => {
    try {
      const { collection_id } = req.params;
      const user_id = res.locals.user_id;

      const thisCollection = await this.collectionRepository.getCollectionById(
        collection_id
      );

      const { keepCollectionsArr } = await this.userRepository.getUserById(
        user_id
      );

      // if (user_id !== keepCollectionsArr.user_id) {
      //   res.status(400).json({ success: false, message: "권한이 없습니다." });
      // }

      if (!thisCollection) {
        res
          .status(400)
          .json({ success: false, message: "해당 컬렉션이 없습니다." });
      } else if (keepCollectionsArr.includes(collection_id)) {
        await this.collectionRepository.notKeepCollection(collection_id);
        await this.userRepository.notKeepCollection(collection_id);
        res.status(200).json({
          success: true,
          message: "컬렉션 담기를 취소하였습니다.",
        });
      }
    } catch (error) {
      console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
      res.status(400).json({
        success: false,
        message: "컬렉션 담기에 실패하였습니다.",
      });
    }
  };
}

module.exports = CollectionsService;
=======
const UsersRepository = require("../c_repositories/users.repository");

class UserService {
  usersRepository = new UsersRepository();

  //ID로 유저정보 조회
  getLoggedInUser = async (req, res) => {
    const user_id = res.locals.user_id;
    const user = await this.usersRepository.getUserById(user_id);

    res.status(200).json({ success: true, user });
  };
  //ID로 유저정보 조회
  getUserById = async (req, res) => {
    const user = await this.usersRepository.getUserById(req.params.user_id);
    res.status(200).json({ success: true, user });
  };

  followUnfollow = async (req, res) => {
    try {
      const user_id = res.locals.user_id;
      // const user_id = process.env.TEMP_USER_ID;

      const user = await this.usersRepository.getUserById(user_id);

      if (user_id === req.params.user_id) {
        res.status(400).json({
          success: false,
          message: `자기 자신을 팔로우 할 수 없습니다.`,
        });
        return;
      }

      if (!user.followings.includes(req.params.user_id)) {
        //팔로우
        await this.usersRepository.followUser(user_id, req.params.user_id);

        res.status(200).json({
          success: true,
          message: `${user_id}가 ${req.params.user_id}를 팔로우합니다.`,
        });
      } else {
        //언팔로우
        await this.usersRepository.unfollowUser(user_id, req.params.user_id);

        res.status(200).json({
          success: true,
          message: `${user_id}가 ${req.params.user_id}팔로우를 취소했습니다.`,
        });
      }
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  getFollowings = async (req, res) => {
    try {
      const { user_id } = req.params;
      const { followings } = await this.usersRepository.getUserById(user_id);

      res.status(200).json({
        success: true,
        data: followings,
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };
}
module.exports = UserService;
