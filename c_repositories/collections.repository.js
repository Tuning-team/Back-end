const Collection = require("../d_schemas/collection");
const User = require("../d_schemas/user");
const VideoRepository = require("./videos.repository.js");

class CollectionRepository {
  videoRepository = new VideoRepository();
  // 모든 컬렉션 조회 (기본값 날짜 내림차순)
  getAllCollections = async () => {
    const collections = await Collection.find({}).sort({
      createdAt: -1,
    });

    return collections;
  };

  // user_id를 받아 작성된 모든 컬렉션 조회 (기본값 날짜 내림차순)
  getAllCollectionsByUserId = async (user_id) => {
    const collections = await Collection.find({ user_id }).sort({
      createdAt: -1,
    });

    return collections;
  };

  // user_id를 받아 작성된 모든 컬렉션 조회 (페이지네이션 필요한 경우)
  getAllCollectionsByUserIdWithPaging = async (user_id, offset, limit) => {
    const callForCount = await Collection.find({ user_id }).sort({
      createdAt: -1,
    });

    const totalContents = callForCount.length;
    const hasNext = totalContents - offset - limit > 0 ? true : false;

    // offset : "0",1,2 / "3",4,5 /
    const userDataAll = await Collection.find({ user_id })
      .sort({
        createdAt: -1,
      })
      .skip(offset) // 검색 시 포함하지 않을 데이터 수
      .limit(limit);

    return { userDataAll, totalContents, hasNext };
  };

  // user_id를 받아 유저가 좋아한 모든 컬렉션 조회 (페이지네이션 필요한 경우)
  getAllCollectionsUserLikesWithPaging = async (_id, offset, limit) => {
    const { myLikingCollections } = await User.findOne({ _id });

    const callForCount = await Collection.find({ _id: myLikingCollections }).sort({
      createdAt: -1,
    });

    const totalContents = callForCount.length;
    const hasNext = totalContents - offset - limit > 0 ? true : false;

    // offset : "0",1,2 / "3",4,5 /
    const userDataAll = await Collection.find({ _id: myLikingCollections })
      .sort({
        createdAt: -1,
      })
      .skip(offset) // 검색 시 포함하지 않을 데이터 수
      .limit(limit);

    return { userDataAll, totalContents, hasNext };
  };
  // user_id를 받아 유저가 담은 모든 컬렉션 조회 (페이지네이션 필요한 경우)
  getAllCollectionsUserKeepsWithPaging = async (_id, offset, limit) => {
    const { myKeepingCollections } = await User.findOne({ _id });

    const callForCount = await Collection.find({ _id: myKeepingCollections }).sort({
      createdAt: -1,
    });

    const totalContents = callForCount.length;
    const hasNext = totalContents - offset - limit > 0 ? true : false;

    // offset : "0",1,2 / "3",4,5 /
    const userDataAll = await Collection.find({ _id: myKeepingCollections })
      .sort({
        createdAt: -1,
      })
      .skip(offset) // 검색 시 포함하지 않을 데이터 수
      .limit(limit);

    return { userDataAll, totalContents, hasNext };
  };

  // category_id를 받아 작성된 모든 컬렉션 조회 (기본값 날짜 내림차순)
  getAllCollectionsByCategoryId = async (category_id) => {
    console.log("collectionRep:category_id", category_id);
    const collections = await Collection.find({ category_id }).sort({
      createdAt: -1,
    });

    return collections;
  };

  // category_id를 받아 작성된 모든 컬렉션 조회 (페이지네이션 필요한 경우)
  getAllCollectionsByCategoryIdWithPaging = async (
    category_id, //
    offset,
    limit
  ) => {
    const callForCount = await Collection.find({
      category_id: category_id,
    }).sort({
      createdAt: -1,
    });

    const totalContents = callForCount.length;
    const hasNext = totalContents - offset - limit > 0 ? true : false;

    const categoryDataAll = await Collection.find({ category_id })
      .sort({
        createdAt: -1,
      })
      .skip(offset) // 검색 시 포함하지 않을 데이터 수
      .limit(limit);

    return { categoryDataAll, totalContents, hasNext };
  };

