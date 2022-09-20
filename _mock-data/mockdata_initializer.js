require("dotenv").config(); // 환경변수 적용
const mongoose = require("mongoose");
const connect = require("../d_schemas/index.js");
connect();

const Collections = require("../d_schemas/collection");
const Users = require("../d_schemas/user");

const VideoRepository = require("../c_repositories/videos.repository.js");
const videoRepository = new VideoRepository();
const CollectionsRepository = require("../c_repositories/collections.repository.js");
const collectionsRepository = new CollectionsRepository();
const CommentsRepository = require("../c_repositories/comments.repository.js");
const commentsRepository = new CommentsRepository();

const axios = require("axios");

// Categories 유지
// 1. 목데이터 기초데이터 초기화
// const usersMock = [
//   {
//     displayName: "Bohyeon Kim",
//     email: "bohyeon.kim@creatrip.com",
//     firstName: "Bohyeon",
//     googleId: "100616319075678080000",
//     lastName: "Kim",
//     profilePicUrl:
//       "https://lh3.googleusercontent.com/a/AItbvmkSJ_xTohZASxEYTNzTumaAkOEK36BQqs38Q60V=s96-c",
//     myLikingCollectionsArr: [],
//     myCollections: [],
//     myInterestingCategories: [],
//     myKeepingCollections: [],
//     Followings: [],
//   },
//   {
//     displayName: "Bohyeon Kim",
//     email: "love.free.work@gmail.com",
//     firstName: "Bohyeon",
//     googleId: "114468525483681450000",
//     lastName: "Kim",
//     profilePicUrl:
//       "https://lh3.googleusercontent.com/a/AItbvmmUdDch2QKNWgijUsMvskVPeT9WDqEiABVBdIme=s96-c",
//     myLikingCollectionsArr: [],
//     myCollections: [],
//     myInterestingCategories: [],
//     myKeepingCollections: [],
//     Followings: [],
//   },
//   {
//     displayName: "김승민",
//     email: "apod123@naver.com",
//     firstName: "승민",
//     googleId: "116283305152524710000",
//     lastName: "김",
//     profilePicUrl:
//       "https://lh3.googleusercontent.com/a/AItbvmm-deZJTslcxU7fDYb_sjfF4QzZVT2C6YXtsmc=s96-c",
//     myLikingCollectionsArr: [],
//     myCollections: [],
//     myInterestingCategories: [],
//     myKeepingCollections: [],
//     Followings: [],
//   },
//   {
//     displayName: "김혜미",
//     email: "hemi33379@gmail.com",
//     firstName: "혜미",
//     googleId: "113490520324722500000",
//     lastName: "김",
//     profilePicUrl:
//       "https://lh3.googleusercontent.com/a/AItbvml_ySVSzUsDoVOQmADwCbMTCR_8vtAgEGCmy0qy=s96-c",
//     myLikingCollectionsArr: [],
//     myCollections: [],
//     myInterestingCategories: [],
//     myKeepingCollections: [],
//     Followings: [],
//   },
//   {
//     displayName: "minji jeon",
//     email: "minji799@gmail.com",
//     firstName: "minji",
//     googleId: "101016712867465310000",
//     lastName: "jeon",
//     profilePicUrl:
//       "https://lh3.googleusercontent.com/a/AItbvml37SSBx3o0P6bj2LLaukBX_zF3g9AkxMShux70=s96-c",
//     myLikingCollectionsArr: [],
//     myCollections: [],
//     myInterestingCategories: [],
//     myKeepingCollections: [],
//     Followings: [],
//   },
//   {
//     displayName: "김보현",
//     email: "bh.kim@nemolab.co.kr",
//     firstName: "보현",
//     googleId: "102769972251218740000",
//     lastName: "김",
//     profilePicUrl:
//       "https://lh3.googleusercontent.com/a/AItbvmkN5T19KzoVP8PibD-oYmuumzRYetnovwkZqf_q=s96-c",
//     myLikingCollectionsArr: [],
//     myCollections: [],
//     myInterestingCategories: [],
//     myKeepingCollections: [],
//     Followings: [],
//   },
//   {
//     displayName: "Hyo c.",
//     email: "0612hyo@gmail.com",
//     firstName: "Hyo",
//     googleId: "104694908366357950000",
//     lastName: "c.",
//     profilePicUrl:
//       "https://lh3.googleusercontent.com/a-/AFdZucoR5PD1h8BTkMwTERbM8HoNXSfDLenrN0dttjGq=s96-c",
//     myLikingCollectionsArr: [],
//     myCollections: [],
//     myInterestingCategories: [],
//     myKeepingCollections: [],
//     Followings: [],
//   },
//   {
//     displayName: "지나(Gina)",
//     email: "jinhahyung@gmail.com",
//     firstName: "지나",
//     googleId: "105043932044972690000",
//     lastName: "",
//     profilePicUrl:
//       "https://lh3.googleusercontent.com/a/AItbvmmTDoFzhZMQ55PkxoR-b7IgOS_s4pgkNl2g0GAW=s96-c",
//     myLikingCollectionsArr: [],
//     myCollections: [],
//     myInterestingCategories: [],
//     myKeepingCollections: [],
//     Followings: [],
//   },
//   {
//     displayName: "Gginaa",
//     email: "india.gginaa@gmail.com",
//     firstName: "Gginaa",
//     googleId: "114464190465489300000",
//     lastName: "",
//     profilePicUrl:
//       "https://lh3.googleusercontent.com/a/ALm5wu2lrJJvv-ezQsed1o4nJZkizOBfS5dwXN72MpDN=s96-c",
//     myLikingCollectionsArr: [],
//     myCollections: [],
//     myInterestingCategories: [],
//     myKeepingCollections: [],
//     Followings: [],
//   },
// ];

