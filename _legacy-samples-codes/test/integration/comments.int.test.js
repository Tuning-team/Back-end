const request = require("supertest"); // http 요청을 보낼 수 있는 라이브러리
const app = require("../../app"); // app express 객체에 요청을 보냄
const { sequelize } = require("../../models"); // DB를 초기화하는 데에 sequelize 객체를 사용
const { Comment, Post } = require("../../models"); // 테스트 과정에서 DB를 직접 확인하는 경우가 있으므로 DB 모델을 직접 임포트

const userDataIn = require("../data/user-data-in.js"); // 받아올 mock 데이터 객체 (경로.js에 있는 정보를 모두 담고 있음)
const commentDataIn = require("../data/comment-data-in.js"); // 받아올 mock 데이터 (경로.js에 있는 정보를 모두 담고 있음)
const postDataIn = require("../data/post-data-in.js"); // 받아올 mock 데이터 (경로.js에 있는 정보를 모두 담고 있음)

// before All, DB 초기화 : 검증에 필요한 초기데이터를 DB에 넣고 시작
beforeAll(async () => {
  await sequelize.sync();

  // 테스트를 위한 몇개의 포스팅을 DB에 미리 만들어두는 작업

  // 2명의 회원가입 -------------
  await request(app).post("/api/signup").send(userDataIn.signUpReq1);
  await request(app).post("/api/signup").send(userDataIn.signUpReq3);

  // 위 2명 각각 로그인 ---------------
  const response1 = await request(app)
    .post("/api/login")
    .send(userDataIn.loginpReq1);
  cookie_1 = response1.headers["set-cookie"];

  const response3 = await request(app)
    .post("/api/login")
    .send(userDataIn.loginpReq3);
  cookie_3 = response3.headers["set-cookie"];

  // 게시글 각 3개 작성 -----------------
  await request(app)
    .post("/api/posts")
    .set("Cookie", cookie_1)
    .send(postDataIn.sampleBaseReq_1);

  await request(app)
    .post("/api/posts")
    .set("Cookie", cookie_1)
    .send(postDataIn.sampleBaseReq_2);

  await request(app)
    .post("/api/posts")
    .set("Cookie", cookie_3)
    .send(postDataIn.sampleBaseReq_3);

  // 댓글 3개 작성 (1번에 2개, 3번에 1개 댓글 작성) ------------------
  await request(app).post("/api/comments/1").set("Cookie", cookie_1).send({
    comment: "안녕하세요 댓글입니다~~.",
  }); // 1번 유저가 1번 게시글에 게시한 1번 댓글

  await request(app).post("/api/comments/1").set("Cookie", cookie_1).send({
    comment: "안녕하세요 댓글입니다~~.",
  }); // 1번 유저가 1번 게시글에 게시한 2번 댓글

  await request(app).post("/api/comments/3").set("Cookie", cookie_3).send({
    comment: "안녕하세요 댓글입니다~~.",
  }); // 3번 유저가 3번 게시글에 게시한 3번 댓글
});

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
    const response = await request(app)
      .post("/api/comments/1")
      .set("Cookie", cookie)
      .send(commentDataIn.createCommentReq);

    // API에 요청하여 받은 응답이 201코드이면 정상 작동한 것
    expect(response.statusCode).toBe(201);

    // db에 잘 들어갔는지 확인
    const commentInfo = await Comment.findOne({
      where: {
        comment: "안녕하세요 이번에 1번 게시글에 새로 작성한 댓글입니다.",
      },
    });

    // DB에 들어간 데이터가 실제로 있는지(Truthy) 확인한다.
    expect(commentInfo).toBeTruthy();
  });
});

describe("#2 GET /api/comments/:_postId 댓글 모두 조회", () => {
  // 1개 테스트 시작-----
  test("1번 게시글의 댓글 모두 조회", async () => {
    // API에 요청하여 200번 코드를 받으면 정상처리된 것
    const response = await request(app).get("/api/comments/1");
    expect(response.statusCode).toBe(200); // 정상 응답
  });
});