  // 작성된 컬렉션 상세 조회
  getCollectionById = async (_id) => {
    const collection = await Collection.findOne({ _id });
    return collection;
  };

  // 작성된 컬렉션 상세 조회, 페이지네이션 사용
  getVideosByCollectionIdWithPaging = async (_id, offset, limit) => {
    const { videos } = await Collection.findOne({ _id });

    const totalVideosView = videos.length;
    const hasNext = totalVideosView - offset - limit > 0 ? true : false;

    const videosIdToShow = videos.slice(
      Number(offset), // 4
      Number(offset) + Number(limit) // 4 + 4 = 8
    );

    return { videosIdToShow, totalVideosView, hasNext };
  };

  // 전달된 내용으로 새로운 컬렉션 생성. returns 작성한 컬렉션 정보
  createCollection = async (user_id, category_id, collectionTitle, description, videos) => {
    let ytVideos = [];
    for (let i = 0; i < videos.length; i++) {
      const { videoId } = await this.videoRepository.getVideoById(videos[i]);
      ytVideos.push(videoId);
    }

    const collection = await Collection.create({
      user_id,
      category_id,
      collectionTitle,
      description,
      videos,
      ytVideos,
    });
    return collection;
  };

  // _id에 해당하는 컬렉션에 영상 추가. returns 영상 추가된 컬렉션 정보
  addVideoOnCollection = async (_id, addedVideos) => {
    let { videos } = await this.getCollectionById(_id);
    videos = [...videos, ...addedVideos];

    await Collection.findOneAndUpdate({ _id }, { $set: { videos } });
    const updatedCollection = await Collection.findOne({ _id });

    return updatedCollection;
  };

  removeVideoFromCollection = async (_id, filteredArr) => {
    await Collection.findOneAndUpdate({ _id }, { $set: { videos: filteredArr } });
    const updatedCollection = await Collection.findOne({ _id });

    return updatedCollection;
  };

  // _id에 해당하는 컬렉션 수정. return 수정된 컬렉션 정보
  editCollection = async (user_id, category_id, collectionTitle, description, videos, _id) => {
    console.log("_id, videos", _id, videos);

    let ytVideos = [];
    for (let i = 0; i < videos.length; i++) {
      const { videoId } = await this.videoRepository.getVideoById(videos[i]);
      ytVideos.push(videoId);
    }

    const editCollection = await Collection.updateOne(
      { _id: _id },
      { $set: { user_id, category_id, collectionTitle, description, videos, ytVideos } }
    );
    return editCollection;
  };

  // _id에 해당하는 컬렉션 삭제. returns 삭제한 컬렉션 정보
  deleteCollection = async (_id) => {
    const deleteCollection = await Collection.deleteOne({ _id: _id });
    return deleteCollection;
  };

  // 유저가 보유한 담기 리스트
  getCollectionsByKeptArray = async (myKeepingCollections) => {
    const allCollectionsUserKept = await User.find({ myKeepingCollections });
    return allCollectionsUserKept;
  };

  // 해당 컬렉션이 보유한 담기 리스트
  getAllkeepOnCollectionId = async (collection_id) => {
    const keptBy = await Collection.find({ collection_id });
    return keptBy;
  };

  // _id에 해당하는 컬렉션의 담은 유저를 추가한다.
  keepCollection = async (_id, user_id) => {
    const { keptBy } = await Collection({ _id });
    keptBy.push(user_id);

    const updatedCollection = await Collection.updateOne({ _id }, { keptBy: keptBy });
    return updatedCollection;
  };

  // _id에 해당하는 컬렉션의 담은 유저를 제거한다.
  notKeepCollection = async (_id, user_id) => {
    const { keptBy } = await Collection({ _id });
    const filteredArr = keptBy.filter((e) => e !== user_id);

    const updatedCollection = await Collection.updateOne({ _id }, { keptBy: filteredArr });
    return updatedCollection;
  };

  // 유저가 보유한 좋아요 리스트
  getCollectionsByLikedArray = async (myLikingCollections) => {
    const allCollectionsUserLiked = await User.find({ myLikingCollections });
    return allCollectionsUserLiked;
  };

