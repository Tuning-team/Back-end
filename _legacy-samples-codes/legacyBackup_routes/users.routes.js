// app.js -> index.js의 Router를 통해 들어온 이파일은,

// 이 파일에 필요한 각종 외부 모듈 import
// 이 파일에서 사용할 라우터 객체 생성
const express = require("express");
const router = express.Router("./dsda");

const Joi = require("joi");
const jwt = require("jsonwebtoken");
const MY_SECRET_KEY = process.env.MY_SECRET_KEY;
const { swaggerUi, specs } = require("../modules/swagger.js");
// const { Op } = require("sequelize");

// models 폴더 안에 있는 User DB 모델을 가져다 사용합니다.
const { User } = require("../models");

// 특히 User 정보는, Joi라는 모듈을 활용하여 validataion 처리합니다.
// 회원가입할 떄 user 정보에 대한 joi 객체
const signupSchema = Joi.object({
  nickname: Joi.string().min(3).max(30).alphanum().required(),
  // 최소 3자 이상, 알파벳 대소문자(a~z, A~Z), 숫자(0~9)
  password: Joi.string().min(4).max(30).alphanum().required(),
  // 최소 4자 이상이며, 닉네임과 같은 값이 포함된 경우 회원가입에 실패 (API에서 검토)
  confirm: Joi.string().min(4).max(30).alphanum().required(),
});
// 로그인 할 떄 user 입력된 정보에 대한 joi 객체
const loginSchema = Joi.object({
  nickname: Joi.string().min(3).max(30).alphanum().required(),
  password: Joi.string().min(4).max(30).required(),
});

//  ---------------- 여기부터 API 시작 ---------------------------
// 기본값 '/api'로 연결된 요청 중 user 관련 요청을 담당하는 API 입니다.

// ------------------ --------------------------- ---------------------------
// TASK 1 : 회원 가입 API with POST  ('/api/signup' POST로 접근 시)
router.post("/signup", async (req, res) => {
  try {
    // joi 객체의 스키마를 잘 통과했는지 확인
    const { nickname, password, confirm } = await signupSchema.validateAsync(
      req.body
    );

    // 헤더가 인증정보를 가지고 있으면 (로그인 되어 있으면,)
    if (req.cookies.token) {
      res.status(400).send({
        errorMessage: "이미 로그인이 되어있습니다.",
      });
      return;
    }

    // ---- 추가적인 유효성 검사 (validation) ------
    // 입력된 패스워드 2개가 같은지 확인
    if (password !== confirm) {
      res.status(400).send({
        errorMessage: "입력하신 두개의 비밀번호가 다릅니다",
      });
      return;
    }

    // 패스워드가 닉네임을 포함하는지 확인
    if (password.includes(nickname)) {
      res.status(400).send({
        errorMessage: "비밀번호는 닉네임을 포함할 수 없습니다. ",
      });
      return;
    }
    // ---- 추가적인 유효성 검사 (validation) End ------

    // 기존에 같은 닉네임을 가진 유저가 있는지 확인
    const existUsers = await User.findOne({
      where: { nickname },
    });

    // 기존에 같은 닉네임을 가진 유저가 있으면 에러메세지
    if (existUsers) {
      res.status(400).send({
        errorMessage: "이미 사용중인 닉네임 입니다.",
      });
      return;
    }

    // 쭈욱 return 없이 여기까지 오면, ID, PW 생성 (회원가입 완료)
    await User.create({ nickname, password });
    res.status(200).json({ message: "회원 가입에 성공하였습니다." }); // 값이 다 넣어진 배열을 Response
  } catch (error) {
    const message = `${req.method} ${req.originalUrl} : ${error.message}`;
    console.log(message);
    res.status(400).send({
      errorMessage: "입력하신 아이디와 패스워드를 확인해주세요.",
    });
  }
});

// ------------------
// TASK 2 : 로그인 기능 ('/api/login')
router.post("/login", async (req, res) => {
  try {
    // 헤더가 인증정보를 가지고 있으면 (로그인 되어 있으면,) 반려
    if (req.cookies.token) {
      res.status(400).send({
        errorMessage: "이미 로그인이 되어있습니다.",
      });
      return;
    }

    // joi 객체의 스키마를 잘 통과했는지 확인
    const { nickname, password } = await loginSchema.validateAsync(req.body);
    // 입력된 정보로 존재하는 사용자 찾아보고
    const user = await User.findOne({ where: { nickname, password } });

    // 찾아봤는데 DB에 그런 user가 없으면 반려
    if (!user) {
      res.status(400).send({
        errorMessage: "닉네임 또는 패스워드를 확인해주세요.",
      });
      return;
    }

    // DB에 그런 user가 있으면 토큰을 발행하여 쿠키로 전달
    const token = jwt.sign({ userId: user.userId }, MY_SECRET_KEY);

    res.cookie("token", `Bearer ${token}`, {
      maxAge: 30000, // 원활한 테스트를 위해 로그인 지속시간을 30초로 두었다.
      httpOnly: true,
    });

    return res.status(200).end();
  } catch (error) {
    const message = `${req.method} ${req.originalUrl} : ${error.message}`;
    console.log(message);
    res.status(400).send({
      errorMessage: "유효한 아이디와 패스워드를 입력해주세요.",
    });
  }
});

// Logout 기능 : TBD 아직 못만들었어요
router.post("/logout", async (req, res) => {
  try {
    console.log("/logout 기능을 개발 예정입니다.");
  } catch (error) {
    const message = `${req.method} ${req.originalUrl} : ${error.message}`;
    console.log(message);
    res.status(400).send({
      errorMessage: message,
    });
  }
});

// '/api' 주소에 곧장 swagger 적용
router.use("/", swaggerUi.serve, swaggerUi.setup(specs));

// 이 파일의 router 객체를 외부에 공개합니다.
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
