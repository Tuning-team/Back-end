const VideosSearchRepository = require("../c_repositories/videosSearch.repository");
const axios = require("axios");

class SearchService {
  videosSearchRepository = new VideosSearchRepository();

  videoSearchViaDB = async (req, res) => {
    try {
      const { keyword } = req.query;
      const returnVideos = await this.videosSearchRepository.getVideoSearchByKeyword(keyword);

      const sortedResult = returnVideos.map((e) => {
        return {
          videoId: e.videoId,
          title: e.title,
        };
      });

      res.status(200).json({ success: true, data: sortedResult });
    } catch (error) {
      console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
      res.status(400).json({ success: false, message: "검색에 실패하였습니다." });
    }
  };

  videoSearchViaYoutube = async (req, res) => {
    try {
      const { keyword } = req.query;

      const url = `https://www.googleapis.com/youtube/v3/search?key=${
        process.env.YOUTUBE_API_KEY
      }&part=id,snippet&maxResults=50&regionCode=kr&q=${encodeURI(keyword)}`;

      const returnVideos = await axios(url);
      const resultArr = returnVideos.data.items.map((e) => {
        return {
          videoId: e.id.videoId,
          title: e.snippet.title,
        };
      });

      res.status(200).json({ success: true, data: resultArr });
    } catch (error) {
      console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
      res.status(400).json({ success: false, message: "검색에 실패하였습니다." });
    }
  };
}

module.exports = SearchService;
