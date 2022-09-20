const Category = require("../d_schemas/category");
const User = require("../d_schemas/user");

class CategoryRepository {
  // 카테고리 전체 조회
  getAllCategories = async (_id) => {
    const Categories = await Category.find({ _id });
    return Categories;
  };
  getCategoryInfo = async (_id) => {
    const CategoryInfo = await Category.findOne({ _id });
    return CategoryInfo;
  };

  // 활성화된(isVisible = True) 카테고리 전체 조회
  // 관리자가 분류해야 하는 “인기있는“, “이번 프로모션을 위한” 등등의 카테고리 숨김
  getAllCategoriesVisible = async () => {
    const CategoriesVisible = await Category.find({ isVisible: true });
    return CategoriesVisible;
  };

  // 카테고리 이름 생성. return 생성된 카테고리 이름
  createCategoryName = async (categoryName) => {
    const createCategoryName = await Category.create({
      categoryName,
    });
    return createCategoryName;
  };

  // 유튜브API 카테고리 생성. return 생성된 카테고리 이름
  createYoutubeCategoryId = async (youtubeCategoryId) => {
    const createYoutubeCategoryId = await Category.create({
      youtubeCategoryId,
    });
    return createYoutubeCategoryId;
  };

  // 카테고리 이름 수정. return 수정된 카테고리 이름
  updateCategory = async (_id, categoryName) => {
    const updateCategory = await Category.updateOne({ _id }, { $set: { categoryName } });
    return updateCategory;
  };

  // 카테고리 삭제. return 삭제된 카테고리 정보
  deleteCategory = async (_id) => {
    const deleteCategory = await Category.deleteOne({ _id });
    return deleteCategory;
  };
  // 유저가 관심있는 카테고리 리스트
  getAllInterestOnCategoryArray = async (myInterestingCategories) => {
    const allCategoriesUserInterested = await User.find({
      myInterestingCategories,
    });
    return allCategoriesUserInterested;
  };
  // 해당 카테고리가 관심받은 리스트
  getAllInteretOnCategoryId = async (category_id) => {
    const interests = await Category.find({ category_id });

    return interests;
  };
  // _id에 해당하는 카테고리의 관심을 1개 올린다.
  likeCollection = async (_id) => {
    const interestCategory = await Collection.findOneAndUpdate({ _id }, { $inc: { interest: +1 } });

    return interestCategory.likes;
  };

  // _id에 해당하는 카테고리의 관심을 1개 내린다.
  disLikeCollection = async (_id) => {
    const interestCategory = await Collection.findOneAndUpdate({ _id }, { $inc: { interest: -1 } });
    return interestCategory.likes;
  };
}

module.exports = CategoryRepository;
