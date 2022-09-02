const CollectionRepository = require("../c_repositories/collections.repository");
const UserRepository = require("../c_repositories/users.repository")

class CollectionsService {
  collectionRepository = new CollectionRepository();
  userRepository = new UserRepository();
  // 내가 모은 컬렉션 목록 조회
  getAllCollectionsByUserId = async (req, res) => {
    try {
      const { user_id } = req.body;

      const userdataAll =
        await this.collectionRepository.getAllCollectionsByUserId(user_id);

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

      res.status(200).json({ resultData });
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
      const { category_id } = req.params;

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
      res.status(200).json({ resultData });
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

      const thisCollection = await this.collectionRepository.getCollection(_id);
      if (!thisCollection) {
        res.json({ message: "해당 컬렉션이 없습니다." });
      }
      const data = [
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
      res.status(200).json({ data });
      return;
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
      const {
        user_id,
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
        createdAt,
      );
      res.status(200).json(returnCollection);
      return { success: true, message: "컬렉션을 생성하였습니다." };
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
      const { _id } = req.params;
      const { user_id } = req.body;

      const thisCollection = await this.collectionRepository.getCollection(_id);

      if (!thisCollection) {
        res
          .status(400)
          .json({ success: false, message: "해당 컬렉션이 없습니다." });
      } else if (user_id !== thisCollection.user_id) {
        res
          .status(400)
          .json({ success: false, message: "삭제 권한이 없습니다." });
      } else {
        await this.collectionRepository.deleteCollection(_id);
        res
          .status(200)
          .json({ success: true, message: "컬렉션을 삭제하였습니다." });
      }
      return;
    } catch (error) {
      console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
      return res.status(400).json({
        errorMessage: "컬렉션 삭제에 실패하였습니다.",
      });
    }
  };

  // 컬렉션 좋아요 누르기
  likeCollection = async (req, res) => {
    const { _id } = req.params;
    const { user_id } = req.body;

    const thisCollection = await this.collectionRepository.getCollection(_id);
    const likeArr = await this.userRepository.getCollectionsByLikedArray({ likedCollectionsArr })
    
    if (!thisCollection) {
      res.status(400).json({ message: "해당 컬렉션이 없습니다." });
      return;

    } else if (!thisCollection.includes(likeArr.toString())) {
      await this.collectionRepository.likeCollection(_id);
      await this.userRepository.likeCollection(user_id, _id);
      res.status(200).json({ message: "컬렉션에 좋아요를 등록하였습니다." });
      return;

    } else {
      await this.collectionRepository.disLikeCollection(_id);
      await this.userRepository.disLikeCollection(user_id, _id);
      res.status(200).json({ message: "컬렉션에 좋아요를 취소하였습니다." });
      return;
    }
    // User DB에 찾아봤더니 이미 좋아하고 있으면
    //---User DB에서 컬렉션 id 빼고 다시 저장 (filter)
    //--- Collection DB에서 likes count 1개 빼기
    // 아직 좋아하기 전이면
    //--- User DB에 이번 컬렉션 id 추가
    //--- Collection DB에서 likes count 1개 올리기
  };

  // 내가 좋아한 컬렉션 조회

  // 검색어와 내용, 제목 일부 일치하는 컬렉션 찾기
  getCollectionsBySearch = async (req, res) => {
    // 검색어를 포함하는 컬렉션의 기본정보를 배열로 받아오기
    // 해당 배열을 응답하기
    const { keyword } = req.query;
    const options = [];

    if (req.query.option === "collectionTitle") {
      options = [{ collectionTitle: new RegExp(req.query.keyword) }];
    } else if (req.query.option === "description") {
      options = [{ description: new RegExp(req.query.content) }];
    } else if (req.query.option === "collectionTitle + description") {
      options = [
        { collectionTitle: new RegExp(req.query.keyword) },
        { description: new RegExp(req.query.keyword) },
      ];
    } else {
      return { status: 400, message: "검색 옵션이 없습니다." };
    }

    const lists = await this.collectionRepository
      .find({ $or: options })
      .sort({ _id: -1 })
      .limit(10)
      .lean()
      .exec();

    if (!lists) {
      res
        .status(400)
        .json({ result: false, message: "컬렉션이 존재하지 않습니다." });
      return;
    } else {
      res.status(200).json({ result: lists });
      return;
    }
  };

  // 컬렉션에 영상 추가
  addVideoOnCollection = async (req, res) => {
    const { video_id } = req.query;

    const addVideo = await this.collectionRepository.addVideoOnCollection(

    )
    res.status(200).json(addVideo);
        return { success: true, message: "영상이 추가 되었습니다." };
    // 추가할 영상 id를 res.query.video_id 로 받음
    // 컬렉션 정보에 해당 영상 추가해 넣기
    // 추가된 결과 응답하기

    };
  };

module.exports = CollectionsService;
