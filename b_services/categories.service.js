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

      res.status(200).json({success: true, resCategories});
    } catch (error) {
      console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
      return res.status(400).json({
        errorMessage: "카테고리 조회에 실패하였습니다.",
      });
    }
  };
}

module.exports = CategoryService;
