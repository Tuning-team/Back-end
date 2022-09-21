// 테스트할 클래스&인스턴스 & 필요한 모델, 모듈, 데이터
const UserService = require("../../b_services/users.service");
const userService = new UserService();

const httpMocks = require("node-mocks-http");
const {
  users,
  collectionsListFromDB,
  commentsToInsert,
  videosListFromDB,
  collectionDataList,
  getAllCategories,
} = require("../data/user-data-in");

let req, res, next;
beforeEach(() => {
  req = httpMocks.createRequest(); // 빈 리퀘스트 객체 생성
  res = httpMocks.createResponse(); // 빈 리스폰스 객체 생성
  next = jest.fn(); // mock 함수로 생성(데이터 수집)
});

describe("UserService 단위테스트 진행", () => {
  describe("getLoggedInUser 테스트 : ID로 유저정보 조회", () => {
    beforeEach(() => {});

    it("정상 상황에 대한 테스트 ", async () => {
      // 클래스 안에서 사용하는 메소드들도 정상적인 답을 내어주고 있다고 치자.
      res.locals.user_id = "6329192569d8145d2cb49b6b";
      userService.usersRepository.getUserById = jest.fn();
      userService.usersRepository.getUserById.mockReturnValue(users[0]);

      // 이때 이 단위테스트에서 테스트하는 메소드를 거치면,
      await userService.getLoggedInUser(req, res);

      // 메소드가 반환하는 Response의 statusCode : 200이 되어야 한다.
      expect(res.statusCode).toBe(200);
    });
  });

  describe("getUserById 테스트 : ID로 유저정보 조회", () => {
    beforeEach(() => {});

    it("정상 상황에 대한 테스트 ", async () => {
      // 클래스 안에서 사용하는 메소드들도 정상적인 답을 내어주고 있다고 치자.
      userService.usersRepository.getUserById = jest.fn();
      userService.usersRepository.getUserById.mockReturnValue(users[0]);

      // 이때 이 단위테스트에서 테스트하는 메소드를 거치면,
      await userService.getUserById(req, res);

      // 메소드가 반환하는 Response의 statusCode : 200이 되어야 한다.
      expect(res.statusCode).toBe(200);
    });
  });

  describe("setInterestCategories 테스트 : 카테고리 관심 등록", () => {
    beforeEach(() => {});

    it("정상 상황에 대한 테스트 ", async () => {
      // 클래스 안에서 사용하는 메소드들도 정상적인 답을 내어주고 있다고 치자.
      req.params = { category_id: "6319aeebd1e330e86bbade7c" };
      res.locals.user_id = "6329192569d8145d2cb49b6b";
      userService.usersRepository.getUserById = jest.fn();
      userService.usersRepository.setInterestCategories = jest.fn();
      userService.categoryRepository.getAllCategories = jest.fn();
      userService.usersRepository.getUserById.mockReturnValue(users[0]);
      userService.usersRepository.setInterestCategories.mockReturnValue("updated");
      userService.categoryRepository.getAllCategories.mockReturnValue(getAllCategories);

      // 이때 이 단위테스트에서 테스트하는 메소드를 거치면,
      await userService.setInterestCategories(req, res);

      // 메소드가 반환하는 Response의 statusCode : 200이 되어야 한다.
      expect(res.statusCode).toBe(200);
    });
  });

  describe("getInterestCategories 테스트 : 관심사 확인", () => {
    beforeEach(() => {});

    it("정상 상황에 대한 테스트 ", async () => {
      // 클래스 안에서 사용하는 메소드들도 정상적인 답을 내어주고 있다고 치자.
      res.locals.user_id = "6329192569d8145d2cb49b6b";
      userService.usersRepository.getUserById = jest.fn();
      userService.categoryRepository.getAllCategories = jest.fn();
      userService.usersRepository.getUserById.mockReturnValue(users[0]);
      userService.categoryRepository.getAllCategories.mockReturnValue(getAllCategories);

      // 이때 이 단위테스트에서 테스트하는 메소드를 거치면,
      await userService.getInterestCategories(req, res);

      // 메소드가 반환하는 Response의 statusCode : 200이 되어야 한다.
      expect(res.statusCode).toBe(200);
    });
  });

  describe("removeInterestCategories 테스트 : 관심사 제거", () => {
    beforeEach(() => {});

    it("정상 상황에 대한 테스트 ", async () => {
      // 클래스 안에서 사용하는 메소드들도 정상적인 답을 내어주고 있다고 치자.
      res.locals.user_id = "6329192569d8145d2cb49b6b";
      req.params = { category_id: "6319aeebd1e330e86bbade7c" };

      userService.usersRepository.getUserById = jest.fn();
      userService.usersRepository.getUserById.mockReturnValue(users[0]);
      userService.usersRepository.updateUserInterest = jest.fn();
      userService.usersRepository.updateUserInterest.mockReturnValue("updated");

      // 이때 이 단위테스트에서 테스트하는 메소드를 거치면,
      await userService.removeInterestCategories(req, res);

      // 메소드가 반환하는 Response의 statusCode : 200이 되어야 한다.
      expect(res.statusCode).toBe(200);
    });
  });

  describe("followUnfollow 테스트 : 팔로우 또는 언팔로우", () => {
    beforeEach(() => {});

    it("정상 상황에 대한 테스트 ", async () => {
      // 클래스 안에서 사용하는 메소드들도 정상적인 답을 내어주고 있다고 치자.
      res.locals.user_id = "6329192569d8145d2cb49b6b";
      req.params = { user_id: "6329191a69d8145d2cb4988a" };
      userService.usersRepository.getUserById = jest.fn();
      userService.usersRepository.getUserById.mockReturnValue(users[0]);
      userService.usersRepository.followUser = jest.fn();
      userService.usersRepository.followUser.mockReturnValue("followed");
      userService.usersRepository.unfollowUser = jest.fn();
      userService.usersRepository.unfollowUser.mockReturnValue("unfollowed");

      // 이때 이 단위테스트에서 테스트하는 메소드를 거치면,
      await userService.followUnfollow(req, res);

      // 메소드가 반환하는 Response의 statusCode : 200이 되어야 한다.
      expect(res.statusCode).toBe(200);
    });
  });

  describe("getFollowings 테스트 : 팔로우하는 사람 찾기 ", () => {
    beforeEach(() => {});

    it("정상 상황에 대한 테스트 ", async () => {
      // 클래스 안에서 사용하는 메소드들도 정상적인 답을 내어주고 있다고 치자.
      req.params = { user_id: "6329191a69d8145d2cb4988a" };
      userService.usersRepository.getUserById = jest.fn();
      userService.usersRepository.getUserById.mockReturnValue(users[0]);

      // 이때 이 단위테스트에서 테스트하는 메소드를 거치면,
      await userService.getFollowings(req, res);

      // 메소드가 반환하는 Response의 statusCode : 200이 되어야 한다.
      expect(res.statusCode).toBe(200);
    });
  });

  describe("keepCollection 테스트 : 컬렉션 담기", () => {
    beforeEach(() => {});

    it("정상 상황에 대한 테스트 ", async () => {
      // 클래스 안에서 사용하는 메소드들도 정상적인 답을 내어주고 있다고 치자.
      res.locals.user_id = "6329192569d8145d2cb49b6b";
      req.params = { collection_id: "63291a2bdcc97f368cc4fcaa" };
      userService.collectionRepository.getCollectionById = jest.fn();
      userService.collectionRepository.getCollectionById.mockReturnValue(collectionsListFromDB[0]);
      userService.usersRepository.getUserById = jest.fn();
      userService.usersRepository.getUserById.mockReturnValue(users[0]);
      userService.collectionRepository.keepCollection = jest.fn();
      userService.collectionRepository.keepCollection.mockReturnValue("kept");
      userService.usersRepository.keepCollection = jest.fn();
      userService.usersRepository.keepCollection.mockReturnValue("kept");

      // 이때 이 단위테스트에서 테스트하는 메소드를 거치면,
      await userService.keepCollection(req, res);

      // 메소드가 반환하는 Response의 statusCode : 200이 되어야 한다.
      expect(res.statusCode).toBe(200);
    });
  });

  describe("notKeepCollection 테스트 : 컬렉션 담기 취소", () => {
    beforeEach(() => {});

    it("정상 상황에 대한 테스트 ", async () => {
      // 클래스 안에서 사용하는 메소드들도 정상적인 답을 내어주고 있다고 치자.
      res.locals.user_id = "6329192569d8145d2cb49b6b";
      req.params = { collection_id: "63291a2bdcc97f368cc4fcaa" };
      userService.collectionRepository.getCollectionById = jest.fn();
      userService.collectionRepository.getCollectionById.mockReturnValue(collectionsListFromDB[0]);
      userService.usersRepository.getUserById = jest.fn();
      userService.usersRepository.getUserById.mockReturnValue(users[0]);
      userService.collectionRepository.keepCollection = jest.fn();
      userService.collectionRepository.keepCollection.mockReturnValue("kept");
      userService.usersRepository.keepCollection = jest.fn();
      userService.usersRepository.keepCollection.mockReturnValue("kept");

      // 이때 이 단위테스트에서 테스트하는 메소드를 거치면,
      await userService.notKeepCollection(req, res);

      // 메소드가 반환하는 Response의 statusCode : 200이 되어야 한다.
      expect(res.statusCode).toBe(200);
    });
  });

  describe("getCollectionsByKeepingArray 테스트 : 내가 담은 컬렉션 목록 조회", () => {
    beforeEach(() => {});

    it("정상 상황에 대한 테스트 ", async () => {
      // 클래스 안에서 사용하는 메소드들도 정상적인 답을 내어주고 있다고 치자.
      res.locals.user_id = "6329192569d8145d2cb49b6b";
      userService.usersRepository.getUserById = jest.fn();
      userService.usersRepository.getUserById.mockReturnValue(users[0]);

      // 이때 이 단위테스트에서 테스트하는 메소드를 거치면,
      await userService.getCollectionsByKeepingArray(req, res);

      // 메소드가 반환하는 Response의 statusCode : 200이 되어야 한다.
      expect(res.statusCode).toBe(200);
    });
  });
});
