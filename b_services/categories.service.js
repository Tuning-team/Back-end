const CategoryRepository = require("../c_repositories/categories.repository");
const CollectionRepository = require("../c_repositories/collections.repository");

class CategoryService {
  categoryRepository = new CategoryRepository();
  collectionRepository = new CollectionRepository();

  //카테고리 조회
  getCategoryOn = async (_id) => {
    const thisCollection = await this.collectionRepository.getColletion(
      collection_id
    );

    if (!thisCollection) {
      return { status: 400, message: "컬렉션이 없습니다.", data: undefined };
    } else {
      const getAllCategoriesInfo = await this.categoryRepository.getAllCategories(
        _id
      );

      const data = getAllCategoriesInfo.map((el) => {
        return {
          _id: el._id,
          categoryName: el.categoryName,
        }
      });

      return { status: 200, message: "카테고리 목록을 불러왔습니다.", data: data };
    }
  };
}

module.exports = CategoryService;