const Keyword = require("../d_schemas/keyword");

class KeywordsRepository {
  countKeyword = async (keyword, whereTyped) => {
    const thisKeyword = await Keyword.findOne({ keyword, whereTyped });

    if (!thisKeyword) {
      const { counts } = await Keyword.create({ keyword, whereTyped, counts: 1 });
      return counts;
    } else {
      const { counts } = await Keyword.findOneAndUpdate({ keyword, whereTyped }, { $inc: { counts: +1 } });
      return counts + 1;
    }
  };
}

module.exports = KeywordsRepository;
