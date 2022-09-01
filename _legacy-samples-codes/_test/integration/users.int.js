const request = require("supertest"); // http 요청을 보낼 수 있는 라이브러리
const app = require("../../app"); // app express 객체에 요청을 보냄
const { sequelize } = require("../../models"); // DB를 초기화하는 데에 sequelize 객체를 사용
const { User } = require("../../models"); // 테스트 과정에서 DB를 직접 확인하는 경우가 있으므로 DB 모델을 직접 임포트

const userDataIn = require("../data/user-data-in.js"); // 받아올 mock 데이터
const userDataOut = require("../data/user-data-out.js"); // 나와야 할 mock 데이터

// before All, DB 초기화
beforeAll(async () => {
  await sequelize.sync();
});

// --------------- 여기서부터 검증(Test) 시작 -------------- //
describe("POST /api/signup", () => {
  test("모두 기입 시 회원가입 수행", async () => {
    const response = await request(app)
      .post("/api/signup")
      .send(userDataIn.signUpReq);
    expect(response.statusCode).toBe(200);

    // db에 잘 들어갔는지 확인
    const userInfo = await User.findOne({
      where: { nickname: userDataIn.signUpReq.nickname },
    });

    console.log(userInfo);
    expect(userInfo).toBeTruthy();
  });

  test("잘못기입 시 (짧은 패스워드) 회원가입 반려", async () => {
    const response = await request(app).post("/api/signup").send({
      nickname: "Tester10",
      password: "12",
      confirm: "12",
    });
    expect(response.statusCode).toBe(400);
  });
  test("잘못기입 시 (서로 다른 패스워드) 회원가입 반려", async () => {
    const response = await request(app).post("/api/signup").send({
      nickname: "Tester10",
      password: "12345",
      confirm: "123456",
    });
    expect(response.statusCode).toBe(400);
  });

  test("쿠키가 존재하는 경우(이미 로그인 된 경우) 반려", async () => {
    const response = await request(app)
      .post("/api/signup")
      .set(
        "Cookie",
        `token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTY1OTk2MzA1NH0.XFjC5KhSJ-K-3XwjvyOTdmMu5k5Fe3GDqaCOfOezrAo"`
      )
      .send({
        nickname: "Tester10",
        password: "12345",
        confirm: "12345",
      });
    expect(response.statusCode).toBe(400);
  });

  test("비밀번호가 닉네임을 포함할 경우 반려", async () => {
    const response = await request(app).post("/api/signup").send({
      nickname: "Tester10",
      password: "Tester1027",
      confirm: "Tester1027",
    });
    expect(response.statusCode).toBe(400);
  });
});

describe("POST /api/login", () => {
  beforeEach(async () => {
    // login 과정에서 사용할 로그인할 유저의 정보를 db에 미리 담아둠 (매번 초기화되기 때문에)
    await request(app).post("/api/signup").send(userDataIn.signUpReq);
  });
  test("모두 정상 기입 시 로그인 수행 (응답코드와 쿠키 확인)", async () => {
    const response = await request(app)
      .post("/api/login")
      .send(userDataIn.loginpReq);
    expect(response.statusCode).toBe(200); // 정상 응답
    expect(response.headers["set-cookie"]).toBeTruthy(); // 로그인 해서 받은 쿠키가 있음
  });
  test("잘못된 패스워드 입력 시, 로그인 못함 - 반려", async () => {
    const response = await request(app).post("/api/login").send({
      nickname: "Tester10",
      password: "1234",
    });
    expect(response.statusCode).toBe(400);
  });
  test("쿠키가 존재하는 경우(이미 로그인 된 경우) 로그인 필요 없음 - 반려", async () => {
    const response = await request(app)
      .post("/api/login")
      .set(
        "Cookie",
        `token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTY1OTk2MzA1NH0.XFjC5KhSJ-K-3XwjvyOTdmMu5k5Fe3GDqaCOfOezrAo"`
      )
      .send({
        nickname: "Tester10",
        password: "12345",
      });
    expect(response.statusCode).toBe(400);
  });
});

// 테스트가 끝난 후 데이터베이스 강제 초기화
afterAll(async () => {
  await sequelize.sync({ force: true });
});
