const CollectionRepository = require("../c_repositories/collections.repository");
const UserRepository = require("../c_repositories/users.repository");
const CommentRepository = require("../c_repositories/comments.repository");
const VideoRepository = require("../c_repositories/videos.repository");
const { collection } = require("../d_schemas/user");

class CollectionsService {
  collectionRepository = new CollectionRepository();
  userRepository = new UserRepository();
  commentRepository = new CommentRepository();
  videoRepository = new VideoRepository();

  // 내가 모은 컬렉션 목록 조회 with Pagenation ↔
  getAllCollectionsByUserId = async (req, res) => {
    try {
      // const { user_id } = req.body;
      const user_id = process.env.TEMP_USER_ID;
      const { offset, limit } = req.query;

      const { userDataAll, totalContents, hasNext } =
        await this.collectionRepository.getAllCollectionsByUserIdWithPaging(
          user_id,
          offset,
          limit
        );

      if (!userDataAll) {
        res
          .status(400)
          .json({ success: false, message: "만들어진 컬렉션이 없습니다." });
      }

      const resultData = [];
      for (let i = 0; i < userDataAll.length; i++) {
        let collectionComments =
          await this.commentRepository.getAllCommentsOnCollectionId(
            userDataAll[i]._id
          );
        let commentNum = collectionComments.length;

        let thumbnailsArr = [];
        for (let j = 0; j < userDataAll[i].videos.length; j++) {
          try {
            var { thumbnails } = await this.videoRepository.getVideoById(
              userDataAll[i].videos[j]
            );
          } catch (error) {
            var thumbnails = undefined;
            console.log(error);
          }

          if (!thumbnails) {
            thumbnailsArr.push(
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRR3Mt8OJE2l6pY08_5MDa6bn9G1g0mTcbcCA&usqp=CAU"
            );
          } else {
            thumbnailsArr.push(thumbnails);
          }
        }

        resultData.push({
          _id: userDataAll[i]._id,
          user_id: userDataAll[i].user_id,
          collectionTitle: userDataAll[i].collectionTitle,
          description: userDataAll[i].description,
          videos: userDataAll[i].videos,
          thumbnails: thumbnailsArr,
          commentNum: commentNum,
          likes: userDataAll[i].likes,
          createdAt: userDataAll[i].createdAt,
        });
      }

      res.status(200).json({
        success: true,
        data: resultData,
        pageInfo: { totalContents, hasNext },
      });
    } catch (error) {
      console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
      res
        .status(400)
        .json({ success: false, message: "컬렉션 조회에 실패하였습니다." });
    }
  };

  // 카테고리에 포함된 컬렉션 목록 조회 ↔
  getAllCollectionsByCategoryId = async (req, res) => {
    try {
      const { category_id, offset, limit } = req.query;
      const { categoryDataAll, totalContents, hasNext } =
        await this.collectionRepository.getAllCollectionsByCategoryIdWithPaging(
          category_id,
          offset,
          limit
        );

      if (!categoryDataAll) {
        res
          .status(400)
          .json({ success: false, message: "만들어진 컬렉션이 없습니다." });
      }

      const resultData = [];

      for (let i = 0; i < categoryDataAll.length; i++) {
        let collectionComments =
          await this.commentRepository.getAllCommentsOnCollectionId(
            categoryDataAll[i]._id
          );
        let commentNum = collectionComments.length;

        resultData.push({
          _id: categoryDataAll[i]._id,
          category_id: categoryDataAll[i].category_id,
          collectionTitle: categoryDataAll[i].collectionTitle,
          description: categoryDataAll[i].description,
          videos: categoryDataAll[i].videos,
          commentNum: commentNum,
          likes: categoryDataAll[i].likes,
          createdAt: categoryDataAll[i].createdAt,
        });
      }
      res.status(200).json({
        success: true,
        data: resultData,
        pageInfo: { totalContents, hasNext },
      });
      return;
    } catch (error) {
      console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
      res
        .status(400)
        .json({ success: false, message: "컬렉션 조회에 실패하였습니다." });
    }
  };

