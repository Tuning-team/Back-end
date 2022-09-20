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

  //카테고리 관심 등록
  interestCategory = async (req, res) => {
    try {
      const { category_id } = req.params;
      const user_id = res.locals.user_id;

      const thisCategory = await this.categoryRepository.getAllCategories(
        category_id
      );

      const { interestedCategoriesArr } = await this.userRepository.getUserById(
        user_id
      );

      if (!thisCategory) {
        res
          .status(400)
          .json({ success: false, message: "해당 카테고리가 없습니다." });
      } else if (!interestedCategoriesArr.includes(category_id)) {
        await this.categoryRepository.interestCategory(category_id);
        await this.userRepository.interestCategory(user_id, category_id);
        res.status(200).json({
          success: true,
          data: "interest",
          message: "관심사를 설정하였습니다..",
        });
      } else {
        await this.categoryRepository.disLikeCollection(category_id);
        await this.userRepository.disInterestCategory(user_id,category_id);
        res.status(200).json({
          success: true,
          data: "dislike",
          message: "카테고리에 관심을 취소하였습니다.",
        });
      }
    } catch (error) {
      console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
      res.status(400).json({
        success: false,
        message: "관심사 등록/취소 기능에 실패하였습니다.",
      });
    }
  }
  //관심사 확인 
  getInterestedList = async (req, res) => {
    try {
      const { category_id } = req.params;
      const user_id = res.locals.user_id;

   const getUsersInterestedLis = await this.categoryRepository.getAllInterestOnCategoryArray(
        category_id
      );

    return getUsersInterestedLis;

      
    } catch(error) {
      console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
      res.status(400).json({
        success: false,
        message: "관심사 조회에 실패하였습니다..",
      });
    }
  }
}
module.exports = CategoryService;
