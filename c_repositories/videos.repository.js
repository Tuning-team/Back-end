const Video = require("../d_schemas/video");

class VideoRepository {
  //비디오 조회
  getVideoById = async (_id) => {
    const thisVideo = await Video.findOne({ _id });
    return thisVideo;
  };  

  //작성된 비디오들 조회
  getAllVideos = async (orderBy = "DESC") => {
    const allVideos = await Video.find({
      order: [["createdAt", orderBy]],
    });

    return allVideos;
  };  

  //생성
  createVideo = async (
    videoId,
    videoTitle,
    category_id,
    channelTitle,
    channel_id,
    thumbnails
  ) => {
    const createdVideo = await Video.create({
      videoId,
      videoTitle,
      category_id,
      channelTitle,
      channel_id,
      thumbnails,
    });

    return createdVideo;
  };

  //수정
  updateVideo = async (
    video_id,
    videoTitle,
    category_id,
    channelTitle,
    channel_id,
    thumbnails
  ) => {
    const updatedVideo = await Video.updateOne(
      { videoTitle, category_id, channelTitle, thumbnails },
      { _id: video_id }
    );
    return updatedVideo;
  };
  //삭제
  deleteVideo = async (_id) => {
    const deletedVideo = await Video.deleteOne({ _id: _id });

    return deletedVideo;
  };
}

module.exports = VideoRepository;
