require("dotenv").config();

// import modules
const logger = require("morgan");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const routes = require("./a_routes/index.js");
const errorHandler = require("./server/errorHandler.js");

// connect mongoDB
const mongoose = require("mongoose");
const connect = require("./d_schemas/index.js");
connect();

// set session
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const store = new MongoDBStore({
  uri: process.env.MONGO_DB_ACCESS,
  collection: "mySessions",
});
store.on("error", function (error) {
  console.log(error);
});

// set passport
const passport = require("passport");
const passportConfig = require("./passport/index.js");
passportConfig();

// set app
const app = express();
app.use(helmet());
app.use(logger("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: ["http://localhost:3000", "https://www.tube-tuning.com", "https://tube-tuning.com"], credentials: true }));
app.use(
  session({
    secret: process.env.MY_SECRET_KEY,
    store: store,
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      maxAge: 86400000, // 24h
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/api", routes);
app.use(errorHandler.catcher404);
app.use(errorHandler.errorHandler);

module.exports = app;