  // 해당 컬렉션이 보유한 좋아요 리스트
  getAllLikeOnCollectionId = async (collection_id) => {
    const likes = await Collection.find({ collection_id });

    return likes;
  };

  // _id에 해당하는 컬렉션의 좋아요를 1개 올린다. return 좋아한 컬렉션의 현재 좋아요 수
  likeCollection = async (_id) => {
    const likeCollection = await Collection.findOneAndUpdate({ _id }, { $inc: { likes: +1 } });

    return likeCollection.likes;
  };

  // _id에 해당하는 컬렉션의 좋아요를 1개 내린다. returns 좋아요 취소한 컬렉션의 현재 좋아요 수
  disLikeCollection = async (_id) => {
    const disLikeCollection = await Collection.findOneAndUpdate({ _id }, { $inc: { likes: -1 } });
    return disLikeCollection.likes;
  };

  // 검색어에 맞는 컬렉션 리스트
  getCollectionsBySearch = async (keyword) => {
    const searchCollections = await Collection.find({
      $or: [{ collectionTitle: new RegExp(keyword, "i") }, { description: new RegExp(keyword, "i") }],
    });

    return searchCollections;
  };

  // 검색어에 맞는 컬렉션 리스트 (페이지네이션 필요한 경우)
  getCollectionsBySearchWithPaging = async (keyword, offset, limit) => {
    const resultForCount = await Collection.find({
      $or: [{ collectionTitle: new RegExp(keyword, "i") }, { description: new RegExp(keyword, "i") }],
    });

    const resultBySearch = await Collection.find({
      $or: [{ collectionTitle: new RegExp(keyword, "i") }, { description: new RegExp(keyword, "i") }],
    })
      .sort({
        createdAt: -1,
      })
      .skip(offset) // 검색 시 포함하지 않을 데이터 수
      .limit(limit);

    const totalContents = resultForCount.length;
    const hasNext = totalContents - offset - limit > 0 ? true : false;

    return { resultBySearch, totalContents, hasNext };
  };

  // 컬렉션 좋아요 Top 10개에 카테고리 6319aeebd1e330e86bbade9f 부여
  giveCategoryIdOnLikeTop10 = async () => {
    const likeTopCollections = await Collection.find({})
      .sort({
        likes: -1,
      }) // 검색 시 포함하지 않을 데이터 수
      .limit(10);

    const resultData = [];
    for (let i = 0; i < likeTopCollections.length; i++) {
      const pushedCollections = [...likeTopCollections[i].category_id, "6319aeebd1e330e86bbade9f"];

      const result = await Collection.findOneAndUpdate(
        { _id: likeTopCollections[i]._id },
        { $set: { category_id: pushedCollections } }
      );

      resultData.push(likeTopCollections[i]._id);
    }

    return resultData;
  };

  // 가장 최근 만들어진 10개에 카테고리 631e7d7a4ae4c133c405a964 부여
  giveCategoryIdOnLatestTop10 = async () => {
    const latestTopCollections = await Collection.find({})
      .sort({
        createdAt: -1,
      }) // 검색 시 포함하지 않을 데이터 수
      .limit(10);

    const resultData = [];
    for (let i = 0; i < latestTopCollections.length; i++) {
      const pushedCollections = [...latestTopCollections[i].category_id, "631e7d7a4ae4c133c405a964"];

      const result = await Collection.findOneAndUpdate(
        { _id: latestTopCollections[i]._id },
        { $set: { category_id: pushedCollections } }
      );

      resultData.push(latestTopCollections[i]._id);
    }

    return resultData;
  };

