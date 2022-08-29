// 이 파일에서 사용할 post DB가 어떻게 생겼는지 불러옵니다. (schema/post.js)
const POSTS = require("../schemas/post");
const USERS = require("../schemas/user");

// const user = {
//   _id: "6302e14167f461a60d1605e9",
//   EMAIL: "abc@abc.com",
//   FIRST_NAME: "seungjun",
//   LAST_NAME: "lee",
//   PROFILE_PIC:
//     "https://t4.ftcdn.net/jpg/03/40/12/49/360_F_340124934_bz3pQTLrdFpH92ekknuaTHy8JuXgG7fi.jpg",
//   FOLLOWER: [
//     "630055fce3c4e17206ebec77",
//     "6300482f67dd88e22477039a",
//     "630056affde5db42c7dd4800",
//   ],
//   FOLLOWING: [
//     "630055fce3c4e17206ebec77",
//     "63004dfa1759949daf48394b",
//     "630056affde5db42c7dd4800",
//   ],
//   REGISTER_FROM: "web",
//   DISPLAY_NAME: "seungjun lee",
//   TIMESTAMPS: "2022-08-22T01:52:01.200+00:00",
// };

// ------------------
// TASK 1 : 게시글 조회 with GET ('/api/posts')
exports.getPostsAll = async (req, res) => {
  const user = res.locals.user;

  try {
    // 로그인 유저가 팔로잉 하고 있는 모든 피드(포스트) 정보를 불러옴
    const { _id, FOLLOWING } = user;
    const allPostsOnFeed = await POSTS.find({
      USER_ID: [...FOLLOWING, _id],
    });
    // 노출할 모든 포스트의 정보(유저 정보 포함)를 비동기 리턴하는 함수 정의
    allPostsOnFeedArr = async () => {
      // Promise.all & map 함수를 활용
      const allPostsOnFeedArr = await Promise.all(
        // 각 post 정보 하나하나에서 각 작성자 USER_ID 유저 정보를 불러옴
        allPostsOnFeed.map(async (post) => {
          const writer = await USERS.findOne({ _id: post.USER_ID });
          return {
            postInfo: {
              _id: post._id,
              CONTENT: post.CONTENT,
              POST_PHOTO: post.POST_PHOTO,
              TIMESTAMPS: post.TIMESTAMPS,
            },
            writerInfo: {
              _id: writer._id,
              DISPLAY_NAME: writer.DISPLAY_NAME,
              PROFILE_PIC: writer.PROFILE_PIC,
            },
          };
        })
      );
      return allPostsOnFeedArr;
    };
    const returnArr = await allPostsOnFeedArr();
    // const allPostsOnFeed = require("../dataInitializer/postMockData.json");
    // const search = req.query.search;
    // let result = await POSTS.find({}).lean();
    console.log("res.locals.user", res.locals.user);
    res.status(200).json({
      display_name: res.locals.user.DISPLAY_NAME,
      image: res.locals.user.PROFILE_PIC,
      postDetail: returnArr,
    });
    return;
  } catch (error) {
    const message = `${req.method} ${req.originalUrl} : ${error.message}`;
    return res.send({
      statusCode: 400,
      errReason: message,
    });
  }
};

// ------------------
// TASK 2 : 게시글 작성 with POST ('/api/posts')
exports.createPostPage = async (req, res) => {
  res.render("writePost");
};

exports.createPost = async (req, res) => {
  const user = res.locals.user;
  try {
    const { _id, EMAIL } = res.locals.user;

    // 포스팅 작업
    const { CONTENT } = req.body;
    const createdPost = await POSTS.create({
      USER_ID: _id,
      USER_EMAIL: EMAIL,
      CONTENT,
      POST_PHOTO: "",
      TIMESTAMPS: new Date(),
    });

    res.status(201).json({ createdPost });
    // .redirect("/api");
  } catch (error) {
    const message = `${req.method} ${req.originalUrl} : ${error.message}`;
    console.log(message);
    return res.send({
      statusCode: 400,
      errReason: message,
    });
  }
};

