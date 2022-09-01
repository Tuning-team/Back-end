const CategoryRepository = require("../c_repositories/categories.repository");
const CollectionRepository = require("../c_repositories/collections.repository");

class CategoryService {
  categoryRepository = new CategoryRepository();
  collectionRepository = new CollectionRepository();

  //카테고리 조회
  getCategoryon = async (category_id) => {
    const thisCollection = await this.collectionRepository.getColletion(
      collection_id
    );

    if (!thisCollection) {
      return { status: 400, message: "컬렉션이 없습니다.", data: undefined };
    } else {
      const getAllCategoriesInfo =
        await this.categoryRepository.getAllCategories(category_id);
    }
  };
}