// try {
//   Users.create(usersMock).then((e) => console.log(e));
// } catch (error) {
//   console.log(error);
// }

// User 생성 완료

// 2. 이 유저 아이디들을 가지고 컬렉션 목록 생성
// # 함수 1 OO 영상 모음 -> OO 검색해서 video 만들고, 등록
// const newVideosSources = [
//   {
//     Keyword: "축구",
//     addDescription: "재밌게 봐주세요.",
//     Category: "6319aeebd1e330e86bbade8f",
//     howmanyVideos: 8,
//   },
//   {
//     Keyword: "NBA",
//     addDescription: "모두 함께 해요.",
//     Category: "6319aeebd1e330e86bbade8f",
//     howmanyVideos: 5,
//   },
//   {
//     Keyword: "BTS",
//     addDescription: "댓글로 비슷한 영상 추천해주세요.",
//     Category: "6319aeebd1e330e86bbade9e",
//     howmanyVideos: 4,
//   },
//   {
//     Keyword: "LofiHiphop",
//     addDescription: "너무너무 좋아요",
//     Category: "6319aeebd1e330e86bbade9e",
//     howmanyVideos: 9,
//   },
//   {
//     Keyword: "런닝맨",
//     addDescription: "재미있어요.",
//     Category: "6319aeebd1e330e86bbade95",
//     howmanyVideos: 8,
//   },
//   {
//     Keyword: "지구오락실",
//     addDescription: "너무너무 재밌어요.",
//     Category: "6319aeebd1e330e86bbade95",
//     howmanyVideos: 10,
//   },
//   {
//     Keyword: "토스PO",
//     addDescription: "재밌게 봐주세요.",
//     Category: "6319aeebd1e330e86bbade80",
//     howmanyVideos: 12,
//   },
//   {
//     Keyword: "마블",
//     addDescription: "모두 함께 해요.",
//     Category: "6319aeebd1e330e86bbade97",
//     howmanyVideos: 10,
//   },
//   {
//     Keyword: "추천드라마",
//     addDescription: "댓글로 비슷한 영상 추천해주세요.",
//     Category: "6319aeebd1e330e86bbade95",
//     howmanyVideos: 8,
//   },
//   {
//     Keyword: "뉴진스",
//     addDescription: "너무너무 좋아요",
//     Category: "6319aeebd1e330e86bbade9e",
//     howmanyVideos: 9,
//   },
//   {
//     Keyword: "디스커버리",
//     addDescription: "재미있어요.",
//     Category: "6319aeebd1e330e86bbade84",
//     howmanyVideos: 8,
//   },
//   {
//     Keyword: "양브로",
//     addDescription: "너무너무 재밌어요.",
//     Category: "6319aeebd1e330e86bbadea1",
//     howmanyVideos: 10,
//   },
//   {
//     Keyword: "여행",
//     addDescription: "재밌게 봐주세요.",
//     Category: "6319aeebd1e330e86bbade96",
//     howmanyVideos: 11,
//   },
//   {
//     Keyword: "뷰티",
//     addDescription: "모두 함께 해요.",
//     Category: "6319aeebd1e330e86bbade8a",
//     howmanyVideos: 14,
//   },
//   {
//     Keyword: "블랙핑크",
//     addDescription: "댓글로 비슷한 영상 추천해주세요.",
//     Category: "6319aeebd1e330e86bbade9e",
//     howmanyVideos: 8,
//   },
//   {
//     Keyword: "타입스크립트",
//     addDescription: "너무너무 좋아요",
//     Category: "6319aeebd1e330e86bbade80",
//     howmanyVideos: 9,
//   },
//   {
//     Keyword: "리엑트",
//     addDescription: "재미있어요.",
//     Category: "6319aeebd1e330e86bbade80",
//     howmanyVideos: 7,
//   },
//   {
//     Keyword: "힐링",
//     addDescription: "너무너무 재밌어요.",
//     Category: "6319aeebd1e330e86bbadea1",
//     howmanyVideos: 10,
//   },
//   {
//     Keyword: "명상",
//     addDescription: "재밌게 봐주세요.",
//     Category: "6319aeebd1e330e86bbadea1",
//     howmanyVideos: 10,
//   },
//   {
//     Keyword: "마음챙김",
//     addDescription: "모두 함께 해요.",
//     Category: "6319aeebd1e330e86bbade80",
//     howmanyVideos: 8,
//   },
//   {
//     Keyword: "동기부여",
//     addDescription: "댓글로 비슷한 영상 추천해주세요.",
//     Category: "6319aeebd1e330e86bbade80",
//     howmanyVideos: 9,
//   },
//   {
//     Keyword: "코미디",
//     addDescription: "너무너무 좋아요",
//     Category: "6319aeebd1e330e86bbade95",
//     howmanyVideos: 8,
//   },
//   {
//     Keyword: "게임",
//     addDescription: "재미있어요.",
//     Category: "6319aeebd1e330e86bbade7b",
//     howmanyVideos: 10,
//   },
//   {
//     Keyword: "운동",
//     addDescription: "너무너무 재밌어요.",
//     Category: "6319aeebd1e330e86bbade8f",
//     howmanyVideos: 11,
//   },
//   {
//     Keyword: "개발",
//     addDescription: "재밌게 봐주세요.",
//     Category: "6319aeebd1e330e86bbade80",
//     howmanyVideos: 14,
//   },
//   {
//     Keyword: "카카오",
//     addDescription: "모두 함께 해요.",
//     Category: "6319aeebd1e330e86bbade7c",
//     howmanyVideos: 8,
//   },
//   {
//     Keyword: "배민",
//     addDescription: "댓글로 비슷한 영상 추천해주세요.",
//     Category: "6319aeebd1e330e86bbade7c",
//     howmanyVideos: 9,
//   },
//   {
//     Keyword: "감성음악",
//     addDescription: "너무너무 좋아요",
//     Category: "6319aeebd1e330e86bbade9e",
//     howmanyVideos: 7,
//   },
//   {
//     Keyword: "재즈",
//     addDescription: "재미있어요.",
//     Category: "6319aeebd1e330e86bbade9e",
//     howmanyVideos: 14,
//   },
//   {
//     Keyword: "클래식",
//     addDescription: "너무너무 재밌어요.",
//     Category: "6319aeebd1e330e86bbadea6",
//     howmanyVideos: 8,
//   },
//   {
//     Keyword: "골프",
//     addDescription: "재밌게 봐주세요.",
//     Category: "6319aeebd1e330e86bbade8f",
//     howmanyVideos: 9,
//   },
//   {
//     Keyword: "강아지",
//     addDescription: "힐링영상 안고가세요.",
//     Category: "6319aeebd1e330e86bbade86",
//     howmanyVideos: 15,
//   },
// ];
// // newVideosSources 하나씩 돌면서 CollectionsCreating
// const createCollections = async (newVideosSources) => {
//   try {
//     const users = await Users.find();
//     const user_ids = users.map((e) => e._id);
//     console.log("user_ids", user_ids);

