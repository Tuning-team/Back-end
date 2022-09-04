// 원활한 영상 검색 서비스를 제공하기 위한 영상id 정보를 수집합니다.
require("dotenv").config(); // 환경변수 적용
const mongoose = require("mongoose");
const connect = require("../d_schemas/index.js");
connect();

const VideoSearch = require("../d_schemas/videoSearch");
const axios = require("axios");

class VideoDataBaseCreator {
  // 유튜브에서 제공하는 카테고리 리스트 중 인기동영상이 존재하는 카테고리 id의 리스트만 확보 (retuns Arr)
  getAssignableCategories = async () => {
    const url = `https://www.googleapis.com/youtube/v3/videoCategories?key=AIzaSyBJg1gJLZT0As7NGbFDHpWFLO_mi4JDw0c&part=snippet&regionCode=kr`;

    const list = await axios(url);
    const arr = list.data.items.map((e) => {
      if (e.snippet.assignable === true) {
        return e.id;
      }
    });

    console.log(arr.filter((e) => e !== undefined));
    return arr.filter((e) => e !== undefined);
  };

  // 카테고리 id와 각 페이지마다 존재하는 현재 인기동영상을 50개씩 확보
  getVideoInfoByCategoryId = async (_id, nextPageToken) => {
    try {
      const url = `https://www.googleapis.com/youtube/v3/videos?key=AIzaSyBJg1gJLZT0As7NGbFDHpWFLO_mi4JDw0c&part=snippet&maxResults=50&regionCode=kr&chart=mostPopular&videoCategoryId=${_id}&pageToken=${nextPageToken}`;

      const list = await axios(url);
      return list.data;
    } catch (error) {
      return undefined;
    }
  };

  // 모든 카테고리의 인기동영상을 수집
  createAllPopularVideosToday = async () => {
    // 카테고리 리스트를 확보
    try {
      const arr = await this.getAssignableCategories();

      let nextPageToken;
      for (let category_id of arr) {
        nextPageToken = "";

        const lenthChecker = await this.getVideoInfoByCategoryId(
          category_id,
          nextPageToken
        );
        if (lenthChecker) {
          let pageLength =
            lenthChecker.pageInfo.totalResults /
            lenthChecker.pageInfo.resultsPerPage;

          for (let i = 0; i < pageLength; i++) {
            // i번째 페이지의 동영상 정보들을 불러와서 videosToInsert에 저장
            const videosToInsert = await this.getVideoInfoByCategoryId(
              category_id,
              nextPageToken
            );
            nextPageToken = videosToInsert.nextPageToken;

            const array = await videosToInsert.items.map((e) => {
              return {
                videoId: e.id,
                title: e.snippet.title,
                // description: e.snippet.description,
              };
            });
            console.log("category_id", category_id, ":", array.length);

            VideoSearch.insertMany(array)
              .then((e) => console.log("hey!", e))
              .catch((err) => {
                console.log(err);
              });
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  // 가입자의 accessToken으로 구독채널 확보
  getAllSubscribedChannel = async (accessToken) => {
    try {
      const { data } = await axios.get(
        `https://www.googleapis.com/youtube/v3/subscriptions?key=AIzaSyBJg1gJLZT0As7NGbFDHpWFLO_mi4JDw0c&part=snippet&mine=true&maxResults=50&access_token=${accessToken}`
      );

      const mySubscriptions = data.items.map(
        (e) => e.snippet.resourceId.channelId
      );

      for (let el of mySubscriptions) {
        console.log(el);
      }

      return mySubscriptions;
    } catch (error) {
      console.log(error);
    }
  };

  // 가입자의 accessToken으로 구독채널 리스트 > 재생목록 > 영상을 수집
  createAllVideosOnSubscribed = async (accessToken) => {
    try {
      // 구독한 채널 아이디 리스트 확보
      const mySubscriptions = await this.getAllSubscribedChannel(accessToken);

      // 각 채널들의 영상 수집
      await this.createAllVideosOnChannelIds(mySubscriptions);
    } catch (error) {
      console.log(error);
    }
  };

  // 채널Id의 Array를 넣으면, DB에 그 채널 안의 > 재생목록 > 영상을 수집
  createAllVideosOnChannelIds = async (array) => {
    try {
      for (let el of array) {
        const { data: playlists } = await axios.get(
          `https://www.googleapis.com/youtube/v3/playlists?key=AIzaSyBJg1gJLZT0As7NGbFDHpWFLO_mi4JDw0c&part=id,snippet&channelId=${el}&maxResults=50`
        );

        // 각 채널 플레이리스트 아이디
        const playlistsArr = playlists.items.map((e) => e.id);

        for (let playlist_id of playlistsArr) {
          const { data: videolists } = await axios.get(
            `https://www.googleapis.com/youtube/v3/playlistItems?key=AIzaSyBJg1gJLZT0As7NGbFDHpWFLO_mi4JDw0c&part=id,snippet,contentDetails&playlistId=${playlist_id}&maxResults=50`
          );

          const array = videolists.items.map((e) => {
            return {
              videoId: e.snippet.resourceId.videoId,
              title: e.snippet.title,
              // description: e.snippet.description,
            };
          });

          VideoSearch.insertMany(array)
            .then((e) => console.log("저장완료!", e))
            .catch((err) => {});
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
}

module.exports = VideoDataBaseCreator;

// 매일 1번씩만
const videoDataBaseCreator = new VideoDataBaseCreator();
videoDataBaseCreator.createAllPopularVideosToday();

// 검색 기능
// VideoSearch.find({ title: /아이폰/i }).then((e) => console.log("검색완료!", e));

// 새로 가입한 accessToken
// videoDataBaseCreator.createAllVideosOnSubscribed(
//   "ya29.a0AVA9y1u4ULMc-dW8SfkStIrBwcyadR5wsj4gY54PWL7prB1KWougjQwZxEmR43kp5qRMistPYStlKDnEhWcYPAHhZRiyGAvPFSVGzlpF8DNQveRAEuxjwvNlZ-kddF0tHBzBi7Km53z-VfGLIYiGDhdafPA2aCgYKATASAQASFQE65dr8XPvMDIZo7dWLk4lySmf55A0163"
// );
