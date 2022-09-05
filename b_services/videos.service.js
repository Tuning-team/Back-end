const VideoRepository = require("../c_repositories/videos.repository");
3;
const CollectionRepository = require("../c_repositories/collections.repository");
const axios = require("axios");

class VideoService {
  videoRepository = new VideoRepository();
  collectionRepository = new CollectionRepository();

  //비디오 리스트 보기
  getVideosOn = async (req, res) => {
    try {
      // 재료
      const { collection_id } = req.params;
      const { offset, limit } = req.query;

      const { videosIdToShow, totalVideosView, hasNext } = 
        await this.collectionRepository.getCollectionByIdWithPaging(
          collection_id,
          offset,
          limit
        );

      // const thisCollection = await this.collectionRepository.getCollectionById(
      //   collection_id
      // );

      if (!videosIdToShow) {
        res
          .status(400)
          .json({ success: false, message: "해당하는 영상이 없습니다." });
      } else {
        // const videosArray = thisCollection.videos; // ["p9HjZshdjt4", .... ]

        let element;
        let data = [];
        for (let i = 0; i < videosIdToShow.length; i++) {
          element = await this.videoRepository.getVideoById(videosIdToShow[i]);
          data.push(element);
        }

        res.status(200).json({
          success: true,
          message: "비디오 목록을 불러왔습니다.",
          data: data,
          pageInfo: { totalVideosView, hasNext },
        });
      }
    } catch (error) {
      console.log(error);
      res
        .status(400)
        .json({ success: false, message: "검색에 실패하였습니다." });
    }
  };

  //비디오 상세 조회
  getVideosDetail = async (req, res) => {
    try {
      // 비디오 DB 아이디 -> DB 찾아보고
      const { video_id } = req.params;
      const thisVideo = await this.videoRepository.getVideoById(video_id);

      if (!thisVideo) {
        res
          .status(400)
          .json({ success: false, message: "해당 컬렉션이 없습니다." });

        // 찾으면 그 비디오의 유튜브 아이디로 영상 디테일을 확보
      } else {
        const axiosResult = await axios.get(
          `https://www.googleapis.com/youtube/v3/videos?key=AIzaSyBJg1gJLZT0As7NGbFDHpWFLO_mi4JDw0c&part=snippet&regionCode=kr&id=${thisVideo.videoId}`
        );

        res.status(200).json({
          success: true,
          message: "비디오 목록을 불러왔습니다.",
          data: axiosResult.data.items,
        });
      }
    } catch (error) {
      console.log(error);
      res
        .status(400)
        .json({ success: false, message: "검색에 실패하였습니다." });
    }
  };
}
module.exports = VideoService;
