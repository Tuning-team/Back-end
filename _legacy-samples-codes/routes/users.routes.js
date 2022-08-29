// app.js -> index.js의 Router를 통해 들어온 이파일은,

// 이 파일에 필요한 각종 외부 모듈 import
// 이 파일에서 사용할 라우터 객체 생성
const express = require("express");
const router = express.Router("./dsda");

// 스웨거 모듈 임포트
const { swaggerUi, specs } = require("../modules/swagger.js");

// 라우터가 나누어 보낼 컨트롤러 인스턴스 확보
const UsersController = require("../controllers/users.controller"); // 클래스
const usersController = new UsersController(); // 인스턴스

console.log("** --- User Router ---");

// TASK 1 : 회원 가입 API with POST  ('/api/signup')
router.post("/signup", usersController.signUp);
// TASK 2 : 로그인 기능 ('/api/login')
router.post("/login", usersController.login);
// '/api' 이 경로 주소에 곧장 swagger 페이지 사용
router.use("/", swaggerUi.serve, swaggerUi.setup(specs));
// 이 파일의 router 객체를 외부에 공개합니다.

console.log("** --- User Router Set ---");

module.exports = router;

/**
 * @swagger
 *  /api/signup:
 *    post:
 *      tags:
 *      - Users
 *      description: 회원가입
 *      operationId : signup
 *      parameters:
 *      - in: "body"
 *        name: "body"
 *        description: "Created user object"
 *        required: true
 *        schema:
 *          type: object
 *          properties:
 *            userId:
 *              type: string
 *              example: 'TESTER6'
 *            password:
 *              type: string
 *              example: '1234'
 *            confirm:
 *              type: string
 *              example: '1234'
 *      responses:
 *        200:
 *          description: "회원 가입에 성공하였습니다."
 *        400-1:
 *          description: "이미 로그인이 되어있습니다."
 *        400-2:
 *          description: "입력하신 두개의 비밀번호가 다릅니다"
 *        400-3:
 *          description: "비밀번호는 닉네임을 포함할 수 없습니다. "
 *        400-4:
 *          description: "이미 사용중인 닉네임 입니다."
 *        400-5:
 *          description: "입력하신 아이디와 패스워드를 확인해주세요."
 */

/**
 * @swagger
 *  /api/login:
 *    post:
 *      tags:
 *      - Users
 *      description: 회원가입
 *      operationId : signup
 *      parameters:
 *      - in: "body"
 *        name: "body"
 *        description: "Login here"
 *        required: true
 *        schema:
 *          type: object
 *          properties:
 *            userId:
 *              type: string
 *              example: 'TESTER6'
 *            password:
 *              type: string
 *              example: '1234'
 *      responses:
 *        200:
 *          description: 유효 토큰 반환
 *        400-1:
 *          description: "이미 로그인이 되어있습니다."
 *        400-2:
 *          description: "닉네임 또는 패스워드를 확인해주세요."
 *        400-3:
 *          description: "유효한 아이디와 패스워드를 입력해주세요."
 */