describe("#3 PUT /api/comments/:_commentId 특정 댓글 수정", () => {
  // 로그인이 필요한 경우 쿠키만드는 beforeEach
  let cookie; // beforeEach() 바깥에서도 사용해야 하므로 여기에서 선언
  beforeEach(async () => {
    // login 과정에서 사용할 로그인할 유저의 정보를 db에 미리 담아둠 (매번 초기화되기 때문에)
    const response = await request(app)
      .post("/api/login")
      .send(userDataIn.loginpReq1); // 1번 댓글을 작성한 Tester1로 로그인 (user "Tester1")
    cookie = response.headers["set-cookie"]; // cookie라는 변수에 저장하여 각 테스트에서 요청에 활용
  });

  // 3가지 테스트 시작 ------
  test("로그인한 글쓴이가 자기가 작성한 1번 게시글 수정 시도 - 정상처리 되어야 함 ", async () => {
    const response = await request(app)
      .put("/api/comments/1")
      .set("Cookie", cookie) // beforeEach에서 확보한 쿠키를 요청에 함께 전달 (user "Tester1")
      .send(commentDataIn.updateCommentReq); // 수정 데이터 (comment) 전달
    expect(response.statusCode).toBe(201); // 정상 응답되어야 함

    // db에 잘 수정되었는지 1번 댓글 확인
    const commentInfo = await Comment.findOne({
      where: { _id: 1 },
    });

    // DB 정보가 수정 되었으면 1번 댓글이 이렇게 바뀌어 있어야 함
    expect(commentInfo.comment).toStrictEqual("수정된 댓글입니다.");
  });

  test("글쓴이가 아닌 유저가 특정 댓글(직접 작성하지 않은 3번 댓글) 수정 시도", async () => {
    // Tester1가 작성하지 않은 3번 댓글 수정 시도
    const response = await request(app)
      .put("/api/comments/3")
      .set("Cookie", cookie) // beforeEach에서 확보한 쿠키를 요청에 함께 전달 (user "Tester1")
      .send(commentDataIn.updateCommentReq); // 수정할 정보 (comment)
    expect(response.statusCode).toBe(400); // 400번대로 반려되어야 정상
  });

  test("로그인 하지 않고 게시글 수정 시도", async () => {
    const response = await request(app)
      .put("/api/comments/3")
      // 전달되는 쿠키 없음 (로그인 사용자 없음 )
      .send(commentDataIn.updateCommentReq);
    expect(response.statusCode).toBe(401); // 400번대로 반려되어야 정상
  });
});

describe("#4 DELETE /api/comments/:_commentId 특정 댓글 삭제", () => {
  // 로그인이 필요한 경우 쿠키만드는 beforeEach
  let cookie; // beforeEach() 바깥에서도 사용해야 하므로 여기에서 선언
  beforeEach(async () => {
    // login 과정에서 사용할 로그인할 유저의 정보를 db에 미리 담아둠 (매번 초기화되기 때문에)
    const response = await request(app)
      .post("/api/login")
      .send(userDataIn.loginpReq1); // 1번 댓글을 작성한 Tester1로 로그인 (user "Tester1")
    cookie = response.headers["set-cookie"]; // cookie라는 변수에 저장하여 각 테스트에서 요청에 활용
  });

  // 3가지 테스트 시작 ----------------
  test("글쓴이가 특정 게시글 수정 시도", async () => {
    const response = await request(app)
      .delete("/api/comments/1") // Tester1이 직접 작성한 1번 댓글 삭제 시도
      .set("Cookie", cookie); // beforeEach에서 확보한 쿠키를 요청에 함께 전달 (user "Tester1")
    expect(response.statusCode).toBe(200); // 직접 작성한 댓글을 삭제하므로 삭제되어 정상 응답

    // db에 잘 삭제되었는지 1번 댓글 확인
    const commentInfo = await Comment.findOne({
      where: { _id: 1 },
    });
    expect(commentInfo).toBeFalsy(); // 삭제되었으므로 없어야(Falsy) 정상
  });

  test("글쓴이가 아닌 유저가 특정 게시글 삭제 시도", async () => {
    const response = await request(app)
      .delete("/api/comments/3") // Tester1이 직접 작성하지 않은 3번 댓글 삭제 시도
      .set("Cookie", cookie); // beforeEach에서 확보한 쿠키를 요청에 함께 전달 (user "Tester1")
    expect(response.statusCode).toBe(400); // 400번대로 반려되어야 정상 (권한없음)
  });

  test("로그인 하지 않고 게시글 삭제 시도", async () => {
    const response = await request(app).delete("/api/comments/3"); // 전달되는 쿠키 없음 (로그인 사용자 없음 )
    expect(response.statusCode).toBe(401); // 400번대로 반려되어야 정상 (권한없음)
  });
});

// 테스트가 끝난 후 데이터베이스 강제 초기화 (아무 데이터도 없는 상태)
afterAll(async () => {
  await sequelize.sync({ force: true });
});
