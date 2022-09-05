const CollectionRepository = require("../c_repositories/collections.repository");
const UserRepository = require("../c_repositories/users.repository");
const CommentRepository = require("../c_repositories/comments.repository");
const { collection } = require("../d_schemas/user");

class CollectionsService {
  collectionRepository = new CollectionRepository();
  userRepository = new UserRepository();
  commentRepository = new CommentRepository();

  // 내가 모은 컬렉션 목록 조회
  getAllCollectionsByUserId = async (req, res) => {
    try {
      const user_id = process.env.TEMP_USER_ID;

      const userdataAll =
        await this.collectionRepository.getAllCollectionsByUserId(user_id);

      if (!userdataAll) {
        res.status(400).json({
          message: "만들어진 컬렉션이 없습니다.",
        });
      }

      const resultData = [];

      for (let i = 0; i < userdataAll.length; i++) {
        let collectionComments =
          await this.commentRepository.getAllCommentsOnCollectionId(
            userdataAll[i]._id
          );
        let commentNum = collectionComments.length;

        resultData.push({
          _id: userdataAll[i]._id,
          user_id: userdataAll[i].user_id,
          collectionTitle: userdataAll[i].collectionTitle,
          description: userdataAll[i].description,
          videos: userdataAll[i].videos,
          commentNum: commentNum,
          likes: userdataAll[i].likes,
          createdAt: userdataAll[i].createdAt,
        });
      }

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

      const resultData = [];

      for (let i = 0; i < categorydataAll.length; i++) {
        let collectionComments =
          await this.commentRepository.getAllCommentsOnCollectionId(
            categorydataAll[i]._id
          );
        let commentNum = collectionComments.length;

        resultData.push({
          _id: categorydataAll[i]._id,
          category_id: categorydataAll[i].category_id,
          collectionTitle: categorydataAll[i].collectionTitle,
          description: categorydataAll[i].description,
          videos: categorydataAll[i].videos,
          commentNum: commentNum,
          likes: categorydataAll[i].likes,
          createdAt: categorydataAll[i].createdAt,
        });
      }
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

      let collectionComments =
        await this.commentRepository.getAllCommentsOnCollectionId(
          thisCollection._id
        );
      let commentNum = collectionComments.length;

      const returnCollection = [
        {
          _id: thisCollection._id,
          user_id: thisCollection.user_id,
          category_id: thisCollection.category_id,
          collectionTitle: thisCollection.collectionTitle,
          description: thisCollection.description,
          videos: thisCollection.videos,
          commentNum: commentNum,
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
      const user_id = process.env.TEMP_USER_ID;

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
      const user_id = process.env.TEMP_USER_ID;

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
    const user_id = process.env.TEMP_USER_ID;

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
      } else if (user_id !== thisCollection.user_id) {
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
