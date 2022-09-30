require("dotenv").config();
const createError = require("http-errors");
const logger = require("morgan");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const mongoose = require("mongoose");
const connect = require("./d_schemas/index.js");
connect();

const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const store = new MongoDBStore({
  uri: process.env.MONGO_DB_ACCESS,
  collection: "mySessions",
});
store.on("error", function (error) {
  console.log(error);
});

const passport = require("passport");
const passportConfig = require("./passport/index.js");
passportConfig();

const app = express();
app.use(logger("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));
app.use(
  session({
    secret: process.env.MY_SECRET_KEY,
    store: store,
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      sameSite: "none",
      maxAge: 5300000,
      secure: true,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
const routes = require("./a_routes/index.js");
app.use("/api", routes);

// 에러 핸들러
app.use((req, res, next) => {
  next(createError(404));
});
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

// -- 코드 아카이브 --

// logger.format(
//   "myFormat",
//   ':remote-addr :remote-user - [:date[iso]] ":method :url" :status :response-time ms :res[content-length] ":referrer" ":user-agent"'
// );

// const accessLogStream = fs.createWriteStream(path.join(__dirname, "logs", "access.log"), { flags: "a" });
// app.use(logger("myFormat", { stream: accessLogStream }));

// const fs = require("fs");
// const path = require("path");
// app.use(express.static(path.join(__dirname, "public")));
// app.set("views", path.join(__dirname, "views"));
// app.set("view engine", "ejs");
// app.get("/", async (req, res, next) => {
//   res.render("index", { title: "Express" });
// });