// ------------------
// TASK 3 : 게시글 수정 with PUT ('/api/posts')
exports.updatePost = async (req, res) => {
  try {
    const { _id } = res.locals.user;
    const { post_id, CONTENT, POST_PHOTO_URL } = req.body;

    // 본인확인
    const postExist = await POSTS.findOne({ _id: post_id });
    const foundPost = await POSTS.findOne({ _id: post_id, USER_ID: _id });

    if (!postExist) {
      res.send({
        statusCode: 411,
        errReason: "게시글이 없습니다.",
      });
      return;
    } else if (!foundPost) {
      res.send({
        statusCode: 412,
        errReason: "권한이 없습니다.",
      });
      return;
    }

    // update 작업
    const updatedPost = await POSTS.findOneAndUpdate(
      {
        _id: post_id,
      },
      {
        $set: {
          CONTENT,
          POST_PHOTO: POST_PHOTO_URL,
          TIMESTAMPS: new Date(),
        }, // 나중에 효율화 필요
      }
    );
    res.status(201).json({ statusCode: 201, updatedPost_id: updatedPost._id });
    return;
  } catch (error) {
    const message = `${req.method} ${req.originalUrl} : ${error.message}`;
    console.log(message);
    return res.send({
      statusCode: 400,
      errReason: message,
    });
  }
};

// ------------------
// TASK 4 : 게시글 삭제 with DELETE ('/api/posts')
exports.deletePost = async (req, res) => {
  try {
    const { _id } = res.locals.user;
    const { post_id } = req.params;
    console.log(req.params);
    // 본인확인
    const postExist = await POSTS.findOne({ _id: post_id });
    const foundPost = await POSTS.findOne({ _id: post_id, USER_ID: _id });

    if (!postExist) {
      res.send({
        statusCode: 411,
        errReason: "게시글이 없습니다.",
      });
      return;
    } else if (!foundPost) {
      res.send({
        statusCode: 412,
        errReason: "권한이 없습니다.",
      });
      return;
    }

    // delete 작업
    const deletedPost = await POSTS.deleteOne({
      _id: post_id,
    });

    console.log(deletedPost); //{ acknowledged: true, deletedCount: 1 }

    res.status(200).json({ statusCode: 200, deletedPost_id: post_id });
    return;
  } catch (error) {
    const message = `${req.method} ${req.originalUrl} : ${error.message}`;
    console.log(message);
    return res.send({
      statusCode: 400,
      errReason: message,
    });
  }
};

// ------------------
// TASK 5 : 게시글 검색 with GET ('/api/posts/search?key=넷플릭스')
exports.searchPosts = async (req, res) => {
  try {
    // 로그인 유저가 팔로잉 하고 있는 모든 피드(포스트) 정보를 불러옴
    const { key: keyword } = req.query;

    const allPostsToShow = await POSTS.find({
      CONTENT: { $regex: keyword, $options: "i" },
    });
    const findUserByEmail = await USERS.find({
      EMAIL: { $regex: keyword, $options: "i" },
    });
    const users = findUserByEmail.map((element) => element.DISPLAY_NAME);

    // await // <----- (미완성 상태 )검색결과의 posts를 여기(allPostsToShow)에 주면, 아래에서 user 정보와 함께 return

    // // 노출할 모든 포스트의 정보(유저 정보 포함)를 비동기 리턴하는 함수 정의
    // allPostsOnFeedArr = async () => {
    //   // Promise.all & map 함수를 활용
    //   const allPostsOnFeedArr = await Promise.all(
    //     // 각 post 정보 하나하나에서 각 작성자 USER_ID 유저 정보를 불러옴
    //     allPostsToShow.map(async (post) => {
    //       const writer = await USERS.findOne({ _id: post.USER_ID });

    //       return {
    //         postInfo: {
    //           _id: post._id,
    //           CONTENT: post.CONTENT,
    //           POST_PHOTO: post.POST_PHOTO,
    //           TIMESTAMPS: post.TIMESTAMPS,
    //         },
    //         writerInfo: {
    //           _id: writer._id,
    //           DISPLAY_NAME: writer.DISPLAY_NAME,
    //           PROFILE_PIC: writer.PROFILE_PIC,
    //         },
    //       };
    //     })
    //   );

    //   return allPostsOnFeedArr;
    // };

    // const returnArr = await allPostsOnFeedArr();

    res.status(200).json({ statusCode: 200, allPostsToShow, users });
    return;
  } catch (error) {
    const message = `${req.method} ${req.originalUrl} : ${error.message}`;
    console.log(message);
    return res.send({
      statusCode: 400,
      errReason: message,
    });
  }
};
