const CollectionRepository = require("../c_repositories/collections.repository");
const UserRepository = require("../c_repositories/users.repository");
const CommentRepository = require("../c_repositories/comments.repository");
const VideoRepository = require("../c_repositories/videos.repository");
const CategoryRepository = require("../c_repositories/categories.repository");

const { collection } = require("../d_schemas/user");
const axios = require("axios");
const { Collection } = require("mongoose");

class CollectionsService {
  categoryRepository = new CategoryRepository();
  collectionRepository = new CollectionRepository();
  userRepository = new UserRepository();
  commentRepository = new CommentRepository();
  videoRepository = new VideoRepository();

  // 내가 모은 컬렉션 목록 조회 with Pagenation ↔
  getAllCollectionsByUserId = async (req, res) => {
    try {
      const user_id = res.locals.user_id;
      console.log("use_id", user_id);

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

        return;
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
              userDataAll[i].videos[j] // video_id
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
          category_id: userDataAll[i].category_id[0],
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

      const categories = await this.categoryRepository.getAllCategories(
        category_id
      );
      const category_title = categories[0].categoryName;

      const resultData = [];

      for (let i = 0; i < categoryDataAll.length; i++) {
        let collectionComments =
          await this.commentRepository.getAllCommentsOnCollectionId(
            categoryDataAll[i]._id
          );
        let commentNum = collectionComments.length;

        let thumbnailsArr = [];
        for (let j = 0; j < categoryDataAll[i].videos.length; j++) {
          try {
            var { thumbnails } = await this.videoRepository.getVideoById(
              categoryDataAll[i].videos[j]
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
          _id: categoryDataAll[i]._id,
          category_id: categoryDataAll[i].category_id[0],
          category_title,
          collectionTitle: categoryDataAll[i].collectionTitle,
          description: categoryDataAll[i].description,
          videos: categoryDataAll[i].videos,
          thumbnails: thumbnailsArr,
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

      let collection = await this.collectionRepository.getCollectionById(
        collection_id
      );

      if (!collection) {
        res
          .status(400)
          .json({ success: false, message: "컬렉션을 찾을 수 없습니다." });
      }

      let collectionComments =
        await this.commentRepository.getAllCommentsOnCollectionId(
          collection_id
        );

      console.log("collection", collection);

      let commentNum = collectionComments.length;
      let thumbnailsArr = await Promise.all(
        collection.videos.map(async (id) => {
          var { thumbnails } = await this.videoRepository.getVideoById(id);

          if (!thumbnails) {
            return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRR3Mt8OJE2l6pY08_5MDa6bn9G1g0mTcbcCA&usqp=CAU";
          } else {
            return thumbnails; // ["http:~~~ img",""]
          }
        })
      );

      const writerInfo = await this.userRepository.getUserById(
        collection.user_id
      );

      const returnCollection = [
        {
          _id: collection._id,
          user_id: collection.user_id,
          writerName: writerInfo.displayName,
          category_id: collection.category_id,
          collectionTitle: collection.collectionTitle,
          description: collection.description,
          videos: collection.videos,
          thumbnails: thumbnailsArr,
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
      const user_id = res.locals.user_id;
      // const user_id = process.env.TEMP_USER_ID;

      let {
        category_id, //
        collectionTitle,
        description,
        videos, // videoId (유튜브)
      } = req.body;

      const createdVideos = await this.videoRepository.createVideosByIds(
        videos
      );

      category_id = [category_id];

      const video_ids = Array.from(
        new Set(createdVideos.map((e) => e._id.toString()))
      );

      const returnCollection = await this.collectionRepository.createCollection(
        user_id,
        category_id,
        collectionTitle,
        description,
        video_ids // ["",""]
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

  // 컬렉션 수정
  editCollection = async (req, res) => {
    try {
      const user_id = res.local.user_id;
      // const user_id = process.env.TEMP_USER_ID;
      const { collection_id } = req.params;
      let { category_id, collectionTitle, description, videos } = req.body;

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
          .json({ success: false, message: "작성자만 수정이 가능합니다." });
      }

      const createdVideos = await this.videoRepository.createVideosByIds(
        videos
      );

      category_id = [category_id];

      const video_ids = Array.from(
        new Set(createdVideos.map((e) => e._id.toString()))
      );

      const returnCollection = await this.collectionRepository.editCollection(
        user_id,
        category_id,
        collectionTitle,
        description,
        video_ids,
        collection_id
      );

      res.status(200).json({
        success: true,
        message: "컬렉션을 수정하였습니다.",
        data: returnCollection,
      });
    } catch (error) {
      console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
      res
        .status(400)
        .json({ success: false, message: "컬렉션 수정에 실패하였습니다." });
    }
  };

  // 컬렉션 삭제
  deleteCollection = async (req, res) => {
    try {
      const user_id = res.locals.user_id;
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
      const user_id = res.locals.user_id;

      // DB에서 현재 컬렉션의 정보와 유저가 지금까지 좋아한 Array 획득
      const thisCollection = await this.collectionRepository.getCollectionById(
        collection_id
      );

      const { myLikingCollections } = await this.userRepository.getUserById(
        user_id
      );

      if (!thisCollection) {
        res
          .status(400)
          .json({ success: false, message: "해당 컬렉션이 없습니다." });
      } else if (!myLikingCollections.includes(collection_id)) {
        await this.collectionRepository.likeCollection(collection_id);
        await this.userRepository.likeCollection(user_id, collection_id);
        res.status(200).json({
          success: true,
          data: "like",
          message: "컬렉션에 좋아요를 등록하였습니다.",
        });
      } else {
        await this.collectionRepository.disLikeCollection(collection_id);
        await this.userRepository.disLikeCollection(user_id, collection_id);
        res.status(200).json({
          success: true,
          data: "dislike",
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
        let thumbnailsArr = await Promise.all(
          resultBySearch[i].videos.map(async (e) => {
            var { thumbnails } = await this.videoRepository.getVideoById(e);
            if (!thumbnails) {
              return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRR3Mt8OJE2l6pY08_5MDa6bn9G1g0mTcbcCA&usqp=CAU";
            } else {
              return thumbnails; // "http:~~~ img"
            }
          })
        );

        resultData.push({
          _id: resultBySearch[i]._id,
          user_id: resultBySearch[i].user_id,
          category_id: resultBySearch[i].category_id[0],
          collectionTitle: resultBySearch[i].collectionTitle,
          description: resultBySearch[i].description,
          videos: resultBySearch[i].videos,
          thumbnails: thumbnailsArr,
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
      const user_id = res.locals.user_id;
      const { collection_id } = req.params;
      const { videos } = req.body; //

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
            videos //
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

  /// ------

  // 컬렉션 좋아요 내림차순 10개까지 조회 ("인기 있는" 카테고리)
  getLikeTop10 = async () => {
    try {
      // 기존에 6319aeebd1e330e86bbade9f 가지고 있던 컬렉션들에서 카테고리 제거 (filter)
      await this.collectionRepository.getLidOfCategory(
        "6319aeebd1e330e86bbade9f"
      );

      // 새로 "인기있는" 컬렉션들을 추려서, 6319aeebd1e330e86bbade9f 카테고리를 부여 (push)

      const newPopularCollections =
        await this.collectionRepository.giveCategoryIdOnLikeTop10();

      return {
        success: true,
        message: `${newPopularCollections.length}개의 컬렉션이 인기있는 카테고리가 되었습니다.`,
        data: newPopularCollections,
      };
    } catch (error) {
      console.log(error);
      return { success: false, message: "컬렉션 조회에 실패하였습니다." };
    }
  };

  // 가장 최근에 만들어진 컬렉션 10개에 카테고리 아이디 부여 (631e7d7a4ae4c133c405a964)
  getLatestTop10 = async () => {
    try {
      // 기존에 631e7d7a4ae4c133c405a964 가지고 있던 컬렉션들에서 카테고리 제거 (filter)
      await this.collectionRepository.getLidOfCategory(
        "631e7d7a4ae4c133c405a964"
      );

      // 새로 "최신" 컬렉션들을 추려서, 631e7d7a4ae4c133c405a964 카테고리를 부여 (push)

      const newLatestCollections =
        await this.collectionRepository.giveCategoryIdOnLatestTop10();

      return {
        success: true,
        message: `${newLatestCollections.length}개의 컬렉션이 최신 카테고리가 되었습니다.`,
        data: newLatestCollections,
      };
    } catch (error) {
      console.log(error);
      return { success: false, message: "컬렉션 조회에 실패하였습니다." };
    }
  };

  // "시간대별 추천" 컬렉션들 10개에 카테고리 아이디 부여 (631e7d7a4ae4c133c405a966)
  getTimeRecommend10 = async () => {
    try {
      // 기존에 631e7d7a4ae4c133c405a966 가지고 있던 컬렉션들에서 카테고리 제거 (filter)
      await this.collectionRepository.getLidOfCategory(
        "631e7d7a4ae4c133c405a966"
      );

      // 새로 "시간대별 추천" 컬렉션들을 추려서, 631e7d7a4ae4c133c405a966 카테고리를 부여 (push)

      const recommendCollections =
        await this.collectionRepository.giveCategoryIdOnTimeRecommendation();

      return {
        success: true,
        message: `${recommendCollections.length}개의 컬렉션이 지금 추천할 카테고리가 되었습니다.`,
        data: recommendCollections,
      };
    } catch (error) {
      console.log(error);
      return { success: false, message: "컬렉션 조회에 실패하였습니다." };
    }
  };

  // "날씨별 추천" 컬렉션들 10개에 카테고리 아이디 부여 (631e7d7a4ae4c133c405a965)
  getWeatherRecommend10 = async () => {
    const weatherApi = await axios.get(
      "https://goweather.herokuapp.com/weather/seoul"
    );
    // console.log(description.split(" ")[description.split(" ").length - 1]);
    const string = weatherApi.data.description;
    const weather = string.split(" ")[string.split(" ").length - 1];
    console.log("string", string, "weather", weather);

    try {
      // 기존에 631e7d7a4ae4c133c405a965 가지고 있던 컬렉션들에서 카테고리 제거 (filter)
      await this.collectionRepository.getLidOfCategory(
        "631e7d7a4ae4c133c405a965"
      );

      // 새로 "날씨별 추천" 컬렉션들을 추려서, 631e7d7a4ae4c133c405a965 카테고리를 부여 (push)

      const recommendCollections =
        await this.collectionRepository.giveCategoryIdOnWeatherRecommendation(
          weather
        );

      let collectionName = "";
      if (weather.toLowerCase() === "rain") {
        collectionName = "오늘처럼 비오는 날 보기 좋은";
      } else if (weather.toLowerCase() === "cloudy") {
        collectionName = "오늘처럼 흐린 날 보기 좋은";
      } else if (weather.toLowerCase() === "sunny") {
        collectionName = "오늘처럼 맑은 날 보기 좋은";
      } else {
        collectionName = "오늘같은 날 보기 좋은";
      }

      await this.categoryRepository.updateCategory(
        "631e7d7a4ae4c133c405a965",
        collectionName
      );

      return {
        success: true,
        message: `${recommendCollections.length}개의 컬렉션이 ${weather} 날씨에 추천할 카테고리가 되었습니다.`,
        data: recommendCollections,
      };
    } catch (error) {
      console.log(error);
      return { success: false, message: "컬렉션 조회에 실패하였습니다." };
    }
  };

  giveTodaysPopularCategories = async (req, res) => {
    const result_1 = await this.getLikeTop10();
    const result_2 = await this.getLatestTop10();
    const result_3 = await this.getTimeRecommend10();
    const result_4 = await this.getWeatherRecommend10();
    res.status(200).json({
      top10: result_1,
      latest10: result_2,
      timeRecommend: result_3,
      weatherRecommend: result_4,
    });

    setInterval(async () => {
      await this.getLikeTop10();
      await this.getLatestTop10();
      await this.getTimeRecommend10();
      await this.getWeatherRecommend10();
      console.log("메인화면 추천리스트 재설정 ---- !");
    }, 1000 * 60 * 60); // 1h;
  };
}

module.exports = CollectionsService;
