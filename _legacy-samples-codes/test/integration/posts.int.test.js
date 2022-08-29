const request = require("supertest"); // http 요청을 보낼 수 있는 라이브러리
const app = require("../../app"); // app express 객체에 요청을 보냄
const { sequelize } = require("../../models"); // DB를 초기화하는 데에 sequelize 객체를 사용
const { User, Post } = require("../../models"); // 테스트 과정에서 DB를 직접 확인하는 경우가 있으므로 DB 모델을 직접 임포트

const userDataIn = require("../data/user-data-in.js"); // 받아올 mock 데이터 객체 (경로.js에 있는 정보를 모두 담고 있음)
const postDataIn = require("../data/post-data-in.js"); // 받아올 mock 데이터 객체 (경로.js에 있는 정보를 모두 담고 있음)

// before All, DB 초기화 : 검증에 필요한 초기데이터를 DB에 넣고 시작
beforeAll(async () => {
  await sequelize.sync();

  // 테스트를 위한 몇개의 포스팅을 미리 만들어둠
  // 테스터 2명 회원가입
  await request(app).post("/api/signup").send(userDataIn.signUpReq1); // Tester1
  await request(app).post("/api/signup").send(userDataIn.signUpReq3); // Tester3

  // 위 2명의 테스터의 로그인
  const response1 = await request(app)
    .post("/api/login")
    .send(userDataIn.loginpReq1); // Tester1
  cookie_1 = response1.headers["set-cookie"]; // Tester1이 가지고 있는 쿠키

  const response3 = await request(app)
    .post("/api/login")
    .send(userDataIn.loginpReq3); // Tester3
  cookie_3 = response3.headers["set-cookie"]; // Tester3이 가지고 있는 쿠키

  // 게시글 각 4개 작성
  await request(app)
    .post("/api/posts")
    .set("Cookie", cookie_1) // Tester1이 게시
    .send(postDataIn.sampleBaseReq_1); // postId : 1을 부여받음

  await request(app)
    .post("/api/posts")
    .set("Cookie", cookie_1) // Tester1이 게시
    .send(postDataIn.sampleBaseReq_2); // postId : 2를 부여받음

  await request(app)
    .post("/api/posts")
    .set("Cookie", cookie_3) // Tester3이 게시
    .send(postDataIn.sampleBaseReq_3); // postId : 3를 부여받음

  await request(app)
    .post("/api/posts")
    .set("Cookie", cookie_3) // Tester3이 게시
    .send(postDataIn.sampleBaseReq_4); // postId : 4를 부여받음
});

// ------------------ 검증(TEST) 시작 ----------------- //
describe("#1 POST /api/posts 게시글 작성 셍성 테스트", () => {
  // 로그인이 필요한 경우 쿠키 만드는 beforeEach
  let cookie; // beforeEach() 밖에서도 사용하기 위해 여기에 선언
  beforeEach(async () => {
    // login 과정에서 사용할 로그인할 유저의 정보를 db에 미리 담아둠 (매번 초기화되기 때문에)
    await request(app).post("/api/signup").send(userDataIn.signUpReq); // 로그인 정보(Tester10)를 전달하여 회원가입 시도
    const response = await request(app)
      .post("/api/login")
      .send(userDataIn.loginpReq); // Tester10 으로 쿠키 전달
    cookie = response.headers["set-cookie"];
  });

  test("모두 기입 시 글 작성되었는지 확인", async () => {
    const response = await request(app)
      .post("/api/posts")
      .set("Cookie", cookie) // Tester10 으로 로그인한 쿠키 전달
      .send(postDataIn.createPostReq); // 작성정보(title, content) 전달
    expect(response.statusCode).toBe(201); // 201번 정상 응답되어야 함

    // db에 잘 들어갔는지 전달한 타이틀로 DB에서 검색
    const postInfo = await Post.findOne({
      where: { title: postDataIn.createPostReq.title },
    });
    expect(postInfo).toBeTruthy(); // 찾은 정보가 있어야 함 (테스트 실행시마다 DB가 초기화 되기 때문에 동일 타이틀은 1개)
  });
});

describe("#2 GET /api/posts 게시글 모두 조회", () => {
  // 게시글 정보를 모두 조회하는 테스트
  test("게시글 모두 조회", async () => {
    const response = await request(app).get("/api/posts");
    expect(response.statusCode).toBe(200); // 정상 응답
  });
});

describe("#3 GET /api/posts/:_postId 특정 게시글 상세 조회", () => {
  // 특정 게시글을 상세 조회하는 API에 담는 정보 없이 GET요청하여 200번 응답을 받으면 성공
  test("특정 게시글 상세 조회", async () => {
    const response = await request(app).get("/api/posts/3");
    expect(response.statusCode).toBe(200); // 정상 응답
  });
});

