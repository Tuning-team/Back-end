const Category = require("../d_schemas/category");

class CategoryRepository {
  // 카테고리 전체 조회
  getAllCategories = async (_id) => {
    const Categories = await Category.find({ _id });
    console.log("Categories", Categories);
    return Categories;
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
    const updateCategory = await Category.updateOne(
      { _id },
      { $set: { categoryName } }
    );
    return updateCategory;
  };

  // 카테고리 삭제. return 삭제된 카테고리 정보
  deleteCategory = async (_id) => {
    const deleteCategory = await Category.deleteOne({ _id });
    return deleteCategory;
  };
}

module.exports = CategoryRepository;
