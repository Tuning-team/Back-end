const CategoryRepository = require("../c_repositories/categories.repository");

class CategoryService {
  categoryRepository = new CategoryRepository();

  //카테고리 조회
  getCategoryOn = async (req, res) => {
    try {
      const returnedCategories =
        await this.categoryRepository.getAllCategoriesVisible();

      const resCategories = returnedCategories.map((e) => {
        return e.categoryName;
      });

      res.status(200).json(resCategories);
    } catch (error) {}
  };
}

module.exports = CategoryService;