describe("#4 PUT /api/posts/:_postId 특정 게시글 수정", () => {
  // 로그인이 필요한 경우 쿠키만드는 beforeEach
  let cookie;
  beforeEach(async () => {
    // login 과정에서 사용할 로그인할 유저의 정보를 db에 미리 담아둠 (매번 초기화되기 때문에)
    const response = await request(app)
      .post("/api/login")
      .send(userDataIn.loginpReq1); // 1번 글을 작성한 Tester1로 로그인
    cookie = response.headers["set-cookie"]; // Tester1이 로그인하고 전달받은 쿠키를 테스트할 때 활용
  });

  // 3개 테스트 수행 ---
  test("Tester1이 직접 작성한 특정 게시글 1번 수정 시도 - 성공해야 함", async () => {
    const response = await request(app)
      .put("/api/posts/1") // 작성글 1번을 수정하는 데,
      .set("Cookie", cookie) // Tester1로 로그인
      .send(postDataIn.updatePostReq); // 수정할 컨텐츠 전달
    expect(response.statusCode).toBe(201); // 정상 응답 받으면 성공

    // db에 잘 수정되었는지 확인하기 위해 DB에서 검색
    const postInfo = await Post.findOne({
      where: { _id: 1 },
    });

    // 검색된 정보의 title이 수정된 내용("수정된 게시글 입니다.")이면 성공
    expect(postInfo.title).toStrictEqual("수정된 게시글 입니다.");
  });
  test("Tester1이 직접 작성하지 않은 게시글 3번 수정 시도 - 반려돼야 함", async () => {
    const response = await request(app)
      .put("/api/posts/3") // 3번 수정 시도
      .set("Cookie", cookie) // Tester1로 로그인
      .send(postDataIn.updatePostReq); // 수정할 컨텐츠 전달
    expect(response.statusCode).toBe(400); // 400번대 반려되어야 정상
  });
  test("로그인 하지 않고 게시글 수정 시도 - 반려돼야 함", async () => {
    const response = await request(app)
      .put("/api/posts/3")
      // 로그인한 쿠키 없음 (로그인 안함)
      .send(postDataIn.updatePostReq); // 수정할 컨텐츠 전달
    expect(response.statusCode).toBe(401); // 400번대 반려되어야 정상
  });
});

describe("#5 DELETE /api/posts/:_postId 특정 게시글 삭제", () => {
  // 로그인이 필요한 경우 쿠키만드는 beforeEach
  let cookie;
  beforeEach(async () => {
    // login 과정에서 사용할 로그인할 유저의 정보를 db에 미리 담아둠 (매번 초기화되기 때문에)
    const response = await request(app)
      .post("/api/login")
      .send(userDataIn.loginpReq1); // 1번 글을 작성한 Tester1로 로그인
    cookie = response.headers["set-cookie"]; // Tester1이 로그인하고 전달받은 쿠키를 테스트할 때 활용
  });

  // 테스트 3가지 시작 ---------
  test("Tester1이 직접 작성한 특정 게시글 1번 삭제 시도 - 성공해야 함", async () => {
    const response = await request(app)
      .delete("/api/posts/1") // 작성글 1번을 삭제하는 데,
      .set("Cookie", cookie); // Tester1로 로그인
    expect(response.statusCode).toBe(200); // 삭제 후 200번대 정상 응답

    // db에 잘 삭제되었는지 DB를 검색하여 확인
    const postInfo = await Post.findOne({
      where: { _id: 1 },
    });
    // 삭제되어야 정상이므로 찾은게 없어야(falsy) 정상
    expect(postInfo).toBeFalsy();
  });

  test("Tester1이 직접 작성하지 않은 게시글 3번 삭제 시도 - 실패해야 함", async () => {
    const response = await request(app)
      .delete("/api/posts/3") // 직적 작성하지 않은 글 3번을 삭제하는 데,
      .set("Cookie", cookie); // Tester1로 로그인
    expect(response.statusCode).toBe(400); // 400번대로 반려되어야 정상
  });

  test("로그인하지 않고 특정 게시글 삭제 시도", async () => {
    const response = await request(app).delete("/api/posts/3"); // 로그인 유저(쿠키) 없이 삭제 시도
    expect(response.statusCode).toBe(401); // 400번대로 반려되어야 정상
  });
});

