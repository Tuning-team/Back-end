require("dotenv").config(); // 환경변수 적용
const mongoose = require("mongoose");
const connect = require("../d_schemas/index.js");
connect();

const CategoriesRepository = require("../c_repositories/categories.repository");
const categoriesRepository = new CategoriesRepository();

// 콜렉션 id & videos pair 모두 불러오기

const categorySetter = async (categoryName) => {
  const newCategory = await categoriesRepository.createCategoryName(
    categoryName
  );

  console.log(newCategory);
};

categorySetter("새로운");
categorySetter("오늘 날씨에 추천하는");
categorySetter("바로 지금 추천하는");