//     let category_id, collectionTitle, description, videos, user_id;

//     for (let i = 0; i < newVideosSources.length; i++) {
//       category_id = newVideosSources[i].Category;
//       collectionTitle = `${newVideosSources[i].Keyword} 영상 모음`;
//       description = `${newVideosSources[i].Keyword} 영상을 모아봤어요. ${newVideosSources[i].addDescription}`;

//       let videosList = await axios.get(
//         encodeURI(
//           `http://3.34.136.55:8080/api/search?q=${newVideosSources[i].Keyword}`
//         )
//       );

//       console.log("videosList", videosList.data.results);

//       videos = videosList.data.results
//         .map((e) => {
//           console.log("e.video", e.video);
//           return e.video ? e.video.id : null;
//         })
//         .slice(0, newVideosSources[i].howmanyVideos);

//       console.log("videos", videos);

//       const createdVideos = await videoRepository.createVideosByIds(videos);
//       category_id = [category_id];

//       const video_ids = Array.from(
//         new Set(createdVideos.map((e) => e._id.toString()))
//       );

//       user_id = user_ids[i % user_ids.length]; // 반복

//       const returnCollection = await collectionsRepository.createCollection(
//         user_id,
//         category_id,
//         collectionTitle,
//         description,
//         video_ids // ["",""]
//       );

