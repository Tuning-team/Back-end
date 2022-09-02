// 웹팩 미들웨어를 사용함
const webpack = require("webpack");
const webpackHotMiddleware = require("webpack-hot-middleware");
const webpackDevMiddleware = require("webpack-dev-middleware");

const config = require("./client/webpack.config"); // 클라이언트 폴더에 설정파일 있음
config.mode = "development"; // 이 파일로 들어온 건 development 모드로 설정
const compiler = webpack(config); //

exports.comp = webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath,
});
exports.hot = webpackHotMiddleware(compiler);
