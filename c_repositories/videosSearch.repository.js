const VideoSearch = require("../d_schemas/videoSearch");

class VideosSearchRepository {
  getVideoSearch = async (_id) => {
    const thisVideo = await VideoSearch.findOne({ _id: _id });
    return thisVideo;
  };

  getVideoSearchByKeyword = async (keyword) => {
    const searchedVideos = await VideoSearch.find({
      title: new RegExp(keyword, "i"),
    });

    return searchedVideos;
  };

  createVideoSearch = async (video_id, title, description) => {
    const createdVideoSearch = await VideoSearch.create({
      video_id,
      title,
      description,
    });

    return createdVideoSearch;
  };
}

module.exports = VideosSearchRepository;