//       // mycollections 배열에도 collection_id 추가
//       let { myCollections } = await Users.findOne({ _id: user_id });

//       console.log("returnCollection", returnCollection);
//       myCollections.push(returnCollection._id.toString());
//       myCollections = Array.from(new Set(myCollections));
//       console.log("myCollections", myCollections);

//       let updatedUser = await Users.findOneAndUpdate(
//         { _id: user_id },
//         { $set: { myCollections } }
//       );

//       console.log("updatedUser", updatedUser);
//       console.log({
//         success: true,
//         message: "컬렉션을 생성하였습니다.",
//         data: returnCollection,
//       });
//     }
//   } catch (error) {
//     console.log(`${error.message}`);
//   }
// };
// createCollections(newVideosSources);

// 3. User_Comments_Collections
const commentsToInsert = [
  {
    comments: "또 들를게요!",
  },
  {
    comments: "너무너무 좋습니다.",
  },
  {
    comments: "이 컬렉션 좋습니다!",
  },
  {
    comments: "짱짱 튜닝 너무 좋네요",
  },
  {
    comments: "좋아요~~~",
  },
  {
    comments: "감성 터져요",
  },
  {
    comments: "좋아요~~",
  },
  {
    comments: "내 감성~~~ 우어우어",
  },
  {
    comments: "오 이런 컬렉션 좋은 것 같아요!!",
  },
  {
    comments: "오 이런 컬렉션도 좋은 것 같아요!!",
  },
  {
    comments: "진짜 좋아요 짱짱짱 !",
  },
  {
    comments: "퍼가요",
  },
  {
    comments: "오 짱!!",
  },
  {
    comments: "너무너무 좋습니다.",
  },
  {
    comments: "저도 이거 진짜 좋아하는데",
  },
  {
    comments: "딱 제스타일! 너무 좋아요. 퍼갑니다!",
  },
  {
    comments: "오",
  },
  {
    comments: "오오오오 딱 내가 찾던 컬렉션!",
  },
  {
    comments: "좋아요~~~",
  },
  {
    comments: "진짜 좋아요 짱짱짱 !",
  },
  {
    comments: "또 들를게요!",
  },
  {
    comments: "오오오오",
  },
  {
    comments: "짱짱 튜닝 너무 좋네요",
  },
  {
    comments: "오오오오",
  },
  {
    comments: "오오오오 딱 내가 찾던 컬렉션!",
  },
  {
    comments: "감성 터져요",
  },
  {
    comments: "오 이런 컬렉션 좋은 것 같아요!!",
  },
  {
    comments: "내 감성~~~ 우어우어",
  },
  {
    comments: "좋아요~~",
  },
  {
    comments: "이런 컬렉션 만들어주셔서 정말 감사합니다!!",
  },
  {
    comments: "이런 컬렉션 만들어주셔서 정말 감사합니다!!",
  },
  {
    comments: "딱 제스타일! 너무 좋아요. 퍼갑니다!",
  },
  {
    comments: "오",
  },
  {
    comments: "오 짱!!",
  },
  {
    comments: "또 들를게요!",
  },
  {
    comments: "퍼가요",
  },
  {
    comments: "너무너무 좋습니다.",
  },
  {
    comments: "좋아요~~~",
  },
  {
    comments: "저도 이거 진짜 좋아하는데",
  },
  {
    comments: "퍼가요",
  },
  {
    comments: "이 컬렉션 좋습니다!",
  },
  {
    comments: "담아갑니다",
  },
  {
    comments: "진짜 좋아요 짱짱짱 !",
  },
  {
    comments: "오 이런 컬렉션도 좋은 것 같아요!!",
  },
  {
    comments: "딱 내가 찾던 콜렉션이네요!",
  },
  {
    comments: "우와 눈물이 납니다. ㅠ",
  },
];

