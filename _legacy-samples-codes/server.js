// 이 js 파일은 app.js의 app객체를 그대로 이어받아, 서버를 켜는 작업을 수행
const app = require("./app");

// 환경변수 모듈 불러오기 (process.env. + 변수 설정) -> process.env. 객체 사용 가능
const dotenv = require("dotenv");
dotenv.config();

// process.env. 환경변수 객체에서 본 서버의 port 번호 불러옴
const port = process.env.PORT;

// 포트 열어서 Request Listening..
app.listen(port, () => {
  console.log(`${port} 번 포트로 연결이 완료되었습니다.`);
});