// 참고 : 순서대로 테스트 일괄 진행 시, 현재 DB의 1번 게시글은 삭제된 상태
describe("####### Like Tester #######", () => {
  describe("#6 PUT /api/posts/:_postId/like 게시글 좋아요", () => {
    // 로그인이 필요한 경우 쿠키 만드는 beforeEach
    let cookie;
    beforeEach(async () => {
      // login 과정에서 사용할 로그인할 유저의 정보를 db에 미리 담아둠 (매번 초기화되기 때문에)
      const response = await request(app)
        .post("/api/login") // 로그인 API에 POST 요청
        .send(userDataIn.loginpReq1); // 1번 글을 작성한 Tester1로 로그인
      cookie = response.headers["set-cookie"]; // Tester1로 로그인한 쿠키 보관 변수
    });

    test("Tester1 유저가 2번 게시글 좋아요 (현재 좋아요 0개)", async () => {
      await request(app)
        .put("/api/posts/2/like") // 2번 게시글을 좋아하는 데에,
        .set("Cookie", cookie); // Tester1 로 로그인 (쿠키 전달)

      // DB에 제대로 들어갔을까?

      // Tester1 유저의 likedPosts 정보 확인
      const { likedPosts } = await User.findOne({
        where: { userId: 1 },
      });

      // 2번 게시글의 좋아요 수 데이터 확인
      const { likes } = await Post.findOne({
        where: { _id: 2 },
      });

      // 아래와 같은 값이 되어 있어야 함
      expect(likedPosts).toMatchObject(["2"]); // 정상 응답
      expect(likes).toStrictEqual(1); // 정상 응답
    });

    // Tester1이 이미 2번을 좋아요 누른 상태
    test("Tester1 유저가 2번 게시글 좋아요 취소 (현재 좋아요 1개)", async () => {
      await request(app)
        .put("/api/posts/2/like") // 2번 게시글의 좋아요를 다시 눌렀는데,
        .set("Cookie", cookie); // Tester1 로 로그인 (쿠키 전달) ()

      // Tester1 유저의 likedPosts 배열 정보 확인
      const { likedPosts } = await User.findOne({
        where: { userId: 1 },
      });

      // 2번 게시글의 좋아요 수 데이터 확인
      const { likes } = await Post.findOne({
        where: { _id: 2 },
      });

      // 아래와 같은 값이 되어 있어야 함
      expect(likedPosts).toMatchObject([]); // 정상 응답
      expect(likes).toStrictEqual(0); // 정상 응답
    });

    test("글쓴이가 아닌 Tester3 유저가 2번 게시글 좋아요 (현재 좋아요 0개)", async () => {
      const response = await request(app)
        .post("/api/login")
        .send(userDataIn.loginpReq3); // 글쓴이가 아닌 3번 유저가 로그인
      tester_3 = response.headers["set-cookie"]; // Tester3으로 로그인 한 쿠키

      // 글쓴이가 아닌 3번 유저가 2번 게시글을 좋아요 눌러도,
      await request(app).put("/api/posts/2/like").set("Cookie", tester_3);

      const { likedPosts } = await User.findOne({
        where: { userId: 2 }, // Tester3의 UserId
      });

      const { likes } = await Post.findOne({
        where: { _id: 2 },
      });

      // 각각 아래와 같이 아래와 같은 값이 되어 있어야 함
      expect(likedPosts).toMatchObject(["2"]); // 정상 응답
      expect(likes).toStrictEqual(1); // 정상 응답
    });
  });

  // 참고 : 순서대로 테스트 일괄 진행 시, 현재 DB 정보는 : Tester3 유저가 2번 게시글을 좋아한 상태
  describe("#7 GET /api/posts/:_postId/like 사용자가 좋아한 게시글 리스트", () => {
    // 로그인이 필요한 경우 쿠키만드는 beforeEach
    let tester_3; // beforeEach() 바깥에서도 사용하므로 여기서 선언
    beforeEach(async () => {
      // #6 번 테스트 와 연달아 실행되므로 Tester3의 정보로 테스트 진행
      const response = await request(app)
        .post("/api/login")
        .send(userDataIn.loginpReq3);
      tester_3 = response.headers["set-cookie"]; // Tester3으로 로그인 한 쿠키
    });

    test("사용자가 좋아한 게시글 리스트", async () => {
      //
      const response = await request(app)
        .get("/api/posts/like")
        .set("Cookie", tester_3); // Tester 3으로 로그인하여 리퀘스트 발송

      // 3번 유저가 지금까지 좋아한 likedList를 정상 응답(200번 response) 받아 봤을 때에
      const likedList = JSON.parse(response.text).data[0];
      expect(response.statusCode).toBe(200);

      // 그 각각의 객체들은 아래와 같은 프로퍼티들을 정상적으로 가지고 있어야 함: toHaveProperty 사용
      expect(likedList).toHaveProperty("postId"); // 정상 응답
      expect(likedList).toHaveProperty("userId"); // 정상 응답
      expect(likedList).toHaveProperty("nickname"); // 정상 응답
      expect(likedList).toHaveProperty("title"); // 정상 응답
    });
  });
});

// 테스트가 끝난 후 데이터베이스 강제 초기화
afterAll(async () => {
  await sequelize.sync({ force: true });
});