const userCommentsOnCollections = async (commentsToInsert) => {
  try {
    const users = await Users.find();
    const user_ids = users.map((e) => e._id);
    console.log("user_ids", user_ids);

    const collections = await Collections.find();
    const collection_ids = collections.map((e) => e._id);
    console.log("collection_ids", collection_ids);

    commentsToInsert = [...commentsToInsert, ...commentsToInsert];
    console.log("commentsToInsert", commentsToInsert);

    for (let i = 0; i < commentsToInsert.length; i++) {
      const comment = commentsToInsert[i].comments;
      const user_id = user_ids[i % user_ids.length]; // 반복
      const collection_id = collection_ids[i % collection_ids.length]; // 반복

      const createdComment = await commentsRepository.createComment(
        user_id,
        collection_id,
        comment
      );
      console.log("createdComment", createdComment);
    }
  } catch (error) {
    console.log(`${error.message}`);
  }
};
userCommentsOnCollections(commentsToInsert);

// # User_Keep_Collections
// const collections = Collections.find();
// const collection_ids = collections.map((e) => e._id);
// console.log("collection_ids", collection_ids);

// const userkeepsCollections = async (user_ids, collection_ids) => {
//   try {
//     // userkeepsCollections 하나씩 돌면서
//     // user > myKeepingCollections에 collection_id 저장
//     // collection > collection_ids에 user_id 저장
//   } catch (error) {
//     console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
//   }
// };
// userkeepsCollections();

// const userlikesCollections = async (user_ids, collection_ids) => {
//   try {
//     // userkeepsCollections 하나씩 돌면서
//     // user > myLikingCollections collection_id 저장
//     // collection > collection_ids - like 수 올리기
//   } catch (error) {
//     console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
//   }
// };
// userlikesCollections();

// const userfollowsUsers = async (user_ids) => {
//   try {
//     // user_ids 하나씩 돌면서
//     // user !== user 이면 follow 저장 , Set으로 중복제거
//   } catch (error) {
//     console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
//   }
// };
// userfollowsUsers();

// const userChooseFavoriteCategories = async (user_ids) => {
//   try {
//     // user_ids 하나씩 돌면서
//     // isVisible 카테고리중 2~7개 선택해서 등록
//   } catch (error) {
//     console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
//   }
// };
// userChooseFavoriteCategories();

// const {
// users,
// categories,
// collections,
// comments,
// videos,
// } = require("./main-data-in_wo_ids.js");

// const Users = require("../d_schemas/user");
// const Collections = require("../d_schemas/collection");
// const Comments = require("../d_schemas/comment");
// const Categories = require("../d_schemas/category");
// const Videos = require("../d_schemas/video");

// console.log("users", users);
// console.log("collections", collections);
// console.log("comments", comments);
// console.log("categories", categories);
// console.log("videos", videos);

// try {
// Collections.create(collections).then((e) => console.log(e)); // 완료
// Comments.create(comments).then((e) => console.log(e));
// Categories.create(categories).then((e) => console.log(e)); // 완료
// Videos.create(videos).then((e) => console.log(e)); // 완료
// } catch (error) {
//   console.log(error);
// }

// const dataInitializer = () => {
// const createdCollections = Collections.create(collections);
//   const createdComments = Comments.create(comments);
//   const createdCategories = Categories.create(categories);
//   const createdVideos = Videos.create(videos);
// };

// module.exports = dataInitializer;
