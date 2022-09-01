const Video = require("../d_schemas/video");

class VideosRepository {
  //비디오 조회
  getVideoById = async (_id) => {
    const thisVideo = await Video.findOne({ _id:_id });
    return thisVideo;
  }
  //작성된 비디오들 조회
  getAllVideos = async (orderBy = "DESC") => {
    console.log("****** --- VideosRepository.getAllVideos ---");
    const allVideos = await Video.find({
      order: [["createdAt", orderBy]],      
    });

    console.log("****** --- VideosRepository.getAllVideos Returns---");
    return allVideos;
  };
  //생성
  createVideo = async ( video_id, videoTitle, category_id, channelTitle, channel_id, thumbnails ) => {

    const createdVideo = await Video.create({
      video_id,
      videoTitle,
      category_id,
      channelTitle,
      channel_id,
      thumbnails,
    });

    return createdVideo;
  };
//수정
  updateVideo = async (video_id, videoTitle, category_id, channelTitle, channel_id, thumbnails ) => {
    const updatedVideo = await Video.updateOne(
      { videoTitle, category_id, channelTitle, thumbnails },
      { _id: video_id }
    );
    return updatedVideo;
  };
//삭제
  deleteVideo = async (_id) => {
    const deletedVideo = await Video.deleteOne({ _id:_id });

    return deletedVideo;
  };
};

module.exports = VideosRepository;