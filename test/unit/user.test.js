// 이 테스트코드로 테스트할 Collection 관련 서비스, 저장소의 각 클래스 import
const CollectionsService = require("../../b_services/collections.service");
const CollectionRepository = require("../../c_repositories/collections.repository");

// 테스트할 각 클래스의 인스턴스 생성
const collectionsService = new CollectionsService();
const collectionRepository = new CollectionRepository();

// 테스트 과정에서 사용할 Collection DB 모델 확보
const Collection = require("../d_schemas/collection");

// req, res 가상 객체를 생성해주는 모듈 import
const httpMocks = require("node-mocks-http");

// 테스트에 필요한 Mock Data import
const collectionDataIn = require("../data/collection-data-in");
const collectionDataOut = require("../data/collection-data-out");

// 공용 변수들을 여기에 정의
let req, res, next; // beforeEach 밖에서도 사용하기 위해 여기에 선언
beforeEach(() => {
  req = httpMocks.createRequest(); // 빈 리퀘스트 객체 생성
  res = httpMocks.createResponse(); // 빈 리스폰스 객체 생성
  next = jest.fn(); // next는 특별한 기능이 없으나, 데이터 수집을 위해 mock 함수로 생성
});

// 검증 시작w
describe("CollectionsService 클래스 테스트", () => {
  describe("getAllCollectionsByUserId 메소드 테스트", () => {
    beforeEach(() => {
      // getAllCollectionsByUserId 메소드안에서 사용할 메소드 mocking
      collectionsService.collectionRepository.getAllCollectionsByUserId =
        jest.fn();

      // mock함수로 정의된 collectionsService.getAllCollectionsByUserId
      // 본 테스터 안에서 호출되는 collectionsService의 getAllCollectionsByUserId는 항상 collectionDataOut.getCollectionRes.data값을 리턴하기로 함
      collectionsService.collectionRepository.getAllCollectionsByUserId.mockReturnValue(
        collectionDataOut.getCollectionRes.data
      );
    });
    // status-code가 200번일 것이다 예상
    test("기능: 받아온 데이터를 받아 200번의 status-code를 응답해야 한다.", async () => {
      await collectionsService.getAllCollectionsByUserId(req, res, next);
      expect(res.statusCode).toBe(200);
    });
    test("기능: 받아온 데이터는 특정 형태로 응답하여 명세서에 맞춰야 한다.", async () => {
      await collectionsService.getAllCollectionsByUserId(req, res, next);
      expect(res._getJsonData()).toStrictEqual(
        collectionDataOut.getCollectionRes
      ); // 일반적인 Equal 보다는 훨씬 엄격한 Equal라서 기존과는 다르게 특정 요소에 undefined가 나오는 것을 허용하지 않음.
    });
    test("예외처리: 받아온 데이터가 빈 배열일 경우에도 빈 배열을 리턴한다.", async () => {
      collectionsService.collectionRepository.getAllCollectionsByUserId.mockReturnValue(
        []
      ); // 저장소의 getAllPosts는 항상 빈 배열을 주기로 했을 때
      const resultData = await collectionsService.getAllCollectionsByUserId();
      // 서비스가 리턴한 resultData을 아래와 같이 검증한다.
      expect(resultData).toMatchObject([]); // toBe 가 아니라 toMatchObject를 쓰는 이유 : Array는 참조형이기 때문 _ ex. [] === [] : false
    });
  });

  describe("getAllCollectionsByCategoryId 메소드 테스트", () => {
    beforeEach(async () => {
      // getAllCollectionsByCategoryId 메소드안에서 사용할 메소드 mocking
      collectionsService.getAllCollectionsByCategoryId = jest.fn();

      // mock함수로 정의된 collectionsService.getAllCollectionsByUserId
      // 본 테스터 안에서 호출되는 collectionsService의 getAllCollectionsByUserId는 항상 collectionDataOut.getCollectionRes.data값을 리턴하기로 함
      collectionsService.getAllCollectionsByCategoryId.mockReturnValue(
        collectionDataOut.getCollectionRes.data
      );
    });
    // status-code가 200번일 것이다 예상
    test("기능: 받아온 데이터를 받아 200번의 status-code를 응답해야 한다.", async () => {
      await collectionsService.getAllCollectionsByCategoryId(req, res, next);
      expect(res.statusCode).toBe(200);
    });
    test("기능: 받아온 데이터는 특정 형태로 응답하여 명세서에 맞춰야 한다.", async () => {
      await collectionsService.getAllCollectionsByCategoryId(req, res, next);
      expect(res._getJsonData()).toStrictEqual(
        collectionDataOut.getCollectionRes
      );
    });
    test("예외처리: 받아온 데이터가 빈 배열일 경우에도 빈 배열을 리턴한다.", async () => {
      collectionsService.collectionRepository.getAllCollectionsByCategoryId.mockReturnValue(
        []
      ); // 저장소의 getAllPosts는 항상 빈 배열을 주기로 했을 때
      const resultData =
        await collectionsService.getAllCollectionsByCategoryId();
      // 서비스가 리턴한 resultData을 아래와 같이 검증한다.
      expect(resultData).toMatchObject([]); // toBe 가 아니라 toMatchObject를 쓰는 이유 : Array는 참조형이기 때문 _ ex. [] === [] : false
    });
  });

  describe("getCollection 메소드 테스트", () => {
    beforeEach(async () => {
      // getCollection 메소드안에서 사용할 메소드 mocking
      collectionsService.getCollection = jest.fn();

      // mock함수로 정의된 collectionsService.getAllCollectionsByUserId
      // 본 테스터 안에서 호출되는 collectionsService의 getAllCollectionsByUserId는 항상 collectionDataOut.getCollectionRes.data값을 리턴하기로 함
      collectionsService.getCollection.mockReturnValue(
        collectionDataOut.getCollectionRes.data
      );
    });
    // status-code가 200번일 것이다 예상
    test("기능: 받아온 데이터를 받아 200번의 status-code를 응답해야 한다.", async () => {
      await collectionsService.getCollection(req, res, next);
      expect(res.statusCode).toBe(200);
    });
    test("기능: 받아온 데이터는 특정 형태로 응답하여 명세서에 맞춰야 한다.", async () => {
      await collectionsService.getCollection(req, res, next);
      expect(res._getJsonData()).toStrictEqual(
        collectionDataOut.getCollectionRes
      );
    });
  });

  describe("createCollection 메소드 테스트", () => {
    beforeEach(async () => {
      // getCollection 메소드안에서 사용할 메소드 mocking
      collectionsService.createCollection = jest.fn();

      // mock함수로 정의된 collectionsService.getAllCollectionsByUserId
      // 본 테스터 안에서 호출되는 collectionsService의 getAllCollectionsByUserId는 항상 collectionDataOut.getCollectionRes.data값을 리턴하기로 함
      collectionsService.createCollection.mockReturnValue(
        collectionDataOut.getCollectionRes.data
      );
    });
    // status-code가 200번일 것이다 예상
    test("기능: 받아온 데이터를 받아 200번의 status-code를 응답해야 한다.", async () => {
      await collectionsService.createCollection(req, res, next);
      expect(res.statusCode).toBe(200);
    });
    test("기능: 받아온 데이터는 특정 형태로 응답하여 명세서에 맞춰야 한다.", async () => {
      await collectionsService.createCollection(req, res, next);
      expect(res._getJsonData()).toStrictEqual(
        collectionDataOut.getCollectionRes
      );
    });
  });
});
