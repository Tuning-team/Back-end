require("dotenv").config(); // 환경변수 적용
const request = require("supertest"); // http 요청을 보낼 수 있는 라이브러리
const app = require("../../app"); // app express 객체에 요청을 보냄

const {
  newVideosSources,
  commentsToInsert,
  createCollection,
  addvideos,
} = require("../../_mock-data/initialize-data_forTest.js");
const DatabaseInitializer = require("../../_mock-data/mockdata_initializer.js");
const databaseInitializer = new DatabaseInitializer();

const Collections = require("../../d_schemas/collection");
const Comments = require("../../d_schemas/comment");
const Videos = require("../../d_schemas/video");
const Users = require("../../d_schemas/user");
const authorizationCode =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc0xvZ2luIjp0cnVlLCJ1c2VyX2lkIjoiNjMyOTk0MDhmZDFkNmMyYWM0MWQ2NGM1IiwiaWF0IjoxNjYzODMxMzA5LCJleHAiOjE2NjM5MTc3MDl9.8jHH1MKclb1pW0vuvbbynM_47EQlrDsMbXqbk8Xd8pw";

// before All, DB 초기화 : 검증에 필요한 초기데이터를 DB에 넣고 시작
beforeAll(async () => {
  // 2. DB에 등록된 유저 아이디들을 가지고 컬렉션 목록 생성
  await databaseInitializer.createCollections(newVideosSources);
  // 3. Users_Comments_Collections
  await databaseInitializer.userCommentsOnCollections(commentsToInsert);
  // 4. Users_likes_Collections
  await databaseInitializer.userlikesCollections();
  // 5. Users_follows_Users
  await databaseInitializer.userfollowsUsers();
  // 6.
  await request(app).post("/api/collections").set("authorization", authorizationCode).send(createCollection); // postId : 1을 부여받음
}, 500000);

// --------------- 여기서부터 검증(Test) 시작 -------------- //
describe("#1 /api/collections 컬렉션 테스트", () => {
  beforeEach(async () => {});

  it("1	GET	/api/categories 카테고리 리스트 조회 테스트", async () => {
    const response = await request(app).get("/api/categories");
    expect(response.statusCode).toBe(200);
  });

  it("2	POST /api/collections 컬렉션 생성 테스트", async () => {
    const response = await request(app).post("/api/collections").set("authorization", authorizationCode).send(createCollection);
    console.log("createCollection", createCollection);
    expect(response.statusCode).toEqual(201);

    const collectionInfo = await Collections.findOne({
      title: createCollection.collectionTitle,
    });
    expect(collectionInfo).toBeTruthy();
  });

  it("3	GET	/api/collections/:collection_id 컬렉션 상세조회 테스트", async () => {
    const response = await request(app).get("/api/collections/632b1bd8cb2ecb2661cd33e0");
    expect(response.statusCode).toBe(200);
  });

  it("4	DELETE /api/collections/:collection_id 컬렉션 삭제 테스트", async () => {
    const response = await request(app)
      .delete("/api/collections/632b1bd8cb2ecb2661cd33e0")
      .set("authorization", authorizationCode);
    expect(response.statusCode).toBe(200);
  });

  it("5	PUT	/api/collections/:collection_id 컬렉션에 영상 추가 테스트", async () => {
    const response = await request(app)
      .put("/api/collections/632b1bd8cb2ecb2661cd33e0")
      .set("authorization", authorizationCode)
      .send(addvideos);
    expect(response.statusCode).toBe(200);

    const addvideos = await Collections.findOne({
      _id: "632b1bd8cb2ecb2661cd33e0",
    });
  });

  it("6-1	PUT	/api/collections/like/:collection_id 컬렉션 좋아요 테스트", async () => {
    await request(app).put("/api/collections/like/632b1bd8cb2ecb2661cd33e0").set("authorization", authorizationCode);

    const { likedCollectionsArr } = await Users.findOne({
      _id: "63299408fd1d6c2ac41d64c5",
    });
    const { likes } = await Collections.findOne({
      _id: "632b1bd8cb2ecb2661cd33e0",
    });

    expect(likedCollectionsArr).toMatchObject(["63299408fd1d6c2ac41d64c5"]);
    expect(likes).toStrictEqual(1);
  });

  it("6-2	PUT	/api/collections/like/:collection_id 컬렉션 좋아요 취소 테스트", async () => {
    await request(app).put("/api/collections/like/632b1bd8cb2ecb2661cd33e0").set("authorization", authorizationCode);

    const { likedCollectionsArr } = await Users.findOne({
      _id: "63299408fd1d6c2ac41d64c5",
    });
    const { likes } = await Collections.findOne({
      _id: "632b1bd8cb2ecb2661cd33e0",
    });

    expect(likedCollectionsArr).toMatchObject([""]);
    expect(likes).toStrictEqual(0);
  });

  it("7-1	GET	/api/collections/mylikes?offset=0&limit=3 내가 좋아한 컬렉션 조회 테스트", async () => {
    const response = await request(app).get("/api/collections/mylikes?offset=0&limit=3").set("authorization", authorizationCode);
    expect(response.statusCode).toBe(200);
  });

  it("7-2	GET	/api/collections/mykeeps?offset=0&limit=3 내가 담은 컬렉션 조회 테스트", async () => {
    const response = await request(app).get("/api/collections/mykeeps?offset=0&limit=3").set("authorization", authorizationCode);
    expect(response.statusCode).toBe(200);
  });

  it("7-3	GET	/api/collections/mine?offset=0&limit=3 내가 모은 컬렉션 조회 테스트", async () => {
    const response = await request(app).get("/api/collections/mine?offset=0&limit=3").set("authorization", authorizationCode);
    expect(response.statusCode).toBe(200);
  });

  it("8	GET	/api/collections?category_id=####&offset=0&limit=3 카테고리에 포함된 컬렉션 리스트 조회 테스트", async () => {
    const response = await request(app).get("/api/collections?category_id=6319aeebd1e330e86bbade7c&offset=0&limit=3");
    expect(response.statusCode).toBe(200);
  });

  it("9	GET	/api/collections?keyword=검색어&offset=0&limit=3 검색어에 맞는 컬렉션 리스트 조회 테스트", async () => {
    const response = await request(app).get("/api/collections?keyword=음악&offset=0&limit=3");
    expect(response.statusCode).toBe(200);
  });
});

// 테스트가 끝난 후 데이터베이스 강제 초기화 (아무 데이터도 없는 상태로 만들기)
afterAll(async () => {
  await Collections.remove().catch((err) => console.log(err));
  await Comments.remove().catch((err) => console.log(err));
  await Videos.remove().catch((err) => console.log(err));

  const users = await Users.find();
  const user_ids = users.map((e) => e._id);
  for (let i = 0; i < user_ids.length; i++) {
    await Users.findOneAndUpdate(
      { _id: user_ids[i] },
      {
        $set: {
          myCollections: [],
          myKeepingCollections: [],
          myLikingCollections: [],
          myInterestingCategories: [],
          followings: [],
        },
      }
    );
  }
});
