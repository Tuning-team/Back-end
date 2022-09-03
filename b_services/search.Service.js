const VideosSearchRepository = require("../c_repositories/videosSearch.repository");

const axios = require("axios");

class SearchService {
  videosSearchRepository = new VideosSearchRepository();
  // id로 유저 정보 조회
  videoSearchViaDB = async (req, res) => {
    try {
      const { keyword } = req.query;

      // console.log(
      //   `${req.session.passport.user.user.displayName} 님이 ${keyword}를 검색하였습니다.`
      // );

      const returnVideos =
        await this.videosSearchRepository.getVideoSearchByKeyword(keyword);

      res.status(200).json(returnVideos);
    } catch (error) {
      console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
      return res.status(400).json({
        errorMessage: "검색에 실패하였습니다.",
      });
    }
  };
  videoSearchViaYoutube = async (req, res) => {
    try {
      const { keyword } = req.query;

      const url = `https://www.googleapis.com/youtube/v3/search?key=AIzaSyBJg1gJLZT0As7NGbFDHpWFLO_mi4JDw0c&part=id,snippet&maxResults=50&regionCode=kr&q=${encodeURI(
        keyword
      )}`;

      const returnVideos = await axios(url);
      const resultArr = returnVideos.data.items.map((e) => {
        return {
          videoId: e.id.videoId,
          title: e.snippet.title,
        };
      });

      // ------------- DB에 저장 추가 필요 ----------

      res.status(200).json(resultArr);
    } catch (error) {
      console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
      return res.status(400).json({
        errorMessage: "검색에 실패하였습니다.",
      });
    }
  };
}

module.exports = SearchService;
