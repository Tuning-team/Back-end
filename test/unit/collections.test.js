// 테스트할 클래스&인스턴스 & 필요한 모델, 모듈, 데이터
const CollectionsService = require("../../b_services/collections.service");
const collectionsService = new CollectionsService();

const httpMocks = require("node-mocks-http");
const {
  users,
  collectionsListFromDB,
  commentsToInsert,
  videosListFromDB,
  collectionDataList,
  getAllCategories,
  newVideosSources,
  getTop10,
} = require("../data/collection-data-in");

let req, res, next;
beforeEach(() => {
  req = httpMocks.createRequest(); // 빈 리퀘스트 객체 생성
  res = httpMocks.createResponse(); // 빈 리스폰스 객체 생성
  next = jest.fn(); // mock 함수로 생성(데이터 수집)
});

describe("CollectionsService 단위테스트 진행", () => {
  describe("getAllCollectionsByUserId 테스트 : UserId로 각자 만든 컬렉션 리스트", () => {
    beforeEach(() => {
      res.locals.user_id = "6329192569d8145d2cb49b6b";
      req.query = { offset: 0, limit: 3 };
    });

    it("정상 상황에 대한 테스트 ", async () => {
      // 클래스 안에서 사용하는 메소드들도 정상적인 답을 내어주고 있다고 치자.

      collectionsService.collectionRepository.getAllCollectionsByUserIdWithPaging = jest.fn();
      collectionsService.collectionRepository.getAllCollectionsByUserIdWithPaging.mockReturnValue({
        userDataAll: collectionsListFromDB,
        totalContents: 30,
        hasNext: true,
      });

      collectionsService.commentRepository.getAllCommentsOnCollectionId = jest.fn();
      collectionsService.commentRepository.getAllCommentsOnCollectionId.mockReturnValue(commentsToInsert);

      collectionsService.videoRepository.getVideoById = jest.fn();
      collectionsService.videoRepository.getVideoById.mockReturnValue(videosListFromDB);

      // 이때 이 단위테스트에서 테스트하는 메소드를 거치면,
      await collectionsService.getAllCollectionsByUserId(req, res);

      // 메소드가 반환하는 Response의 statusCode : 200이 되어야 한다.
      expect(res.statusCode).toBe(200);
    });
  });

  describe("getAllCollectionsByCategoryId 테스트 : 카테고리에 해당하는 컬렉션 리스트", () => {
    beforeEach(() => {});

    it("정상 상황에 대한 테스트 ", async () => {
      // 클래스 안에서 사용하는 메소드들도 정상적인 답을 내어주고 있다고 치자.
      req.query = {
        category_id: "6319aeebd1e330e86bbade7c",
        offset: 0,
        limit: 5,
      };

      collectionsService.collectionRepository.getAllCollectionsByCategoryIdWithPaging = jest.fn();
      collectionsService.collectionRepository.getAllCollectionsByCategoryIdWithPaging.mockReturnValue({
        categoryDataAll: collectionDataList,
        totalContents: 30,
        hasNext: true,
      });

      collectionsService.categoryRepository.getAllCategories = jest.fn();
      collectionsService.categoryRepository.getAllCategories.mockReturnValue(getAllCategories);

      collectionsService.commentRepository.getAllCommentsOnCollectionId = jest.fn();
      collectionsService.commentRepository.getAllCommentsOnCollectionId.mockReturnValue(commentsToInsert);

      // 이때 이 단위테스트에서 테스트하는 메소드를 거치면,
      await collectionsService.getAllCollectionsByCategoryId(req, res);

      // 메소드가 반환하는 Response의 statusCode : 200이 되어야 한다.
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData().pageInfo.hasNext).toBeTruthy();
    });
  });

  describe("getAllCollectionsByCategories 테스트 : 카테고리들에 해당하는 컬렉션 리스트", () => {
    beforeEach(() => {});

    it("정상 상황에 대한 테스트 ", async () => {
      // 클래스 안에서 사용하는 메소드들도 정상적인 답을 내어주고 있다고 치자.
      req.body = {
        category_ids: [
          "6319aeebd1e330e86bbade9f",
          "631e7d7a4ae4c133c405a964",
          "631e7d7a4ae4c133c405a966",
          "631e7d7a4ae4c133c405a965",
        ],
      };

      collectionsService.collectionRepository.getAllCollectionsByCategoryId = jest.fn();
      collectionsService.collectionRepository.getAllCollectionsByCategoryId.mockReturnValue(collectionDataList);

      collectionsService.categoryRepository.getCategoryInfo = jest.fn();
      collectionsService.categoryRepository.getCategoryInfo.mockReturnValue({
        _id: "6319aeebd1e330e86bbade7c",
        categoryName: "인기있는",
        youtubeCategoryId: "",
        isVisible: true,
        createdAt: "2022-09-08T08:59:23.744Z",
        __v: 0,
      });

      collectionsService.commentRepository.getAllCommentsOnCollectionId = jest.fn();
      collectionsService.commentRepository.getAllCommentsOnCollectionId.mockReturnValue(commentsToInsert);

      // 이때 이 단위테스트에서 테스트하는 메소드를 거치면,
      await collectionsService.getAllCollectionsByCategories(req, res);

      // 메소드가 반환하는 Response의 statusCode : 200이 되어야 한다.
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData().message).toEqual("데이터를 불러왔습니다.");
    });
  });

  describe("getCollection 테스트 : 컬렉션 상세 조회", () => {
    beforeEach(() => {});

    it("정상 상황에 대한 테스트 ", async () => {
      // 클래스 안에서 사용하는 메소드들도 정상적인 답을 내어주고 있다고 치자.
      req.params = { collection_id: "63291a2bdcc97f368cc4fcaa" };
      collectionsService.collectionRepository.getCollectionById = jest.fn();
      collectionsService.collectionRepository.getCollectionById.mockReturnValue(collectionsListFromDB[0]);

      collectionsService.commentRepository.getAllCommentsOnCollectionId = jest.fn();
      collectionsService.commentRepository.getAllCommentsOnCollectionId.mockReturnValue(commentsToInsert);

      collectionsService.videoRepository.getVideoById = jest.fn();
      collectionsService.videoRepository.getVideoById.mockReturnValue(videosListFromDB[0]);

      collectionsService.userRepository.getUserById = jest.fn();
      collectionsService.userRepository.getUserById.mockReturnValue(users[0]);

      // 이때 이 단위테스트에서 테스트하는 메소드를 거치면,
      await collectionsService.getCollection(req, res);

      // 메소드가 반환하는 Response의 statusCode : 200이 되어야 한다.
      expect(res.statusCode).toBe(200);
    });
  });

  describe("createCollection 테스트 : 컬렉션 만들기", () => {
    beforeEach(() => {});

    it("정상 상황에 대한 테스트 ", async () => {
      // 클래스 안에서 사용하는 메소드들도 정상적인 답을 내어주고 있다고 치자.
      res.locals.user_id = "6329192569d8145d2cb49b6b";
      req.body = {
        category_id: "6319aeebd1e330e86bbade88",
        collectionTitle: "생성 테스트하기",
        description: "ㅇㅇ",
        videos: ["_VE04NqHNqc", "P1UZTj1h1a0", "hKfb-rudyWA", "JdHyjfVcN9Y", "rRhowWJ6r_4"],
      };
      collectionsService.videoRepository.createVideosByIds = jest.fn();
      collectionsService.collectionRepository.createCollection = jest.fn();
      collectionsService.userRepository.createMyCollection = jest.fn();
      collectionsService.videoRepository.createVideosByIds.mockReturnValue(videosListFromDB);
      collectionsService.collectionRepository.createCollection.mockReturnValue(collectionsListFromDB[0]);
      // collectionsService.userRepository.createMyCollection.mockReturnValue(null);

      // 이때 이 단위테스트에서 테스트하는 메소드를 거치면,
      await collectionsService.createCollection(req, res);

      // 메소드가 반환하는 Response의 statusCode : 201이 되어야 한다.
      expect(res.statusCode).toBe(201);
    });
  });

  describe("editCollection 테스트 : 컬렉션 수정", () => {
    beforeEach(() => {});

    it("정상 상황에 대한 테스트 ", async () => {
      // 클래스 안에서 사용하는 메소드들도 정상적인 답을 내어주고 있다고 치자.
      res.locals.user_id = "6329192569d8145d2cb49b6b";
      req.params = { collection_id: "63291a2bdcc97f368cc4fcaa" };
      req.body = {
        category_id: "6319aeebd1e330e86bbade88",
        collectionTitle: "생성 테스트하기",
        description: "ㅇㅇ",
        videos: ["_VE04NqHNqc", "P1UZTj1h1a0", "hKfb-rudyWA", "JdHyjfVcN9Y", "rRhowWJ6r_4"],
      };

      collectionsService.collectionRepository.getCollectionById = jest.fn();
      collectionsService.videoRepository.createVideosByIds = jest.fn();
      collectionsService.collectionRepository.editCollection = jest.fn();
      collectionsService.collectionRepository.getCollectionById.mockReturnValue(collectionsListFromDB[0]);
      collectionsService.videoRepository.createVideosByIds.mockReturnValue(videosListFromDB);
      collectionsService.collectionRepository.editCollection.mockReturnValue("updated");

      // 이때 이 단위테스트에서 테스트하는 메소드를 거치면,
      await collectionsService.editCollection(req, res);

      // 메소드가 반환하는 Response의 statusCode : 200이 되어야 한다.
      expect(res.statusCode).toBe(200);
    });
  });

  describe("deleteCollection 테스트 : 컬렉션 삭제", () => {
    beforeEach(() => {});

    it("정상 상황에 대한 테스트 ", async () => {
      // 클래스 안에서 사용하는 메소드들도 정상적인 답을 내어주고 있다고 치자.
      res.locals.user_id = "6329192569d8145d2cb49b6b";
      req.params = { collection_id: "63291a2bdcc97f368cc4fcaa" };

      collectionsService.collectionRepository.getCollectionById = jest.fn();
      collectionsService.collectionRepository.getCollectionById.mockReturnValue(collectionsListFromDB[0]);
      collectionsService.collectionRepository.deleteCollection = jest.fn();
      collectionsService.collectionRepository.deleteCollection.mockReturnValue("done");
      collectionsService.userRepository.deleteMyCollection = jest.fn();
      collectionsService.userRepository.deleteMyCollection.mockReturnValue("done");

      // 이때 이 단위테스트에서 테스트하는 메소드를 거치면,
      await collectionsService.deleteCollection(req, res);

      // 메소드가 반환하는 Response의 statusCode : 200이 되어야 한다.
      expect(res.statusCode).toBe(200);
    });
  });

  describe("likeCollection 테스트 : 좋아요 누르기", () => {
    beforeEach(() => {});

    it("정상 상황에 대한 테스트 ", async () => {
      // 클래스 안에서 사용하는 메소드들도 정상적인 답을 내어주고 있다고 치자.
      res.locals.user_id = "6329192569d8145d2cb49b6b";
      req.params = { collection_id: "63291a2bdcc97f368cc4fcaa" };

      collectionsService.collectionRepository.getCollectionById = jest.fn();
      collectionsService.collectionRepository.getCollectionById.mockReturnValue(collectionsListFromDB[0]);
      collectionsService.userRepository.getUserById = jest.fn();
      collectionsService.userRepository.getUserById.mockReturnValue(users[0]);
      collectionsService.collectionRepository.likeCollection = jest.fn();
      collectionsService.collectionRepository.likeCollection.mockReturnValue("liked");
      collectionsService.userRepository.likeCollection = jest.fn();
      collectionsService.userRepository.likeCollection.mockReturnValue("liked");
      collectionsService.collectionRepository.disLikeCollection = jest.fn();
      collectionsService.collectionRepository.disLikeCollection.mockReturnValue("disliked");
      collectionsService.userRepository.disLikeCollection = jest.fn();
      collectionsService.userRepository.disLikeCollection.mockReturnValue("disliked");

      // 이때 이 단위테스트에서 테스트하는 메소드를 거치면,
      await collectionsService.likeCollection(req, res);

      // 메소드가 반환하는 Response의 statusCode : 200이 되어야 한다.
      expect(res.statusCode).toBe(200);
    });
  });

  describe("getCollectionsBySearch 테스트 : 검색어와 일치하는 컬렉션 찾기", () => {
    beforeEach(() => {});

    it("정상 상황에 대한 테스트 ", async () => {
      // 클래스 안에서 사용하는 메소드들도 정상적인 답을 내어주고 있다고 치자.
      req.query = { keyword: "운동", offset: 0, limit: 3 };

      collectionsService.collectionRepository.getCollectionsBySearchWithPaging = jest.fn();
      collectionsService.collectionRepository.getCollectionsBySearchWithPaging.mockReturnValue({
        resultBySearch: collectionsListFromDB,
        totalContents: 30,
        hasNext: true,
      });
      collectionsService.commentRepository.getAllCommentsOnCollectionId = jest.fn();
      collectionsService.commentRepository.getAllCommentsOnCollectionId.mockReturnValue(commentsToInsert);
      collectionsService.videoRepository.getVideoById = jest.fn();
      collectionsService.videoRepository.getVideoById.mockReturnValue(newVideosSources);

      // 이때 이 단위테스트에서 테스트하는 메소드를 거치면,
      await collectionsService.getCollectionsBySearch(req, res);

      // 메소드가 반환하는 Response의 statusCode : 201이 되어야 한다.
      expect(res.statusCode).toBe(200);
    });
  });

  describe("addVideoOnCollection 테스트 : 검색어와 일치하는 컬렉션 찾기", () => {
    beforeEach(() => {});

    it("정상 상황에 대한 테스트 ", async () => {
      // 클래스 안에서 사용하는 메소드들도 정상적인 답을 내어주고 있다고 치자.
      res.locals.user_id = "6329192569d8145d2cb49b6b";
      req.params = { collection_id: "63291a2bdcc97f368cc4fcaa" };
      req.body = { videos: videosListFromDB };

      collectionsService.collectionRepository.getCollectionById = jest.fn();
      collectionsService.collectionRepository.getCollectionById.mockReturnValue(collectionsListFromDB[0]);
      collectionsService.collectionRepository.addVideoOnCollection = jest.fn();
      collectionsService.collectionRepository.addVideoOnCollection.mockReturnValue(collectionsListFromDB[0]);

      // 이때 이 단위테스트에서 테스트하는 메소드를 거치면,
      await collectionsService.addVideoOnCollection(req, res);

      // 메소드가 반환하는 Response의 statusCode : 201이 되어야 한다.
      expect(res.statusCode).toBe(201);
    });
  });

  describe("removeVideoFromCollection 테스트 : 컬렉션 영상 제거", () => {
    beforeEach(() => {});

    it("정상 상황에 대한 테스트 ", async () => {
      // 클래스 안에서 사용하는 메소드들도 정상적인 답을 내어주고 있다고 치자.
      res.locals.user_id = "6329192569d8145d2cb49b6b";
      req.params = { collection_id: "63291a2bdcc97f368cc4fcaa" };

      collectionsService.collectionRepository.getCollectionById = jest.fn();
      collectionsService.collectionRepository.getCollectionById.mockReturnValue(collectionsListFromDB[0]);
      collectionsService.collectionRepository.removeVideoFromCollection = jest.fn();
      collectionsService.collectionRepository.removeVideoFromCollection.mockReturnValue(videosListFromDB);

      // 이때 이 단위테스트에서 테스트하는 메소드를 거치면,
      await collectionsService.removeVideoFromCollection(req, res);

      // 메소드가 반환하는 Response의 statusCode : 201이 되어야 한다.
      expect(res.statusCode).toBe(200);
    });
  });

  describe("whoKeepCollection 테스트 : 컬렉션을 담은 사람", () => {
    beforeEach(() => {});

    it("정상 상황에 대한 테스트 ", async () => {
      // 클래스 안에서 사용하는 메소드들도 정상적인 답을 내어주고 있다고 치자.
      req.params = { collection_id: "63291a2bdcc97f368cc4fcaa" };

      collectionsService.collectionRepository.getCollectionById = jest.fn();
      collectionsService.collectionRepository.getCollectionById.mockReturnValue(collectionsListFromDB[0]);

      // 이때 이 단위테스트에서 테스트하는 메소드를 거치면,
      await collectionsService.whoKeepCollection(req, res);

      // 메소드가 반환하는 Response의 statusCode : 201이 되어야 한다.
      expect(res.statusCode).toBe(200);
    });
  });

  describe("getLikeTop10 테스트 : 컬렉션 좋아요 내림차순 10개에 카테고리 아이디 부여 ", () => {
    beforeEach(() => {});

    it("정상 상황에 대한 테스트 ", async () => {
      // 클래스 안에서 사용하는 메소드들도 정상적인 답을 내어주고 있다고 치자.

      collectionsService.collectionRepository.getLidOfCategory = jest.fn();
      collectionsService.collectionRepository.getLidOfCategory.mockReturnValue("6319aeebd1e330e86bbade9f");

      collectionsService.collectionRepository.giveCategoryIdOnLikeTop10 = jest.fn();
      collectionsService.collectionRepository.giveCategoryIdOnLikeTop10.mockReturnValue(getTop10);

      // 이때 이 단위테스트에서 테스트하는 메소드를 거치면,
      await collectionsService.getLikeTop10(req, res);

      // 메소드가 반환하는 Response의 statusCode : 200이 되어야 한다.
      expect(res.statusCode).toBe(200);
    });
  });

  describe("getLatestTop10 테스트 : 가장 최근에 만들어진 컬렉션 10개에 카테고리 아이디 부여 ", () => {
    beforeEach(() => {});

    it("정상 상황에 대한 테스트 ", async () => {
      // 클래스 안에서 사용하는 메소드들도 정상적인 답을 내어주고 있다고 치자.

      collectionsService.collectionRepository.getLidOfCategory = jest.fn();
      collectionsService.collectionRepository.getLidOfCategory.mockReturnValue("631e7d7a4ae4c133c405a964");

      collectionsService.collectionRepository.giveCategoryIdOnLatestTop10 = jest.fn();
      collectionsService.collectionRepository.giveCategoryIdOnLatestTop10.mockReturnValue(getTop10);

      // 이때 이 단위테스트에서 테스트하는 메소드를 거치면,
      await collectionsService.getLatestTop10(req, res);

      // 메소드가 반환하는 Response의 statusCode : 200이 되어야 한다.
      expect(res.statusCode).toBe(200);
    });
  });

  describe("getTimeRecommend10 테스트 : 시간대별 추천 컬렉션 10개에 카테고리 아이디 부여 ", () => {
    beforeEach(() => {});

    it("정상 상황에 대한 테스트 ", async () => {
      // 클래스 안에서 사용하는 메소드들도 정상적인 답을 내어주고 있다고 치자.

      collectionsService.collectionRepository.getLidOfCategory = jest.fn();
      collectionsService.collectionRepository.getLidOfCategory.mockReturnValue("631e7d7a4ae4c133c405a966");

      collectionsService.collectionRepository.giveCategoryIdOnTimeRecommendation = jest.fn();
      collectionsService.collectionRepository.giveCategoryIdOnTimeRecommendation.mockReturnValue(getTop10);

      // 이때 이 단위테스트에서 테스트하는 메소드를 거치면,
      await collectionsService.getTimeRecommend10(req, res);

      // 메소드가 반환하는 Response의 statusCode : 200이 되어야 한다.
      expect(res.statusCode).toBe(200);
    });
  });

  describe("getWeatherRecommend10 테스트 : 날씨별 추천 컬렉션 10개에 카테고리 아이디 부여 ", () => {
    beforeEach(() => {});

    it("정상 상황에 대한 테스트 ", async () => {
      // 클래스 안에서 사용하는 메소드들도 정상적인 답을 내어주고 있다고 치자.

      collectionsService.collectionRepository.getLidOfCategory = jest.fn();
      collectionsService.collectionRepository.getLidOfCategory.mockReturnValue("631e7d7a4ae4c133c405a965");

      collectionsService.collectionRepository.giveCategoryIdOnWeatherRecommendation = jest.fn();
      collectionsService.collectionRepository.giveCategoryIdOnWeatherRecommendation.mockReturnValue(getTop10);

      collectionsService.categoryRepository.updateCategory = jest.fn();
      collectionsService.categoryRepository.updateCategory.mockReturnValue("631e7d7a4ae4c133c405a96521");

      // 이때 이 단위테스트에서 테스트하는 메소드를 거치면,
      await collectionsService.getWeatherRecommend10(req, res);

      // 메소드가 반환하는 Response의 statusCode : 200이 되어야 한다.
      expect(res.statusCode).toBe(200);
    });
  });
  describe("removeVideoFromCollection 테스트 : 컬렉션 영상 제거 예외처리", () => {
    beforeEach(() => {});

    it("정상 상황에 대한 테스트 ", async () => {
      // 클래스 안에서 사용하는 메소드들도 정상적인 답을 내어주고 있다고 치자.
      res.locals.user_id = "6329197069d8145d2cb4a2c9"; //다른 유저아이디가 들어왔을때
      req.params = { collection_id: "63291a2bdcc97f368cc4fcaa" };

      collectionsService.collectionRepository.getCollectionById = jest.fn();
      collectionsService.collectionRepository.getCollectionById.mockReturnValue(collectionsListFromDB[0]);
      collectionsService.collectionRepository.removeVideoFromCollection = jest.fn();
      collectionsService.collectionRepository.removeVideoFromCollection.mockReturnValue(videosListFromDB);

      // 이때 이 단위테스트에서 테스트하는 메소드를 거치면,
      await collectionsService.removeVideoFromCollection(req, res);

      // 메소드가 반환하는 Response의 statusCode : 400이 되어야 한다.
      expect(res.statusCode).toBe(400);
    });
  });
});
