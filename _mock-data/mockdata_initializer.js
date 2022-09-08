require("dotenv").config(); // 환경변수 적용
const mongoose = require("mongoose");
const connect = require("../d_schemas/index.js");
connect();

const {
  // users,
  collections,
  // comments,
  // videos,
  // categories,
} = require("./main-data-in_wo_ids.js");

// const Users = require("../d_schemas/user");
const Collections = require("../d_schemas/collection");
// const Comments = require("../d_schemas/comment");
// const Categories = require("../d_schemas/category");
// const Videos = require("../d_schemas/video");

// console.log("users", users);
// console.log("collections", collections);
// console.log("comments", comments);
// console.log("categories", categories);
// console.log("videos", videos);

try {
  Collections.create(collections).then((e) => console.log(e)); // 완료
  // Comments.create(comments).then((e) => console.log(e));
  // Categories.create(categories).then((e) => console.log(e)); // 완료
  // Videos.create(videos).then((e) => console.log(e)); // 완료
} catch (error) {
  console.log(error);
}

// const dataInitializer = () => {
// const createdCollections = Collections.create(collections);
//   const createdComments = Comments.create(comments);
//   const createdCategories = Categories.create(categories);
//   const createdVideos = Videos.create(videos);
// };

// module.exports = dataInitializer;
