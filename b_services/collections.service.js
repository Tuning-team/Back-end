const e = require("express");
const CollectionRepository = require("../c_repositories/collections.repository");
const UserRepository = require("../c_repositories/users.repository");

class CollectionsService {
  collectionRepository = new CollectionRepository();
  userRepository = new UserRepository();

  // 내가 모은 컬렉션 목록 조회
  getAllCollectionsByUserId = async () => {
    const userdataAll =
      await this.collectionRepository.getAllCollectionsByUserId(user_id);

    const resultData = userdataAll.map((e) => {
      return {
        _id: e._id,
        user_id: e.user_id,
        collectionTitle: e.collectionTitle,
        description: e.description,
        videos: e.videos,
        likes: e.likes,
        createdAt: e.createdAt,
      };
    });
    return resultData; //  = [ { ... }, { ... }, { ... } ]
  };

  // 카테고리에 포함된 컬렉션 목록 조회
  getAllCollectionsByCategoryId = async () => {
    const categorydataAll =
      await this.collectionRepository.getAllCollectionsByCategoryId(category_id);

    const resultData = categorydataAll.map((e) => {
      return {
        _id: e._id,
        category_id: e.category_id,
        collectionTitle: e.collectionTitle,
        description: e.description,
        videos: e.videos,
        likes: e.likes,
        createdAt: e.createdAt,
      };
    });
    return resultData;
  };

  // 컬렉션 상세 조회
  getCollection = async () => {
    const thisCollection = await this.collectionRepository.getCollection(
      _id
    );
    if (!thisCollection) {
      return { message: "해당 컬렉션이 없습니다." };
    } else {
      return {
        _id: e._id,
        user_id: e.user_id,
        collectionTitle: e.collectionTitle,
        description: e.description,
        videos: e.videos,
        likes: e.likes,
        createdAt: e.createdAt,
      };
    }
  };

  // 컬렉션 생성
  createCollection = async (user_id, category_id, collectionTitle, description, videos) => {
    await this.collectionRepository.createCollection(
        user_id,
        category_id,
        collectionTitle,
        description,
        videos
    );
    return { success: true, message: "컬렉션을 생성하였습니다." }
  };

  // 컬렉션 삭제
  deleteCollection = async (user_id, _id) => {
    const thisCollection = await this.collectionRepository.getCollection(_id);

    if (thisCollection) {
        return { status: 400, message: "해당 컬렉션이 없습니다." }
    } else {
        await this.collectionRepository.deleteCollection(_id);
        return { status: 200, message: "컬렉션을 삭제하였습니다." };
    }
  }

  // 컬렉션 좋아요 누르기
  likeCollection = async (user_id, _id) => {
    const thisCollection = await this.collectionRepository.getCollection(_id);
  }
}
