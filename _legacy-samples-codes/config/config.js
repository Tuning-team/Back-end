// 기존에 sequelize가 기본적으로 만들어 둔 config.json 파일을 DB 접속정보 노출 우려에 따라, js파일로 만들고 환경변수로 적용
// 이후 models/index.js 에서 DB와 연결할 떄에 이 js 파일을 require 하여 정보를 읽어갑니다.
// 여기에 적용한

// dotenv 모듈 설치하여 실행
// 실행하면 -> 어플리케이션 전체 프로세스에 걸쳐 process.env 라는 환경변수 객체에 .env 파일에 적인 정보가 넣어집니다.
const dotenv = require("dotenv");
dotenv.config();

const development = {
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  host: process.env.MYSQL_HOST,
  dialect: "mysql",
};

const production = {
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  host: process.env.MYSQL_HOST,
  dialect: "mysql",
};

// 테스트 시에는 여기를 지납니다.
const test = {
  username: process.env.TEST_MYSQL_USERNAME,
  password: process.env.TEST_MYSQL_PASSWORD,
  database: process.env.TEST_MYSQL_DATABASE,
  host: process.env.TEST_MYSQL_HOST,
  dialect: "mysql",
  logging: false,
};

module.exports = { development, production, test };