  // 컬렉션 상세 조회
  getCollection = async (req, res) => {
    try {
      const { collection_id } = req.params;

      const collection = await this.collectionRepository.getCollectionById(
        collection_id
      );

      if (!collection) {
        res.json({ message: "해당 컬렉션이 없습니다." });
      }

      let collectionComments =
        await this.commentRepository.getAllCommentsOnCollectionId(
          collection._id
        );
      let commentNum = collectionComments.length;

      const returnCollection = [
        {
          _id: collection._id,
          user_id: collection.user_id,
          category_id: collection.category_id,
          collectionTitle: collection.collectionTitle,
          description: collection.description,
          videos: collection.videos,
          commentNum: commentNum,
          likes: collection.likes,
          createdAt: collection.createdAt,
        },
      ];
      res.status(200).json({ success: true, data: returnCollection });
    } catch (error) {
      console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
      res
        .status(400)
        .json({ success: false, message: "컬렉션 조회에 실패하였습니다." });
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
        data: returnCollection,
      });
    } catch (error) {
      console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
      res
        .status(400)
        .json({ success: false, message: "컬렉션 생성에 실패하였습니다." });
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
          .json({ success: false, message: "작성자만 삭제가 가능합니다." });
      } else {
        await this.collectionRepository.deleteCollection(collection_id);
        res
          .status(200)
          .json({ success: true, message: "컬렉션을 삭제하였습니다." });
      }
    } catch (error) {
      console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
      res
        .status(400)
        .json({ success: false, message: "컬렉션 삭제에 실패하였습니다." });
    }
  };

  // 컬렉션 좋아요 누르기
  likeCollection = async (req, res) => {
    try {
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
        res.status(200).json({
          success: true,
          message: "컬렉션에 좋아요를 등록하였습니다.",
        });
      } else {
        await this.collectionRepository.disLikeCollection(collection_id);
        await this.userRepository.disLikeCollection(user_id, collection_id);
        res.status(200).json({
          success: true,
          message: "컬렉션에 좋아요를 취소하였습니다.",
        });
      }
    } catch (error) {
      console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
      res.status(400).json({
        success: false,
        message: "컬렉션 좋아요/취소 기능에 실패하였습니다.",
      });
    }
  };

  // 검색어와 내용, 제목 일부 일치하는 컬렉션 찾기 ↔
  getCollectionsBySearch = async (req, res) => {
    try {
      const { keyword, offset, limit } = req.query;

      const { resultBySearch, totalContents, hasNext } =
        await this.collectionRepository.getCollectionsBySearchWithPaging(
          keyword,
          offset,
          limit
        );
        
      const resultData = [];

      for (let i = 0; i < resultBySearch.length; i++) {
        let collectionComments =
          await this.commentRepository.getAllCommentsOnCollectionId(
            resultBySearch[i]._id
          );

        let commentNum = collectionComments.length;

        resultData.push({
          _id: resultBySearch[i]._id,
          user_id: resultBySearch[i].user_id,
          category_id: resultBySearch[i].category_id,
          collectionTitle: resultBySearch[i].collectionTitle,
          description: resultBySearch[i].description,
          videos: resultBySearch[i].videos,
          commentNum: commentNum,
          likes: resultBySearch[i].likes,
          createdAt: resultBySearch[i].createdAt,
        });
      }

      res.status(200).json({
        success: true,
        data: resultData,
        pageInfo: { totalContents, hasNext },
      });
      return;
    } catch (error) {
      console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
      res.status(400).json({
        success: false,
        message: "검색에 실패하였습니다.",
      });
    }
  };

  // 컬렉션에 영상 추가
  addVideoOnCollection = async (req, res) => {
    try {
      const user_id = process.env.TEMP_USER_ID;
      const { collection_id } = req.params;
      const { videos } = req.body;

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
      } else {
        const resultCollection =
          await this.collectionRepository.addVideoOnCollection(
            collection_id,
            videos
          );

        res.status(201).json({
          success: true,
          message: "영상이 추가 되었습니다!",
          data: resultCollection,
        });
      }
    } catch (error) {
      console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
      res.status(400).json({
        success: false,
        message: "영상 추가에 실패하였습니다.",
      });
    }
  };
}

module.exports = CollectionsService;
