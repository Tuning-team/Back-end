const Collection = require("../d_schemas/collection");

class CollectionRepository {
  // user_id를 받아 작성된 모든 컬렉션 조회 (기본값 날짜 내림차순)
  getAllCollectionsByUserId = async (_id) => {
    const collections = await Collection.find({ user_id: _id }).sort({ createdAt: -1 });
    // let resultList = [];

    // for (const collection of collections) {
    //   resultList.push({
    //     user_id: collection._id,
    //     collectionTitle: collection.collectionTitle,
    //     description: collection.description,
    //     videos: collection.videos,
    //     likes: collection.likes,
    //     createdAt: collection.createdAt,
    //   });
    // }

    return collections;
  };

  // category_id를 받아 작성된 모든 컬렉션 조회 (기본값 날짜 내림차순)
  getAllCollectionsByCategoryId = async (_id) => {
    const collections = await Collection.find({ category_id: _id }).sort({ createdAt: -1 });

    return collections;
  };

  // 컬렉션 상세 조회
  getCollection = async (_id) => {
    const collection = await Collection.findOne({ _id });

    return collection;
  };


  // 새로운 컬렉션 작성
  createCollection = async (user_id, collectionTitle, description, videos) => {
    const collection = await Collection.create({
        user_id,
        collectionTitle,
        description,
        videos,
      });
      return collection;
    };

  // 컬렉션 수정
  updateCollection = async (collectionTitle, description, videos) => {
    const updateCollection = await Collection.updateOne(
        { _id }, { $set: { collectionTitle, description, videos } }
      );
      return updateCollection;
  };

  // 컬렉션 삭제
  deleteCollection = async (_id) => {
    const deleteCollection = await Collection.deleteOne(
        { _id }
      );
      return deleteCollection;
  };
}

module.exports = CollectionRepository;


