require("dotenv").config(); // 환경변수 적용
const dev = process.env.NODE_ENV !== "production";
const path = require("path");
const createError = require("http-errors");
const logger = require("morgan");

const express = require("express");
const cors = require("cors");

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

app.use(logger("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(cors());

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

// 라우터 적용
const routes = require("./a_routes/index.js");
app.use("/api", routes); // to /a_routes/index.js

// view engine setup
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

// catch 404 에러핸들러
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

// 레거시 코드---

// if (dev) {
//   const webpackDev = require("./dev");
//   app.use(webpackDev.comp).use(webpackDev.hot);
// }

// app.use(express.static(path.join(__dirname, "client", "dist")));
// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
// });
