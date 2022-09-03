const CollectionRepository = require("../c_repositories/collections.repository");
const UserRepository = require("../c_repositories/users.repository");

class CollectionsService {
  collectionRepository = new CollectionRepository();
  userRepository = new UserRepository();

  // 내가 모은 컬렉션 목록 조회
  getAllCollectionsByUserId = async (req, res) => {
    try {
      const user_id = "6312ad8b5057863778c220ca";

      const userdataAll =
        await this.collectionRepository.getAllCollectionsByUserId(user_id);

      if (!userdataAll) {
        res.status(400).json({
          message: "만들어진 컬렉션이 없습니다.",
        });
      }

      const resultData = userdataAll.map((collection) => {
        return {
          _id: collection._id,
          user_id: collection.user_id,
          collectionTitle: collection.collectionTitle,
          description: collection.description,
          videos: collection.videos,
          likes: collection.likes,
          createdAt: collection.createdAt,
        };
      });

      res.status(200).json(resultData);
      return;
    } catch (error) {
      console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
      return res.status(400).json({
        errorMessage: "컬렉션 조회에 실패하였습니다.",
      });
    }
  };

  // 카테고리에 포함된 컬렉션 목록 조회
  getAllCollectionsByCategoryId = async (req, res) => {
    try {
      const { category_id } = req.query;
      const categorydataAll =
        await this.collectionRepository.getAllCollectionsByCategoryId(
          category_id
        );

      const resultData = categorydataAll.map((collection) => {
        return {
          _id: collection._id,
          category_id: collection.category_id,
          collectionTitle: collection.collectionTitle,
          description: collection.description,
          videos: collection.videos,
          likes: collection.likes,
          createdAt: collection.createdAt,
        };
      });
      res.status(200).json(resultData);
      return;
    } catch (error) {
      console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
      return res.status(400).json({
        errorMessage: "컬렉션 조회에 실패하였습니다.",
      });
    }
  };

  // 컬렉션 상세 조회
  getCollection = async (req, res) => {
    try {
      const { _id } = req.params;

      const thisCollection = await this.collectionRepository.getCollectionById(
        _id
      );
      if (!thisCollection) {
        res.json({ message: "해당 컬렉션이 없습니다." });
      }
      const returnCollection = [
        {
          _id: thisCollection._id,
          user_id: thisCollection.user_id,
          collectionTitle: thisCollection.collectionTitle,
          description: thisCollection.description,
          videos: thisCollection.videos,
          likes: thisCollection.likes,
          createdAt: thisCollection.createdAt,
        },
      ];
      res.status(200).json(returnCollection);
    } catch (error) {
      console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
      return res.status(400).json({
        errorMessage: "컬렉션 조회에 실패하였습니다.",
      });
    }
  };

  // 컬렉션 생성
  createCollection = async (req, res) => {
    try {
      const user_id = "6312ad8b5057863778c220ca";
      const {
        category_id,
        collectionTitle,
        description,
        videos,
        likes,
        createdAt,
      } = req.body;

      const returnCollection = await this.collectionRepository.createCollection(
        user_id,
        category_id,
        collectionTitle,
        description,
        videos,
        likes,
        createdAt
      );
      res.status(201).json({
        success: true,
        message: "컬렉션을 생성하였습니다.",
        returnCollection,
      });
    } catch (error) {
      console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
      return res.status(400).json({
        errorMessage: "컬렉션 생성에 실패하였습니다.",
      });
    }
  };

  // 컬렉션 삭제
  deleteCollection = async (req, res) => {
    try {
      const user_id = "6312ad8b5057863778c220ca"; //c
      const { collection_id } = req.params;

      const thisCollection = await this.collectionRepository.getCollectionById(
        collection_id
      );

      if (!thisCollection) {
        res
          .status(400)
          .json({ success: false, message: "해당 컬렉션이 없습니다." });
      } else if (user_id !== thisCollection.user_id) {
        res
          .status(400)
          .json({ success: false, message: "삭제 권한이 없습니다." });
      } else {
        await this.collectionRepository.deleteCollection(collection_id);
        res
          .status(200)
          .json({ success: true, message: "컬렉션을 삭제하였습니다." });
      }
    } catch (error) {
      console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
      res.status(400).json({
        errorMessage: "컬렉션 삭제에 실패하였습니다.",
      });
    }
  };

  // 컬렉션 좋아요 누르기
  likeCollection = async (req, res) => {
    const { collection_id } = req.params;
    // const { user_id } = req.body;
    const user_id = "6312ad8b5057863778c220ca";

    // DB에서 현재 컬렉션의 정보와 유저가 지금까지 좋아한 Array 획득
    const thisCollection = await this.collectionRepository.getCollectionById(
      collection_id
    );

    const { likedCollectionsArr } = await this.userRepository.getUserById(
      user_id
    );

    console.log(
      "likedCollectionsArr.includes(thisCollection._id):",
      likedCollectionsArr.includes(collection_id)
    );

    if (!thisCollection) {
      res
        .status(400)
        .json({ success: false, message: "해당 컬렉션이 없습니다." });
    } else if (!likedCollectionsArr.includes(collection_id)) {
      await this.collectionRepository.likeCollection(collection_id);
      await this.userRepository.likeCollection(user_id, collection_id);
      res
        .status(200)
        .json({ success: true, message: "컬렉션에 좋아요를 등록하였습니다." });
    } else {
      await this.collectionRepository.disLikeCollection(collection_id);
      await this.userRepository.disLikeCollection(user_id, collection_id);
      res
        .status(200)
        .json({ success: true, message: "컬렉션에 좋아요를 취소하였습니다." });
    }
  };

  // --------- 검색어와 내용, 제목 일부 일치하는 컬렉션 찾기
  getCollectionsBySearch = async (req, res) => {
    try {
      const { keyword } = req.query;
      const result = await this.collectionRepository.getCollectionsBySearch(
        keyword
      );
      res.json(result);
    } catch (error) {
      console.log(error);
    }
  };

  // 컬렉션에 영상 추가
  addVideoOnCollection = async (req, res) => {
    try {
      const user_id = "6312ad8b5057863778c220ca";
      const { collection_id } = req.params;
      const { videos } = req.body;

      console.log(videos);

      const thisCollection = await this.collectionRepository.getCollectionById(
        collection_id
      );

      if (!thisCollection) {
        res
          .status(400)
          .json({ success: false, message: "해당 컬렉션이 없습니다." });
      }
      else if (user_id !== thisCollection.user_id) {
        res
          .status(400)
          .json({ success: false, message: "작성자만 추가가 가능합니다." });
      }

      const resultCollection =
        await this.collectionRepository.addVideoOnCollection(
          collection_id,
          videos
        );

      console.log(resultCollection);
      res.json({
        success: true,
        message: "영상이 추가 되었습니다!",
        resultCollection,
      });
    } catch (error) {
      console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
      return res.status(400).json({
        errorMessage: "컬렉션 수정에 실패하였습니다.",
      });
    }
  };
}

module.exports = CollectionsService;
