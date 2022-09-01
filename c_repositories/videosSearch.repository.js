const VideoSearch = require("../d_schemas/videoSearch");

class VideosSearchRepository {
  getVideoSearch = async (_id) => {
    const thisVideo = await VideoSearch.findOne({ where: { _id: _id } });
    return thisVideo;
  };

  getVideoSearchByKeyword = async (keyword) => {
    const searchedVideos = await VideoSearch.find({
      title: new RegExp(keyword, "i"),
    });

    console.log("searchedVideos", searchedVideos);

    return searchedVideos;
  };

  createVideoSearch = async (videoId, title, description) => {
    const createdVideoSearch = await VideoSearch.create({
      videoId,
      title,
      description,
    });

    return createdVideoSearch;
  };
}

module.exports = VideosSearchRepository;
1;
