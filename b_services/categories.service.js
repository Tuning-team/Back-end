const CategoryRepository = require("../c_repositories/categories.repository");

class CategoryService {
  categoryRepository = new CategoryRepository();

  //카테고리 조회
  getCategoryOn = async (req, res) => {
    try {
      const resCategories =
        await this.categoryRepository.getAllCategoriesVisible();

      // const _resCategories = resCategories.map((e) => {
      //   return e.categoryName;
      // });

      res.status(200).json({ success: true, data: resCategories });
    } catch (error) {
      console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
      res
        .status(400)
        .json({ success: false, message: "카테고리 조회에 실패하였습니다." });
    }
  };
}

module.exports = CategoryService;
