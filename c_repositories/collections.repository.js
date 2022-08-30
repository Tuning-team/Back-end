const Collection = require("../d_schemas/collection");

class CollectionRepository {
  // user_id를 받아 작성된 모든 컬렉션 조회 (기본값 날짜 내림차순)
  getAllCollectionsByUserId = async (_id) => {
    const collections = await Collection.find({ user_id: _id }).sort({
      createdAt: -1,
    });

    return collections;
  };

  // category_id를 받아 작성된 모든 컬렉션 조회 (기본값 날짜 내림차순)
  getAllCollectionsByCategoryId = async (_id) => {
    const collections = await Collection.find({ category_id: _id }).sort({
      createdAt: -1,
    });

    return collections;
  };

  // 작성된 컬렉션 상세 조회
  getCollection = async (_id) => {
    const collection = await Collection.findOne({ _id });

    return collection;
  };

  // 전달된 내용으로 새로운 컬렉션 작성. returns 작성한 컬렉션 정보
  createCollection = async (
    user_id,
    category_id,
    collectionTitle,
    description,
    videos
  ) => {
    const collection = await Collection.create({
      user_id,
      category_id,
      collectionTitle,
      description,
      videos,
    });
    return collection;
  };

  // _id에 해당하는 컬렉션 수정하여 저장. return 수정한 게시글정보
  updateCollection = async (collectionTitle, description, videos) => {
    const updateCollection = await Collection.updateOne(
      { _id },
      { $set: { collectionTitle, description, videos } }
    );
    return updateCollection;
  };

  // _id에 해당하는 컬렉션 삭제. returns 삭제한 컬렉션 정보
  deleteCollection = async (_id) => {
    const deleteCollection = await Collection.deleteOne({ _id });
    return deleteCollection;
  };

  // _id에 해당하는 컬렉션의 좋아요를 1개 올린다. return 좋아한 컬렉션의 현재 좋아요 수
  likeCollection = async (_id) => {
    const likeCollection = await Collection.findOneAndUpdate(
      { _id },
      { $set: { likes: +1 } }
    );
    return likeCollection.likes;
  };

  // _id에 해당하는 컬렉션의 좋아요를 1개 내린다. returns 좋아요 취소한 컬렉션의 현재 좋아요 수
  disLikeCollection = async (_id) => {
    const disLikeCollection = await Collection.findOneAndUpdate(
      { _id },
      { $set: { likes: -1 } }
    );
    return disLikeCollection.likes;
  };
}

module.exports = CollectionRepository;
