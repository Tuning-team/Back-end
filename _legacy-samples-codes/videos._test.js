// 테스트할 User 컨트롤러, 서비스, 저장소의 각 클래스 import
const CollectionsService = require("../../services/collections.service");
const CollectionsRepository = require("../../repositories/collections.repository");
const Collections = require("../d_schemas/collection");

// 테스트할 각 클래스의 인스턴스 생성
const collectionsService = new CollectionsService();
const collectionsRepository = new CollectionsRepository();

// req, res, next 가상 객체를 생성해주는 모듈 import
const httpMocks = require("node-mocks-http");

// 테스트에 필요한 Mock Data를 생성하여 import
const collectionsDataIn = require("../data/collection-data-in.js.js"); // 받아올 mock 데이터
const collectionsDataOut = require("../data/collection-data-out.js.js"); // 받아올 mock 데이터

// 공용 변수들을 여기에 정의
let req, res, next;
beforeEach(() => {
  req = httpMocks.createRequest(); // 빈 리퀘스트 객체 생성
  res = httpMocks.createResponse(); // 빈 리스폰스 객체 생성
  next = jest.fn();
});

describe("Collections Service 계층 메소드의 기능 테스트", () => {
  beforeEach(() => {
    // Collections Service 전체적으로 사용할 임의정보들을 정의한다.
  });
  describe("메소드 createCollection 테스트", () => {
    beforeEach(() => {
      // createCollection 메소드안에서 사용할 하위 메소드들은 mock 함수로 정의한다.
    });

    test("기능테스트 : 어떤한 정상 상태에서 이러한 답을 내어줘야 한다.", async () => {
      // 테스트를 하고 있는 메소드를 둘러싼 이상적인 환경이 아래와 같다고 치자.
      req.body = {};

      // 이 정상적인 상태에서 메소드를 호출하면
      await collectionsService.createCollection(req, res, next);

      // 이러한 결과들을 expect 한다.
      expect(res.statusCode).toBe(200);
      expect(res.data).toBe({});
    });

    test("오류상황 테스트 : 어떤한 비정상적인 상태에서 오류 정보를 정확히 내어줘야 한다.", async () => {
      // 테스트를 하고 있는 메소드를 둘러싼 이상적인 환경이 아래와 같다고 치자.
      req.body = {};

      // 이 정상적인 상태에서 메소드를 호출하면
      await collectionsService.createCollection(req, res, next);

      // 이러한 결과들을 expect 한다.
      expect(res.statusCode).toBe(200);
      expect(res.data).toBe({});
    });
  });
  describe("메소드 getMyCollections 테스트", () => {
    beforeEach(() => {
      // getMyCollections 메소드안에서 사용할 하위 메소드들은 mock 함수로 정의한다.
    });

    test("기능테스트 : 어떤한 정상 상태에서 이러한 답을 내어줘야 한다.", async () => {
      // 테스트를 하고 있는 메소드를 둘러싼 이상적인 환경이 아래와 같다고 치자.
      req.body = {};

      // 이 정상적인 상태에서 메소드를 호출하면
      await collectionsService.createCollection(req, res, next);

      // 이러한 결과들을 expect 한다.
      expect(res.statusCode).toBe(200);
      expect(res.data).toBe({});
    });

    test("오류상황 테스트 : 어떤한 비정상적인 상태에서 오류 정보를 정확히 내어줘야 한다.", async () => {
      // 테스트를 하고 있는 메소드를 둘러싼 이상적인 환경이 아래와 같다고 치자.
      req.body = {};

      // 이 정상적인 상태에서 메소드를 호출하면
      await collectionsService.createCollection(req, res, next);

      // 이러한 결과들을 expect 한다.
      expect(res.statusCode).toBe(200);
      expect(res.data).toBe({});
    });
  });
  describe("메소드 deleteCollection 테스트", () => {
    beforeEach(() => {
      // deleteCollection 메소드안에서 사용할 하위 메소드들은 mock 함수로 정의한다.
    });

    test("기능테스트 : 어떤한 정상 상태에서 이러한 답을 내어줘야 한다.", async () => {
      // 테스트를 하고 있는 메소드를 둘러싼 이상적인 환경이 아래와 같다고 치자.
      req.body = {};

      // 이 정상적인 상태에서 메소드를 호출하면
      await collectionsService.deleteCollection(req, res, next);

      // 이러한 결과들을 expect 한다.
      expect(res.statusCode).toBe(200);
      expect(res.data).toBe({});
    });

    test("오류상황 테스트 : 어떤한 비정상적인 상태에서 오류 정보를 정확히 내어줘야 한다.", async () => {
      // 테스트를 하고 있는 메소드를 둘러싼 이상적인 환경이 아래와 같다고 치자.
      req.body = {};

      // 이 정상적인 상태에서 메소드를 호출하면
      await collectionsService.deleteCollection(req, res, next);

      // 이러한 결과들을 expect 한다.
      expect(res.statusCode).toBe(200);
      expect(res.data).toBe({});
    });
  });
});

