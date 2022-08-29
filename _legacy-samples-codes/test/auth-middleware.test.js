// 검증할 모듈 import
const Auth = require("../middlewares/auth-middleware");
const auth = new Auth();

// 필요한 내부 모듈과 DataSet import
const UserRepository = require("../repositories/users.repository");
const userRepository = new UserRepository();
const userDataIn = require("./data/user-data-in.js"); // 받아올 mock 데이터

// 필요한 외부 모듈과 변수들을 import
const jwt = require("jsonwebtoken"); // 토큰 관련
const httpMocks = require("node-mocks-http"); // req, res, next 가상 객체를 생성해주는 모듈
const MY_SECRET_KEY = process.env.MY_SECRET_KEY;

// 공용 변수들을 define
let req, res, next; // beforeEach 밖에서도 활용하기 위해 여기에 선언
beforeEach(() => {
  // test에 활용할 수 있도록 req, res, next를 흉내내느 mock 객체 할당
  req = httpMocks.createRequest(); // 빈 리퀘스트 객체 생성
  res = httpMocks.createResponse(); // 빈 리스폰스 객체 생성
  next = jest.fn(); // mock 함수로 정의

  // 미들웨어 검증에 사용할 저장소의 getUserbyId 메소드를 mock 함수로 정의하였고,
  auth.userRepository.getUserbyId = jest.fn();

  // 그 함수는 이 테스트에서 항상 userDataIn.mockUser_ResLocals를 반환
  auth.userRepository.getUserbyId.mockReturnValue(
    userDataIn.mockUser_ResLocals
  );
});

// ---------- 미들웨어 기능 검증 시작 ----------------------
describe("AuthMiddleware _ 기능 검증 Group", () => {
  test("유효한 토큰을 전달했을 때 res.locals에 user 정보 기록", async () => {
    req.cookies.token = userDataIn.userReq_Cookie.token; // 미리 data 폴더에 보관한 mock 데이터 객체에서 유효한 토큰을 request에 넣어 전달
    await auth.authMiddleware(req, res, next); // 이 미들웨어를 거쳐서 나온,
    // 응답 res 객체의 locals.user가 아래 Property들을 가지고 있으면 성공
    expect(res.locals.user).toHaveProperty("userId");
    expect(res.locals.user).toHaveProperty("nickname");
    expect(res.locals.user).toHaveProperty("password");
  });
});

// 회원가입 과정에서 저장소 관련 테스트 그룹
describe("AuthMiddleware _ 예외처리 검증 Group", () => {
  test("Bearer로 시작하지 않는 토큰에 에러.", async () => {
    req.cookies.token =
      "Nothing eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTY2MDA0OTgyNH0.lAHIM-gJVT9MEeMkM60n6gMPbTwOXA3rVPbcQVjRGaw"; // Bearer로 시작하지 않는 토큰을 request에 넣어 전달
    await auth.authMiddleware(req, res, next);
    expect(res.statusCode).toBe(401); // 400번대로 반려되어야 성공
  });

  test("payload가 없거나 비어 있는 등 무효한 토큰 반려.", async () => {
    req.cookies.token =
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.NoPayLoad.lAHIM-gJVT9MEeMkM60n6gMPbTwOXA3rVPbcQVjRGaw"; // 페이로드를 조작해서 넣어 전달
    await auth.authMiddleware(req, res, next);
    expect(res.statusCode).toBe(401); // 400번대로 반려되어야 성공
  });

  test("시간이 지난 토큰 반려.", async () => {
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTY2MDA0OTgyNH0.lAHIM-gJVT9MEeMkM60n6gMPbTwOXA3rVPbcQVjRGaw"; // 만료된 토큰을 request에 넣어 전달
    await auth.authMiddleware(req, res, next);
    expect(res.statusCode).toBe(401); // 400번대로 반려되어야 성공
  });

  test("payload가 없거나 비어 있는 등 무효한 토큰 반려.", async () => {
    req.cookies.token = ""; // 페이로드를 조작해서 넣어 전달
    await auth.authMiddleware(req, res, next);
    expect(res.statusCode).toBe(401); // 400번대로 반려되어야 성공
  });
});
