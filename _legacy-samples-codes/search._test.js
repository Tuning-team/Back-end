// 테스트할 SearchService 클래스 import 후 인스턴스 생성
const SearchService = require("../../b_services/search.Service");
const searchService = new SearchService();

// req, res, next 가상 객체를 생성해주는 모듈 import
const httpMocks = require("node-mocks-http");
const { videoSampleDataFromDB } = require("../test-data/videoSearchTestData");

// 공용 변수들을 여기에 정의
let req, res, next;
beforeEach(() => {
  req = httpMocks.createRequest(); // 빈 리퀘스트 객체 생성
  res = httpMocks.createResponse(); // 빈 리스폰스 객체 생성
  next = jest.fn();
});

describe("SearchService 계층 메소드의 기능 테스트", () => {
  beforeEach(() => {
    // SearchService 전체적으로 사용할 임의정보들을 정의한다.
    req.query.keyword = "운동";
  });
  describe("메소드 videoSearchViaDB 테스트", () => {
    beforeEach(() => {
      // videoSearchViaDB 메소드안에서 사용할 하위 메소드들은 mock 함수로 정의한다.
      searchService.videosSearchRepository.getVideoSearchByKeyword = jest.fn();
      searchService.videosSearchRepository.getVideoSearchByKeyword.mockReturnValue(
        videoSampleDataFromDB
      );
    });

    test("기능테스트 : 제시된 예시데이터 기준으로 1개 이상 발견되어야 한다.  ", async () => {
      // 테스트를 하고 있는 메소드를 둘러싼 이상적인 환경이 아래와 같다고 치자.
      // 이 정상적인 상태에서 메소드를 호출하면
      await searchService.videoSearchViaDB(req, res);

      // 이러한 결과들을 expect 한다.
      expect(res.statusCode).toBe(200);
    });
  });
  describe("메소드 videoSearchViaYoutube 테스트", () => {
    beforeEach(() => {
      // getMyCollections 메소드안에서 사용할 하위 메소드들은 mock 함수로 정의한다.
      searchService.videosSearchRepository.getVideoSearchByKeyword = jest.fn();
      searchService.videosSearchRepository.getVideoSearchByKeyword.mockReturnValue(
        videoSampleDataFromDB
      );
    });

    test("기능테스트 : 제시된 예시데이터 기준으로 1개 이상 발견되어야 한다.  ", async () => {
      // 테스트를 하고 있는 메소드를 둘러싼 이상적인 환경이 아래와 같다고 치자.
      // 이 정상적인 상태에서 메소드를 호출하면
      await searchService.videoSearchViaYoutube(req, res);

      // 이러한 결과들을 expect 한다.
      expect(res.statusCode).toBe(200);
    });
  });
});
