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

  getFrequentKeywords = async (limit) => {
    const frequentKeywords = await Keyword.find({})
      .sort({
        counts: -1,
      })
      .limit(limit);

    return frequentKeywords;
  };
}

module.exports = KeywordsRepository;
