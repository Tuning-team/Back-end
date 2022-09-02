const VideoRepository = require("../c_repositories/videos.repository");3
const CollectionRepository = require("../c_repositories/collections.repository");


class VideoService {
  videoRepository = new VideoRepository();
  collectionRepository = new CollectionRepository();

  //비디오 리스트 보기

  getVideosOn = async (_id) => {
    const thisCollection = await thist.collectionRepository.getColletion(
      _id
    );
    if(!thisCollection) {
      return {
        status: 400,
        message: "만들어진 컬렉션이 없습니다.",
        data: undefined,
      };
    } else {
      const allVideosInfo = await this.videoRepository.getAllVideos(
        _id
      );

      const data = allVideosInfo.map((el) => {
        return {
          _id: el._id,
          videoTitle: el.videoTitle,
          category_id: el.category_id,
          channelTitle: el.channelTitle,
          channel_id: el.channel_id,
          thumbnails: el.thumbnails,
        };
      });

      return { status: 200, message: "비디오 목록을 불러왔습니다.", data: data };
    }
  };
  //비디오 상세 조회
  getVideos = async () => {
    const thisVideos = await this.videoRepository.getVideoById(_id);
    if(!thisVideos) {
      return {message: "해당 영상이 없습니다."};
    } else {
      return{
        _id:_id,
        videoTitle: videoTitle,
        category_id: category_id,
        channelTitle: channelTitle,
        channel_id: channel_id,
        thumbnails: thumbnails,
      };
    }
  }


};
module.exports = VideoService;