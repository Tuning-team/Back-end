require("dotenv").config(); // 환경변수 적용
// const mongoose = require("mongoose");
// const connect = require("../d_schemas/index.js");
// connect();

const Collections = require("../d_schemas/collection");
const Users = require("../d_schemas/user");

const VideoRepository = require("../c_repositories/videos.repository.js");
const videoRepository = new VideoRepository();
const CollectionsRepository = require("../c_repositories/collections.repository.js");
const collectionsRepository = new CollectionsRepository();
const CommentsRepository = require("../c_repositories/comments.repository.js");
const commentsRepository = new CommentsRepository();
const UsersRepository = require("../c_repositories/users.repository.js");
const usersRepository = new UsersRepository();

const { newVideosSources, commentsToInsert } = require("./initialize-data.js");
const axios = require("axios");

// -------------------- 초기화 동작 ------------------------------

// 1. User 생성 -> 유저는 직접 가입 요청하는 것이 빠름

// 2. DB에 등록된 유저 아이디들을 가지고 컬렉션 목록 생성
// createCollections(newVideosSources);

// 3. Users_Comments_Collections
// userCommentsOnCollections(commentsToInsert);

// 4. Users_likes_Collections
// userlikesCollections();

// 5. Users_follows_Users
// userfollowsUsers();

// -------------- (미완)

// # Users_Keeps_Collections
// # Users_Chooses_Categories

// ytVideosSetter();

// ----------------------- 함수 정의 -----------------------------

class DatabaseInitializer {
  createCollections = async (newVideosSources) => {
    try {
      const users = await Users.find();
      const user_ids = users.map((e) => e._id);

      let category_id, collectionTitle, description, videos, user_id;

      for (let i = 0; i < newVideosSources.length; i++) {
        category_id = newVideosSources[i].category_id;
        collectionTitle = `${newVideosSources[i].keyword} 영상 모음`;
        description = `${newVideosSources[i].keyword} 영상을 모아봤어요. ${newVideosSources[i].addDescription}`;

        let videosList = await axios.get(encodeURI(`https://api.tube-tuning.com/youtubesearch?q=${newVideosSources[i].keyword}`));

        videos = videosList.data.results
          .map((e) => {
            return e.video ? e.video.id : null;
          })
          .slice(0, newVideosSources[i].howmanyVideos);

        const createdVideos = await videoRepository.createVideosByIds(videos);
        category_id = [category_id];

        const video_ids = Array.from(new Set(createdVideos.map((e) => e._id.toString())));

        user_id = user_ids[i % user_ids.length]; // 반복

        const returnCollection = await collectionsRepository.createCollection(
          user_id,
          category_id,
          collectionTitle,
          description,
          video_ids // ["",""]
        );

        // mycollections 배열에도 collection_id 추가
        let { myCollections } = await Users.findOne({ _id: user_id });

        myCollections.push(returnCollection._id.toString());
        myCollections = Array.from(new Set(myCollections));

        await Users.findOneAndUpdate({ _id: user_id }, { $set: { myCollections } });

        console.log({
          success: true,
          message: "컬렉션을 생성하였습니다.",
          // data: returnCollection,
        });
      }
    } catch (error) {
      console.log(`${error.message}`);
    }
  };

  userCommentsOnCollections = async (commentsToInsert) => {
    try {
      const users = await Users.find();
      const user_ids = users.map((e) => e._id);

      const collections = await Collections.find();
      const collection_ids = collections.map((e) => e._id);

      commentsToInsert = [...commentsToInsert, ...commentsToInsert];

      for (let i = 0; i < commentsToInsert.length; i++) {
        const comment = commentsToInsert[i].comments;
        const user_id = user_ids[i % user_ids.length]; // 반복
        const collection_id = collection_ids[i % collection_ids.length]; // 반복

        const createdComment = await commentsRepository.createComment(user_id, collection_id, comment);
      }
    } catch (error) {
      console.log(`${error.message}`);
    }
  };

  userlikesCollections = async () => {
    try {
      const users = await Users.find();
      const user_ids = users.map((e) => e._id);

      const collections = await Collections.find();
      const collection_ids = collections.map((e) => e._id);

      for (let i = 0; i < collection_ids.length; i++) {
        const user_id = user_ids[i % user_ids.length]; // 반복
        const collection_id = collection_ids[(i + 2) % collection_ids.length]; // 반복

        const { myLikingCollections } = await usersRepository.getUserById(user_id);

        if (!myLikingCollections.includes(collection_id)) {
          await collectionsRepository.likeCollection(collection_id.toString());
          await usersRepository.likeCollection(user_id, collection_id.toString());
        }

        console.log(`${user_id}가 ${collection_id} 좋아함`);
      }
    } catch (error) {
      console.log(`${error.message}`);
    }
  };

  userfollowsUsers = async () => {
    try {
      const users = await Users.find();
      const user_ids = users.map((e) => e._id);

      for (let i = 0; i < user_ids.length * 7; i++) {
        const user_id = user_ids[i % user_ids.length];
        const user_id_2 = user_ids[((i + 3) * 2) % user_ids.length];

        const user = await usersRepository.getUserById(user_id);

        if (!user.followings.includes(user_id_2) && user_id !== user_id_2) {
          //팔로우
          await usersRepository.followUser(user_id, user_id_2);

          console.log({
            success: true,
            message: `${user_id}가 ${user_id_2}를 팔로우합니다.`,
          });
        } else {
          //언팔로우
          await usersRepository.unfollowUser(user_id, user_id_2);

          console.log({
            success: true,
            message: `${user_id}가 ${user_id_2}팔로우를 취소했습니다.`,
          });
        }
      }
    } catch (error) {
      console.log(`${error.message}`);
    }
  };

  ytVideosSetter = async () => {
    // 모든 컬렉션 하나씩 돌면서,
    const allCollections = await collectionsRepository.getAllCollections();

    for (let i = 0; i < allCollections.length; i++) {
      let array = [];
      for (let j = 0; j < allCollections[i].videos.length; j++) {
        const { videoId } = await videoRepository.getVideoById(allCollections[i].videos[j]);
        array.push(videoId);
      }
      await Collections.findOneAndUpdate({ _id: allCollections[i]._id.toString() }, { $set: { ytVideos: array } });
    }

    // videos id 활용해서 youtube videos를 찾음
    // 그 배열을 다시 그 컬렉션에 넣음
  };
}

module.exports = DatabaseInitializer;