describe("Collections Repository 계층 메소드의 기능 테스트", () => {
  beforeEach(() => {
    // Collections Service 전체적으로 사용할 임의정보들을 정의한다.
  });
  describe("메소드 getCollectionById 테스트", () => {
    beforeEach(() => {
      // getCollectionById 메소드안에서 사용할 하위 메소드들은 mock 함수로 정의한다.
    });

    test("기능테스트 : 어떤한 정상 상태에서 이러한 답을 내어줘야 한다.", async () => {
      // 테스트를 하고 있는 메소드를 둘러싼 이상적인 환경이 아래와 같다고 치자.
      req.body = {};

      // 이 정상적인 상태에서 메소드를 호출하면
      await collectionsService.createCollection(req, res, next);

      // 이러한 결과들을 expect 한다.
      expect(res.statusCode).toBe(200);
      expect(res.data).toBe({});
    });

    test("오류상황 테스트 : 어떤한 비정상적인 상태에서 오류 정보를 정확히 내어줘야 한다.", async () => {
      // 테스트를 하고 있는 메소드를 둘러싼 이상적인 환경이 아래와 같다고 치자.
      req.body = {};

      // 이 정상적인 상태에서 메소드를 호출하면
      await collectionsService.createCollection(req, res, next);

      // 이러한 결과들을 expect 한다.
      expect(res.statusCode).toBe(200);
      expect(res.data).toBe({});
    });
  });
  describe("메소드 getCollectionByCategoryId 테스트", () => {
    beforeEach(() => {
      // getCollectionByCategoryId 메소드안에서 사용할 하위 메소드들은 mock 함수로 정의한다.
    });

    test("기능테스트 : 어떤한 정상 상태에서 이러한 답을 내어줘야 한다.", async () => {
      // 테스트를 하고 있는 메소드를 둘러싼 이상적인 환경이 아래와 같다고 치자.
      req.body = {};

      // 이 정상적인 상태에서 메소드를 호출하면
      await collectionsService.createCollection(req, res, next);

      // 이러한 결과들을 expect 한다.
      expect(res.statusCode).toBe(200);
      expect(res.data).toBe({});
    });

    test("오류상황 테스트 : 어떤한 비정상적인 상태에서 오류 정보를 정확히 내어줘야 한다.", async () => {
      // 테스트를 하고 있는 메소드를 둘러싼 이상적인 환경이 아래와 같다고 치자.
      req.body = {};

      // 이 정상적인 상태에서 메소드를 호출하면
      await collectionsService.createCollection(req, res, next);

      // 이러한 결과들을 expect 한다.
      expect(res.statusCode).toBe(200);
      expect(res.data).toBe({});
    });
  });
  describe("메소드 updateCollection 테스트", () => {
    beforeEach(() => {
      // updateCollection 메소드안에서 사용할 하위 메소드들은 mock 함수로 정의한다.
    });

    test("기능테스트 : 어떤한 정상 상태에서 이러한 답을 내어줘야 한다.", async () => {
      // 테스트를 하고 있는 메소드를 둘러싼 이상적인 환경이 아래와 같다고 치자.
      req.body = {};

      // 이 정상적인 상태에서 메소드를 호출하면
      await collectionsService.deleteCollection(req, res, next);

      // 이러한 결과들을 expect 한다.
      expect(res.statusCode).toBe(200);
      expect(res.data).toBe({});
    });
    test("오류상황 테스트1 : 어떤한 비정상적인 상태에서 오류 정보를 정확히 내어줘야 한다.", async () => {
      // 테스트를 하고 있는 메소드를 둘러싼 이상적인 환경이 아래와 같다고 치자.
      req.body = {};

      // 이 정상적인 상태에서 메소드를 호출하면
      await collectionsService.deleteCollection(req, res, next);

      // 이러한 결과들을 expect 한다.
      expect(res.statusCode).toBe(200);
      expect(res.data).toBe({});
    });
    test("오류상황 테스트2 : 어떤한 비정상적인 상태에서 오류 정보를 정확히 내어줘야 한다.", async () => {
      // 테스트를 하고 있는 메소드를 둘러싼 이상적인 환경이 아래와 같다고 치자.
      req.body = {};

      // 이 정상적인 상태에서 메소드를 호출하면
      await collectionsService.deleteCollection(req, res, next);

      // 이러한 결과들을 expect 한다.
      expect(res.statusCode).toBe(200);
      expect(res.data).toBe({});
    });
  });
});
