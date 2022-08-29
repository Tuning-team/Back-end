require("dotenv").config();

const express = require("express");
const cors = require("cors");
const Https = require("https");
const cookieParser = require("cookie-parser");
const connect = require("./d_schemas/index.js");
connect(); // mongoDB에 연결

const routes = require("./a_routes");

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

app.use("/api", routes); // to /routes/index.js

https.listen(process.env.HTTPS_PORT, () => {
  console.log(`Start listen Server: ${process.env.HTTPS_PORT}`);
});

module.exports = app;
