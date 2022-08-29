// express 모듈을 불러오고, 보안(CORS),포트 등 환경 초기화
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// 환경변수 모듈 불러오기 (process.env. + 변수 설정) -> process.env. 객체 사용 가능
const dotenv = require("dotenv");
dotenv.config();

// express 객체 선언, 각종 middleware 설치
const app = express(); // express 객체 function()
app.use(cors());
app.use(cookieParser());
app.use(express.json());

// DB에 연결
const { sequelize } = require("./models");

// "/api" path로 연결하는 라우터 연결 (우선 routes/index.js로)
const apiRouter = require("./routes/index.js");
app.use("/api", [apiRouter]);

// queryInterface: 이 주석은 데이터베이스의 테이블이나 컬럼을 생성하고 이름을 바꾸는 등의 쿼리문을 만드는 데 활용한다.
// const queryInterface = sequelize.getQueryInterface();
// queryInterface.dropTable("Tests");

module.exports = app;
