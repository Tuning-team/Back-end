const Collection = require("../d_schemas/collection");
const User = require("../d_schemas/user");

class CollectionRepository {
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

    console.log("totalContents:", totalContents);
    console.log("hasNext:", hasNext);

    // offset : "0",1,2 / "3",4,5 /
    const userDataAll = await Collection.find({ user_id })
      .sort({
        createdAt: -1,
      })
      .skip(offset) // 검색 시 포함하지 않을 데이터 수
      .limit(limit);

    return { userDataAll, totalContents, hasNext };
  };

  // category_id를 받아 작성된 모든 컬렉션 조회 (기본값 날짜 내림차순)
  getAllCollectionsByCategoryId = async (category_id) => {
    const collections = await Collection.find({ category_id }).sort({
      createdAt: -1,
    });

    return collections;
  };

  // category_id를 받아 작성된 모든 컬렉션 조회 (페이지네이션 필요한 경우)
  getAllCollectionsByCategoryIdWithPaging = async (
    category_id,
    offset,
    limit
  ) => {
    const callForCount = await Collection.find({ category_id }).sort({
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
    console.log("_id", _id);

    const collection = await Collection.findOne({ _id });
    console.log("collection", collection);
    return collection;
  };

  // 전달된 내용으로 새로운 컬렉션 생성. returns 작성한 컬렉션 정보
  createCollection = async (
    user_id,
    category_id,
    collectionTitle,
    description,
    videos,
    likes,
    createdAt
  ) => {
    const collection = await Collection.create({
      user_id,
      category_id,
      collectionTitle,
      description,
      videos,
      likes,
      createdAt,
    });
    return collection;
  };

  // _id에 해당하는 컬렉션에 영상 추가. returns 영상 추가된 컬렉션 정보
  addVideoOnCollection = async (_id, addedVideos) => {
    let { videos } = await this.getCollectionById(_id);
    videos = [...videos, ...addedVideos];
    console.log("videos:", videos);

    await Collection.findOneAndUpdate({ _id }, { $set: { videos } });
    const updatedCollection = await Collection.findOne({ _id });

    return updatedCollection;
  };

  // _id에 해당하는 컬렉션 삭제. returns 삭제한 컬렉션 정보
  deleteCollection = async (_id) => {
    const deleteCollection = await Collection.deleteOne({ _id: _id });
    return deleteCollection;
  };

  // 유저가 보유한 좋아요 리스트
  getCollectionsByLikedArray = async (likeCollectionsArr) => {
    const allCollectionsUserLiked = await User.find({ likeCollectionsArr });
    return allCollectionsUserLiked;
  };

  // 해당 컬렉션이 보유한 좋아요 리스트
  getAllLikeOnCollectionId = async (collection_id) => {
    const likes = await Collection.find({ collection_id });

    return likes;
  };

  // _id에 해당하는 컬렉션의 좋아요를 1개 올린다. return 좋아한 컬렉션의 현재 좋아요 수
  likeCollection = async (_id) => {
    const likeCollection = await Collection.findOneAndUpdate(
      { _id },
      { $inc: { likes: +1 } }
    );

    return likeCollection.likes;
  };

  // _id에 해당하는 컬렉션의 좋아요를 1개 내린다. returns 좋아요 취소한 컬렉션의 현재 좋아요 수
  disLikeCollection = async (_id) => {
    const disLikeCollection = await Collection.findOneAndUpdate(
      { _id },
      { $inc: { likes: -1 } }
    );
    return disLikeCollection.likes;
  };

  // 검색어에 맞는 컬렉션 리스트
  getCollectionsBySearch = async (keyword) => {
    const searchCollections = await Collection.find({
      $or: [
        { collectionTitle: new RegExp(keyword, "i") },
        { description: new RegExp(keyword, "i") },
      ],
    });

    console.log(searchCollections);
    return searchCollections;
  };

  // 검색어에 맞는 컬렉션 리스트 (페이지네이션 필요한 경우)
  getCollectionsBySearchWithPaging = async (keyword, offset, limit) => {
    const resultBySearch = await Collection.find({
      $or: [
        { collectionTitle: new RegExp(keyword, "i") },
        { description: new RegExp(keyword, "i") },
      ],
    })
      .sort({
        createdAt: -1,
      })
      .skip(offset) // 검색 시 포함하지 않을 데이터 수
      .limit(limit);

    const totalContents = resultBySearch.length;
    const hasNext = totalContents - offset - limit > 0 ? true : false;

    return { resultBySearch, totalContents, hasNext };
  };

  // 페이지네이션
  // getPagination = async () => {
  //   const page = Number(req.query.page || 1); // 값이 없다면 기본값으로 1 사용
  //   const perPage = Number(req.query.perPage || 3);

  //   const allCollections = await Collection.find({})
  //     .sort({ createdAt: -1 }) // createdAt는 timestamps로 생성한 시간을 역순으로 정렬 === 데이터를 최근 순으로 정렬
  //     .skip(perPage * (page - 1)) // 아래 설명 보기
  //     .limit(perPage);
  //   const totalPage = Math.ceil(total / perPage); // 만약 전체 게시글 99개고 perPage가 10개면 값은 9.9 그래서 총 페이지수는 10개가 되어야 한다. 그래서 올림을 해준다.
  // };
}

module.exports = CollectionRepository;
