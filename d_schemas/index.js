// 몽고디비 연결부 역할
const mongoose = require("mongoose");
const mongo_Access = process.env.npm_lifecycle_event === "start" ? process.env.MONGO_DB_ACCESS : process.env.MONGO_DB_ACCESS_TEST;

// 이 주소 (mongo_local)로 db에 연결
const connect = () => {
  mongoose.connect(mongo_Access, { ignoreUndefined: true }).catch((err) => console.error(err));
};

// 몽고디비 연결 되는 동안 에러가 발생하면 에러 처리
mongoose.connection.on("error", (err) => {
  console.error("몽고디비 연결 에러", err);
});

// mongoDB 연결 객체를 파일 외부에 공개 -> app.js에서 사용
module.exports = connect;
