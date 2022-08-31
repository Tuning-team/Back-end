const {
  users,
  collections,
  comments,
  categories,
  videos,
} = require("../main-data-in.js");

const Collections = require("../d_schemas/collection");
const Comments = require("../d_schemas/comment");
const Categories = require("../d_schemas/category");
const Videos = require("../d_schemas/video");

const dataInitializer = () => {
  const createdCollections = Collections.create();
  const createdComments = Comments.create();
  const createdCategories = Categories.create();
  const createdVideos = Videos.create();
};

module.exports = dataInitializer;
