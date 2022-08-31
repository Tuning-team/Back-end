require("dotenv").config(); // 환경변수 적용

// 각종 외부 모듈 설치
const express = require("express");
const cors = require("cors");
const Https = require("https");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const mongoose = require("mongoose");
const passportConfig = require("./passport"); // passportIndex
passportConfig();
const session = require("express-session");

// DB 연결
const connect = require("./d_schemas/index.js");
connect(); // mongoDB에 연결
// const MongoStore = require("connect-mongo");

// express 객체
const app = express();
// app은 session을 사용
app.use(
  session({
    secret: process.env.MY_SECRET_KEY,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session()); // 그 세션은 passport에서 관리

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

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
