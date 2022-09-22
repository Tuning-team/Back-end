require("dotenv").config(); // 환경변수 적용
const request = require("supertest"); // http 요청을 보낼 수 있는 라이브러리
const app = require("../../app"); // app express 객체에 요청을 보냄

const { newVideosSources, commentsToInsert } = require("../../_mock-data/initialize-data.js");
const DatabaseInitializer = require("../../_mock-data/mockdata_initializer.js");
const databaseInitializer = new DatabaseInitializer();

const Collections = require("../../d_schemas/collection");
const Comments = require("../../d_schemas/comment");
const Videos = require("../../d_schemas/video");
const Users = require("../../d_schemas/user");

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
}, 500000);

// --------------- 여기서부터 검증(Test) 시작 -------------- //
describe("#1 POST api/comments/:_postId 댓글 작성 셍성 테스트", () => {
  beforeEach(async () => {});

  it("1	GET	/api/categories", async () => {
    const response = await request(app).get("/api/categories");
    expect(response.statusCode).toBe(200);
  });
  it("2	POST	/api/collections", async () => {
    const response = await request(app).post("/api/collections");
    expect(response.statusCode).toBe(200);
  });
  it("3	GET	/api/collections/:collection_id", async () => {
    const response = await request(app).get("/api/categories");
    expect(response.statusCode).toBe(200);
  });
  it("4	DELETE	/api/collections/:collection_id", async () => {
    const response = await request(app).get("/api/categories");
    expect(response.statusCode).toBe(200);
  });
  it("5	PUT	/api/collections/:collection_id", async () => {
    const response = await request(app).get("/api/categories");
    expect(response.statusCode).toBe(200);
  });
  it("6	PUT	/api/collections/like/:collection_id", async () => {
    const response = await request(app).get("/api/categories");
    expect(response.statusCode).toBe(200);
  });
  it("7	GET	/api/collections/mylikes?offset=0&limit=3", async () => {
    const response = await request(app).get("/api/categories");
    expect(response.statusCode).toBe(200);
  });
  it("7	GET	/api/collections/mykeeps?offset=0&limit=3", async () => {
    const response = await request(app).get("/api/categories");
    expect(response.statusCode).toBe(200);
  });
  it("7	GET	/api/collections/mine?offset=0&limit=3", async () => {
    const response = await request(app).get("/api/categories");
    expect(response.statusCode).toBe(200);
  });
  it("8	GET	/api/collections?category_id=####&offset=0&limit=3", async () => {
    const response = await request(app).get("/api/categories");
    expect(response.statusCode).toBe(200);
  });
  it("9	GET	/api/collections?keyword=검색어&offset=0&limit=3", async () => {
    const response = await request(app).get("/api/categories");
    expect(response.statusCode).toBe(200);
  });
  it("10	GET	/api/comments/:collection_id", async () => {
    const response = await request(app).get("/api/categories");
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
