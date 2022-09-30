const CollectionRepository = require("../c_repositories/collections.repository");
const UsersRepository = require("../c_repositories/users.repository");
const CategoryRepository = require("../c_repositories/categories.repository");

class UserService {
  categoryRepository = new CategoryRepository();
  collectionRepository = new CollectionRepository();
  usersRepository = new UsersRepository();

  // ID로 유저정보 조회
  getLoggedInUser = async (req, res) => {
    const user_id = res.locals.user_id;
    const user = await this.usersRepository.getUserById(user_id);
    res.status(200).json({ success: true, user });
  };

  // ID로 유저정보 조회
  getUserById = async (req, res) => {
    const user = await this.usersRepository.getUserById(req.params.user_id);
    res.status(200).json({ success: true, user });
  };

  // 카테고리 관심 등록
  setInterestCategories = async (req, res) => {
    try {
      // 재료
      let { category_id } = req.params;
      let category_ids = category_id.split(",").map((e) => e.trim()); // 배열
      const user_id = res.locals.user_id;

      await this.usersRepository.setInterestCategories(user_id, category_ids);
      let categories = await this.categoryRepository.getAllCategories(category_ids);

      res.status(200).json({
        success: true,
        message: "관심사를 설정하였습니다.",
        data: {
          user_id,
          categories,
        },
      });
    } catch (error) {
      console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
      res.status(400).json({
        success: false,
        message: "관심사 등록/취소 기능에 실패하였습니다.",
      });
    }
  };

  // 관심사 확인
  getInterestCategories = async (req, res) => {
    try {
      const user_id = res.locals.user_id;
      const { myInterestingCategories } = await this.usersRepository.getUserById(user_id);

      console.log("myInterestingCategories", myInterestingCategories);
      let categories = await this.categoryRepository.getAllCategories(myInterestingCategories);

      res.status(200).json({
        success: true,
        message: "관심사를 확인하였습니다.",
        data: {
          user_id,
          categories,
        },
      });
    } catch (error) {
      console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
      res.status(400).json({
        success: false,
        message: "관심사 조회에 실패하였습니다..",
      });
    }
  };

  // 관심사 제거
  removeInterestCategories = async (req, res) => {
    try {
      const user_id = res.locals.user_id;
      const { category_id } = req.params;

      const { myInterestingCategories } = await this.usersRepository.getUserById(user_id);
      const filteredArr = myInterestingCategories.filter((e) => e !== category_id);

      const updatedUser = await this.usersRepository.updateUserInterest(user_id, filteredArr);

      res.status(200).json({
        success: true,
        message: "관심사를 삭제하였습니다.",
      });
    } catch (error) {
      console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
      res.status(400).json({
        success: false,
        message: "관심사 조회에 실패하였습니다..",
      });
    }
  };

  // 팔로우 또는 언팔로우
  followUnfollow = async (req, res) => {
    try {
      const user_id = res.locals.user_id;
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

  // 팔로우하는 사람 찾기
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

  // 컬렉션 담기
  keepCollection = async (req, res) => {
    try {
      const { collection_id } = req.params;
      const user_id = res.locals.user_id;

      const thisCollection = await this.collectionRepository.getCollectionById(collection_id);
      let { myKeepingCollections } = await this.usersRepository.getUserById(user_id);

      if (!thisCollection) {
        res.status(400).json({ success: false, message: "해당 컬렉션이 없습니다." });
        return;
      }

      if (!myKeepingCollections.includes(collection_id)) {
        const updatedArr = [...thisCollection.keptBy, user_id];
        await this.collectionRepository.keepCollection(collection_id, updatedArr);

        myKeepingCollections.push(collection_id);
        await this.usersRepository.keepCollection(user_id, myKeepingCollections);

        res.status(200).json({
          success: true,
          message: "컬렉션을 담았습니다.",
          data: {
            user_id: user_id,
            kept_collection: collection_id,
          },
        });
      } else {
        res.status(400).json({
          success: false,
          message: "컬렉션이 이미 담겨 있습니다.",
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

  // 컬렉션 담기 취소
  notKeepCollection = async (req, res) => {
    try {
      const { collection_id } = req.params;
      const user_id = res.locals.user_id;

      const thisCollection = await this.collectionRepository.getCollectionById(collection_id);
      let { myKeepingCollections } = await this.usersRepository.getUserById(user_id);

      if (!thisCollection) {
        res.status(400).json({ success: false, message: "해당 컬렉션이 없습니다." });
        return;
      }

      if (myKeepingCollections.includes(collection_id)) {
        const filteredUserArr = thisCollection.keptBy.filter((e) => e !== user_id);
        await this.collectionRepository.keepCollection(collection_id, filteredUserArr);

        const filteredCollectionArr = myKeepingCollections.filter((e) => e !== collection_id);
        await this.usersRepository.keepCollection(user_id, filteredCollectionArr);

        res.status(200).json({
          success: true,
          message: "컬렉션 담기를 취소하였습니다.",
        });
      }
    } catch (error) {
      console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
      res.status(400).json({
        success: false,
        message: "컬렉션 담기 취소에 실패하였습니다.",
      });
    }
  };

  // 내가 담은 컬렉션 목록 조회
  getCollectionsByKeepingArray = async (req, res) => {
    try {
      let user_id = res.locals.user_id;
      let { myKeepingCollections } = await this.usersRepository.getUserById(user_id);

      let data = [];
      for (let i = 0; i < myKeepingCollections.length; i++) {
        const item = await this.collectionRepository.getCollectionById(myKeepingCollections[i]);

        data.push(item);
      }

      res.status(200).json({
        success: true,
        message: "컬렉션을 확인하였습니다.",
        data: {
          user_id,
          kept_collections: data,
        },
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
}
module.exports = UserService;
