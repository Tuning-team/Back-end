// 테스트할 클래스&인스턴스
const CollectionsService = require("../../b_services/collections.service");
const collectionsService = new CollectionsService();
const CollectionRepository = require("../../c_repositories/collections.repository");
const collectionRepository = new CollectionRepository();

// 필요 모델, 모듈, 데이터
const httpMocks = require("node-mocks-http");
const collectionDataIn = require("../data/collection-data-in");

let req, res, next; // beforeEach 밖에서도 사용하기 위해 여기에 선언
beforeEach(() => {
  req = httpMocks.createRequest(); // 빈 리퀘스트 객체 생성
  res = httpMocks.createResponse(); // 빈 리스폰스 객체 생성
  next = jest.fn(); // next는 특별한 기능이 없으나, 데이터 수집을 위해 mock 함수로 생성
});

describe("CollectionsServices", () => {
  beforeEach(() => {});

  it("정상 상황에 대한 테스트 ", async () => {
    // 변수

    // 테스트할 메소드

    // 결과값, 함수를 실행시키면서 기록한 정보?
    expect(1).toBe(1);
  });
});
