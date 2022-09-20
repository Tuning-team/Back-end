// 테스트할 클래스&인스턴스
const CollectionsService = require("../../b_services/collections.service");
const collectionsService = new CollectionsService();
const CollectionRepository = require("../../c_repositories/collections.repository");
const collectionRepository = new CollectionRepository();

// 필요 모델, 모듈
const Collection = require("../../d_schemas/collection");
const httpMocks = require("node-mocks-http");

// Mock Data
const collectionDataIn = require("../data/collection-data-in");
const collectionDataOut = require("../data/collection-data-out");

let req, res, next; // beforeEach 밖에서도 사용하기 위해 여기에 선언
beforeEach(() => {
  req = httpMocks.createRequest(); // 빈 리퀘스트 객체 생성
  res = httpMocks.createResponse(); // 빈 리스폰스 객체 생성
  next = jest.fn(); // next는 특별한 기능이 없으나, 데이터 수집을 위해 mock 함수로 생성
});

describe("CollectionsServices", () => {
  let repo, user_id;
  beforeEach(() => {
    repo = collectionsService.collectionRepository;
  });
  describe("getAllCollectionsByUserId 메소드 테스트", () => {
    beforeEach(() => {
      repo.getAllCollectionsByUserIdWithPaging = jest.fn();
      repo.getAllCollectionsByUserIdWithPaging.mockReturnValue({
        userDataAll: [
          {
            _id: "63291a43dcc97f368cc4ff06",
            category_id: "6319aeebd1e330e86bbade95",
            category_title: "오늘처럼 맑은 날 보기 좋은",
            collectionTitle: "코미디 영상 모음",
            description: "코미디 영상을 모아봤어요. 너무너무 좋아요",
            videos: [
              "63291a43dcc97f368cc4ff04",
              "63291a43dcc97f368cc4fefc",
              "63291a43dcc97f368cc4fef8",
              "63291a43dcc97f368cc4ff02",
              "63291a43dcc97f368cc4fefa",
              "63291a43dcc97f368cc4ff00",
              "63291a43dcc97f368cc4fefe",
            ],
            thumbnails: [
              "https://i.ytimg.com/vi/5m0pve4u4O8/mqdefault.jpg",
              "https://i.ytimg.com/vi/vng5n5HaCik/mqdefault.jpg",
              "https://i.ytimg.com/vi/CHiTd4O75g0/mqdefault.jpg",
              "https://i.ytimg.com/vi/7k37KQROx0k/mqdefault.jpg",
              "https://i.ytimg.com/vi/hVakguLDLfw/mqdefault.jpg",
              "https://i.ytimg.com/vi/C1gObjWwib0/mqdefault.jpg",
              "https://i.ytimg.com/vi/pJ_xADOtEOo/mqdefault.jpg",
            ],
            commentNum: 3,
            likes: 3,
            createdAt: "2022-09-20T01:41:23.943Z",
          },
          {
            _id: "63291a43dcc97f368cc4ff06",
            category_id: "6319aeebd1e330e86bbade95",
            category_title: "오늘처럼 맑은 날 보기 좋은",
            collectionTitle: "코미디 영상 모음",
            description: "코미디 영상을 모아봤어요. 너무너무 좋아요",
            videos: [
              "63291a43dcc97f368cc4ff04",
              "63291a43dcc97f368cc4fefc",
              "63291a43dcc97f368cc4fef8",
              "63291a43dcc97f368cc4ff02",
              "63291a43dcc97f368cc4fefa",
              "63291a43dcc97f368cc4ff00",
              "63291a43dcc97f368cc4fefe",
            ],
            thumbnails: [
              "https://i.ytimg.com/vi/5m0pve4u4O8/mqdefault.jpg",
              "https://i.ytimg.com/vi/vng5n5HaCik/mqdefault.jpg",
              "https://i.ytimg.com/vi/CHiTd4O75g0/mqdefault.jpg",
              "https://i.ytimg.com/vi/7k37KQROx0k/mqdefault.jpg",
              "https://i.ytimg.com/vi/hVakguLDLfw/mqdefault.jpg",
              "https://i.ytimg.com/vi/C1gObjWwib0/mqdefault.jpg",
              "https://i.ytimg.com/vi/pJ_xADOtEOo/mqdefault.jpg",
            ],
            commentNum: 3,
            likes: 3,
            createdAt: "2022-09-20T01:41:23.943Z",
          },
          {
            _id: "63291a43dcc97f368cc4ff06",
            category_id: "6319aeebd1e330e86bbade95",
            category_title: "오늘처럼 맑은 날 보기 좋은",
            collectionTitle: "코미디 영상 모음",
            description: "코미디 영상을 모아봤어요. 너무너무 좋아요",
            videos: [
              "63291a43dcc97f368cc4ff04",
              "63291a43dcc97f368cc4fefc",
              "63291a43dcc97f368cc4fef8",
              "63291a43dcc97f368cc4ff02",
              "63291a43dcc97f368cc4fefa",
              "63291a43dcc97f368cc4ff00",
              "63291a43dcc97f368cc4fefe",
            ],
            thumbnails: [
              "https://i.ytimg.com/vi/5m0pve4u4O8/mqdefault.jpg",
              "https://i.ytimg.com/vi/vng5n5HaCik/mqdefault.jpg",
              "https://i.ytimg.com/vi/CHiTd4O75g0/mqdefault.jpg",
              "https://i.ytimg.com/vi/7k37KQROx0k/mqdefault.jpg",
              "https://i.ytimg.com/vi/hVakguLDLfw/mqdefault.jpg",
              "https://i.ytimg.com/vi/C1gObjWwib0/mqdefault.jpg",
              "https://i.ytimg.com/vi/pJ_xADOtEOo/mqdefault.jpg",
            ],
            commentNum: 3,
            likes: 3,
            createdAt: "2022-09-20T01:41:23.943Z",
          },
        ],
        totalContents: 50,
        hasNext: true,
      });
      user_id = "6329192569d8145d2cb49b6b";
    });

    it("받아온 데이터를 받아 200번의 status-code를 응답해야 한다.", async () => {
      req.query = { offset: 0, limit: 3 };
      await collectionsService.getAllCollectionsByUserId(req, res, next);
      expect(res.data.success).toBe(true);
    });
  });
});
