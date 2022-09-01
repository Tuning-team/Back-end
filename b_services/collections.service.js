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
      await this.collectionRepository.getAllCollectionsByCategoryId(
        category_id
      );

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
    const thisCollection = await this.collectionRepository.getCollection(_id);
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
  createCollection = async (req, res) => {
    const { user_id, category_id, collectionTitle, description, videos } =
      req.body;
    await this.collectionRepository.createCollection(
      user_id,
      category_id,
      collectionTitle,
      description,
      videos
    );
    return { success: true, message: "컬렉션을 생성하였습니다." };
  };

  // 컬렉션 삭제
  deleteCollection = async (user_id, _id) => {
    const thisCollection = await this.collectionRepository.getCollection(_id);

    if (thisCollection) {
      return { status: 400, message: "해당 컬렉션이 없습니다." };
    } else {
      await this.collectionRepository.deleteCollection(_id);
      return { status: 200, message: "컬렉션을 삭제하였습니다." };
    }
  };

  // 컬렉션 좋아요 누르기
  likeCollection = async (user_id, _id) => {
    const thisCollection = await this.collectionRepository.getCollection(_id);

    // User DB에 찾아봤더니 이미 좋아하고 있으면
    //-- -User DB에서 likeCollectionsArr 컬렉션 id 빼고 다시 저장 (filter)
    //--- Collection DB에서 likes count 1개 빼기
    // 아직 좋아하기 전이면
    //--- User DB에 이번 컬렉션 id 추가 User.update()
    //--- Collection DB에서 likes count 1개 올리기 ++
  };

  // 검색어와 내용, 제목 일부 일치하는 컬렉션 찾기
  getCollectionsBySearch = async (req, res) => {
    // 검색어를 포함하는 컬렉션의 기본정보를 배열로 받아오기
    // 해당 배열을 응답하기
  };

  // 컬렉션에 영상 추가
  addVideoOnCollection = async (req, res) => {
    // 추가할 영상 id를 res.query.video_id 로 받음
    // 컬렉션 정보에 해당 영상 추가해 넣기
    // 추가된 결과 응답하기
  };
}

module.exports = CollectionsService;
