require("dotenv").config(); // 환경변수 적용
const express = require("express");
const cors = require("cors");
const Https = require("https");
const cookieParser = require("cookie-parser");

const mongoose = require("mongoose");
const connect = require("./d_schemas/index.js");
connect(); // mongoDB에 연결

const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session); // 세션 저장도 mongoDB 연결
const store = new MongoDBStore({
  uri: process.env.MONGO_DB_ACCESS,
  collection: "mySessions",
});
store.on("error", function (error) {
  console.log(error);
});

// 패스포트를 사용하겠음
const passport = require("passport");
const passportConfig = require("./passport/index.js"); // passportIndex
passportConfig();
console.log("Passport & GoogleStrategy _ 설정 완료!");

// express 객체인 app은, CORS와 세션을 사용
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.MY_SECRET_KEY,
    store: store,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session()); // 그 세션은 passport에서 관리
console.log("-------- app 객체에 세션 설정완료 ----------------");

// https 옵션 적용해서 서버 개설
const fs = require("fs");
const https = Https.createServer(
  {
    key: fs.readFileSync(process.env.SSL_KEY_PATH),
    cert: fs.readFileSync(process.env.SSL_CERT_PATH),
    ca: fs.readFileSync(process.env.SSL_CA_PATH),
  },
  app
);

// 라우터 적용
const routes = require("./a_routes");
app.use("/api", routes); // to /a_routes/index.js

// 서버 Open
https.listen(process.env.HTTPS_PORT, () => {
  console.log(`Start listen Server: ${process.env.HTTPS_PORT}`);
});

module.exports = app;