  // 지금 시간대에 추천할만한 컬렉션 10개에 631e7d7a4ae4c133c405a966 부여
  giveCategoryIdOnTimeRecommendation = async () => {
    const date = new Date();
    let hour = date.getHours();

    let categoriesToRecommmend = [];

    if (hour < 18) {
      categoriesToRecommmend = [
        "6319aeebd1e330e86bbade7a",
        "6319aeebd1e330e86bbade7d",
        "6319aeebd1e330e86bbade80",
        "6319aeebd1e330e86bbade83",
        "6319aeebd1e330e86bbade86",
        "6319aeebd1e330e86bbade95",
        "6319aeebd1e330e86bbade9e",
        "6319aeebd1e330e86bbadea4",
      ];
      //신나는음악, 자기계발, 뉴스,동물
    } else {
      categoriesToRecommmend = [
        "6319aeebd1e330e86bbade7b",
        "6319aeebd1e330e86bbade88",
        "6319aeebd1e330e86bbade96",
        "6319aeebd1e330e86bbade9d",
        "6319aeebd1e330e86bbadea1",
        "6319aeebd1e330e86bbadea3",
      ];
      //요리, 게임,자연 ,일상여행,운동
    }

    const collectionsToRecommend = await Collection.find({
      category_id: { $elemMatch: { $in: categoriesToRecommmend } },
    })
      .sort({
        createdAt: -1,
      })
      .limit(10);

    const resultData = [];
    for (let i = 0; i < collectionsToRecommend.length; i++) {
      const pushedCollections = [...collectionsToRecommend[i].category_id, "631e7d7a4ae4c133c405a966"];

      await Collection.findOneAndUpdate({ _id: collectionsToRecommend[i]._id }, { $set: { category_id: pushedCollections } });

      resultData.push(collectionsToRecommend[i]._id);
    }

    return resultData;
  };

  // 지금 시간대에 추천할만한 컬렉션 10개에 631e7d7a4ae4c133c405a966 부여
  giveCategoryIdOnWeatherRecommendation = async (weather) => {
    let categoriesToRecommmend = [];

    if (weather.toLowerCase() === "rain") {
      categoriesToRecommmend = [
        "6319aeebd1e330e86bbade7b",
        "6319aeebd1e330e86bbade80",
        "6319aeebd1e330e86bbade83",
        "6319aeebd1e330e86bbade88",
        "6319aeebd1e330e86bbade9e",
      ];
    } else if (weather.toLowerCase() === "cloudy") {
      categoriesToRecommmend = [
        "6319aeebd1e330e86bbade7d",
        "6319aeebd1e330e86bbade8a",
        "6319aeebd1e330e86bbade8e",
        "6319aeebd1e330e86bbade97",
        "6319aeebd1e330e86bbade98",
        "6319aeebd1e330e86bbade9d",
      ];
    } else if (weather.toLowerCase() === "sunny") {
      categoriesToRecommmend = [
        "6319aeebd1e330e86bbade8b",
        "6319aeebd1e330e86bbade93",
        "6319aeebd1e330e86bbade95",
        "6319aeebd1e330e86bbade96",
        "6319aeebd1e330e86bbadea5",
      ];
    } else {
      categoriesToRecommmend = [
        "6319aeebd1e330e86bbade7a",
        "6319aeebd1e330e86bbade7c",
        "6319aeebd1e330e86bbade83",
        "6319aeebd1e330e86bbade84",
        "6319aeebd1e330e86bbadea3",
      ];
    }

    const collectionsToRecommend = await Collection.find({
      category_id: { $elemMatch: { $in: categoriesToRecommmend } },
    })
      .sort({
        likes: -1,
      })
      .limit(10);

    const resultData = [];
    for (let i = 0; i < collectionsToRecommend.length; i++) {
      const pushedCollections = [...collectionsToRecommend[i].category_id, "631e7d7a4ae4c133c405a965"];

      await Collection.findOneAndUpdate(
        { _id: collectionsToRecommend[i]._id },
        {
          $set: {
            category_id: pushedCollections,
          },
        }
      );

      resultData.push(collectionsToRecommend[i]._id);
    }

    return resultData;
  };

  // 재사용 가능한 코드
  getLidOfCategory = async (category_id) => {
    const collections = await Collection.find({ category_id });
    // collections = [ {},{},{},{},{} .. ]

    for (let i = 0; i < collections.length; i++) {
      const filteredCategories = collections[i].category_id.filter((e) => e !== category_id);

      const result = await Collection.findOneAndUpdate(
        { _id: collections[i]._id },
        { $set: { category_id: filteredCategories } }
      );
    }
  };
}

module.exports = CollectionRepository;
