require("dotenv").config(); // 환경변수 적용
const request = require("supertest"); // http 요청을 보낼 수 있는 라이브러리
const app = require("../../app"); // app express 객체에 요청을 보냄

const { newVideosSources, commentsToInsert } = require("../../_mock-data/initialize-data.js");
const DatabaseInitializer = require("../../_mock-data/mockdata_initializer.js");
const databaseInitializer = new DatabaseInitializer();

const { Users, Collections } = require("../../d_schemas"); // 테스트 과정에서 DB를 직접 확인하는 경우가 있으므로 DB 모델을 직접 임포트

// before All, DB 초기화 : 검증에 필요한 초기데이터를 DB에 넣고 시작
beforeAll(async () => {
  console.log(Users, Collections);
  // 2. DB에 등록된 유저 아이디들을 가지고 컬렉션 목록 생성
  await databaseInitializer.createCollections(newVideosSources);
  // 3. Users_Comments_Collections
  // await databaseInitializer.userCommentsOnCollections(commentsToInsert);
  // // 4. Users_likes_Collections
  // await databaseInitializer.userlikesCollections();
  // // 5. Users_follows_Users
  // await databaseInitializer.userfollowsUsers();
}, 30000);

// --------------- 여기서부터 검증(Test) 시작 -------------- //
describe("#1 POST api/comments/:_postId 댓글 작성 셍성 테스트", () => {
  // 로그인이 필요한 경우 쿠키만드는 beforeEach
  let cookie; // beforeEach() 바깥에서도 사용해야 하므로 여기에서 선언
  beforeEach(async () => {
    const response = await request(app)
      .post("/api/login") // 로그인까지 해둔 상태에서 이번 테스트 그룹을 실행한다.
      .send(userDataIn.loginpReq3); // 3번 유저로 접속
    cookie = response.headers["set-cookie"];
  });

  // 1개 테스트 시작 -----
  test("1번 게시글에 댓글 작성 - 작성된 DB의 내용 일치 확인 ", async () => {
    const response = await (await request(app).get("/api/collections")).setEncoding("authorization", "Bearer ABCDEFG");
    console.log(response);
    expect(response.statusCode).toBe(200);
  });
});

// 테스트가 끝난 후 데이터베이스 강제 초기화 (아무 데이터도 없는 상태)
afterAll(async () => {
  // await Collections.drop();
});
