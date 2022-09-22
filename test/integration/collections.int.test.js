require("dotenv").config(); // 환경변수 적용
const request = require("supertest"); // http 요청을 보낼 수 있는 라이브러리
const app = require("../../app"); // app express 객체에 요청을 보냄

const { newVideosSources, commentsToInsert } = require("../../_mock-data/initialize-data_forTest.js");
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
}, 500000);

// --------------- 여기서부터 검증(Test) 시작 -------------- //
describe("#1 POST api/comments/:_postId 댓글 작성 셍성 테스트", () => {
  beforeEach(async () => {});

  // it("1	GET	/api/categories", async () => {
  //   const response = await request(app).get("/api/categories");
  //   expect(response.statusCode).toBe(200);
  // });
  // it("2	POST	/api/collections", async () => {
  //   const response = await request(app).post("/api/collections");
  //   expect(response.statusCode).toBe(200);
  // });
  // it("3	GET	/api/collections/:collection_id", async () => {
  //   const response = await request(app).get("/api/categories");
  //   expect(response.statusCode).toBe(200);
  // });
  // it("4	DELETE	/api/collections/:collection_id", async () => {
  //   const response = await request(app).get("/api/categories");
  //   expect(response.statusCode).toBe(200);
  // });
  // it("5	PUT	/api/collections/:collection_id", async () => {
  //   const response = await request(app).get("/api/categories");
  //   expect(response.statusCode).toBe(200);
  // });
  // it("6	PUT	/api/collections/like/:collection_id", async () => {
  //   const response = await request(app).get("/api/categories");
  //   expect(response.statusCode).toBe(200);
  // });
  // it("7	GET	/api/collections/mylikes?offset=0&limit=3", async () => {
  //   const response = await request(app).get("/api/categories");
  //   expect(response.statusCode).toBe(200);
  // });
  // it("7	GET	/api/collections/mykeeps?offset=0&limit=3", async () => {
  //   const response = await request(app).get("/api/categories");
  //   expect(response.statusCode).toBe(200);
  // });
  // it("7	GET	/api/collections/mine?offset=0&limit=3", async () => {
  //   const response = await request(app).get("/api/categories");
  //   expect(response.statusCode).toBe(200);
  // });
  // it("8	GET	/api/collections?category_id=####&offset=0&limit=3", async () => {
  //   const response = await request(app).get("/api/categories");
  //   expect(response.statusCode).toBe(200);
  // });
  // it("9	GET	/api/collections?keyword=검색어&offset=0&limit=3", async () => {
  //   const response = await request(app).get("/api/categories");
  //   expect(response.statusCode).toBe(200);
  // });
  it("10	GET	/api/comments/:collection_id", async () => {
    const response = await request(app).get("/api/comments/:collection_id")    
    expect(response.statusCode).toBe(200);
  });
  it("11 POST /api/comments/:collection_id", async () => {        
    const response = await request(app)
    .get("/api/comments/:collection_id").set("authorization", authorizationCode)
    .send(commentsToInsert)    
    expect(response.statusCode).toBe(200);
  });
  it("12 PUT /api/comments/:comment_id", async () => {
    res.locals.user_id ="63299408fd1d6c2ac41d64c5"
    req.body = {
      "comment" : "레알 진짜 짱 좋아요 짱짱짱 !"
      }
    const response = await request(app).get("/api/comments/:comment_id").set("authorization", authorizationCode)    
    expect(response.statusCode).toBe(200);
  });
  it("13 DELETE	/api/comments/:comment_id", async () => {
    res.locals.user_id ="63299408fd1d6c2ac41d64c5"
    const response = await request(app).get("/api/comments/:comment_id").set("authorization", authorizationCode)    
    expect(response.statusCode).toBe(200);
  });
  // it("14 GET /api/search/videos/db?keyword=", async () => {
  //   const response = await request(app).get("/api/search/videos/db?keyword=");
  //   expect(response.statusCode).toBe(200);
  // });
  // it("15 GET /api/search/videos/youtube?keyword=", async () => {
  //   const response = await request(app).get("/api/search/videos/youtube?keyword=");
  //   expect(response.statusCode).toBe(200);
  // });
  it("16 GET /api/user", async () => {
    res.locals.user_id ="63299408fd1d6c2ac41d64c5"
    const response = await request(app).get("/api/user").set("authorization", authorizationCode)    
    expect(response.statusCode).toBe(200);
  });
  it("17 GET /api/user/:user_id", async () => {
    const response = await request(app).get("/api/user/:user_id");
    expect(response.statusCode).toBe(200);
  });
  it("18 GET /api/videos/:collection_id", async () => {
    const response = await request(app).get("/api/videos/:collection_id");
    expect(response.statusCode).toBe(200);
  });
  it("19 GET /api/videos/detail/:video_id", async () => {
    const response = await request(app).get("/api/videos/detail/:video_id");
    expect(response.statusCode).toBe(200);
  });
  // it("20 GET /api/comments/:collection_id", async () => {
  //   const response = await request(app).get("/api/comments/:collection_id");
  //   expect(response.statusCode).toBe(200);
  // });
  // it("21 GET https://i.ytimg.com/vi/${유튜브 영상ID}/default.jpg", async () => {
  //   const response = await request(app).get("/https://i.ytimg.com/vi/${유튜브 영상ID}/default.jpg");
  //   expect(response.statusCode).toBe(200);
  // });
  // it("22 POST /api/videos/add/KefKOFGy5I0,Lux8xJMQH-k", async () => {
  //   const response = await request(app).get("/api/videos/add/KefKOFGy5I0,Lux8xJMQH-k");
  //   expect(response.statusCode).toBe(200);
  // });
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
