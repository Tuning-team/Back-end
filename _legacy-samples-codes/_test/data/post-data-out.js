// 게시글 관련 아웃풋 데이터로 사용할법한 mock 데이터를 정리해놓고, export하여 외부에서 사용할 수 있게 함

const createPostRes = {
  message: "게시글 작성에 성공하였습니다.",
};

const getPostsRes = {
  data: [
    {
      postId: 8,
      userId: 2,
      nickname: "Developer",
      title: "안녕하세요 2번째 게시글 제목입니다.",
      createdAt: "2022-08-04T14:45:40.000Z",
      updatedAt: "2022-08-04T14:45:40.000Z",
      likes: 0,
    },
    {
      postId: 7,
      userId: 2,
      nickname: "Developer",
      title: "안녕하세요 2번째 게시글 제목입니다.",
      createdAt: "2022-08-03T20:55:18.000Z",
      updatedAt: "2022-08-03T20:55:18.000Z",
      likes: 1,
    },
  ],
};
const getPostsResAscending = {
  data: [
    {
      postId: 7,
      userId: 2,
      nickname: "Developer",
      title: "안녕하세요 2번째 게시글 제목입니다.",
      createdAt: "2022-08-03T20:55:18.000Z",
      updatedAt: "2022-08-03T20:55:18.000Z",
      likes: 1,
    },
    {
      postId: 8,
      userId: 2,
      nickname: "Developer",
      title: "안녕하세요 2번째 게시글 제목입니다.",
      createdAt: "2022-08-04T14:45:40.000Z",
      updatedAt: "2022-08-04T14:45:40.000Z",
      likes: 0,
    },
  ],
};

const getPostDetailRes = {
  data: {
    postId: 8,
    userId: 4,
    nickname: "Tester3",
    title: "안녕하세요 2번째 게시글 제목입니다.",
    content: "안녕하세요 content 입니다.",
    createdAt: "2022-08-04T14:45:40.000Z",
    updatedAt: "2022-08-04T14:45:40.000Z",
    likes: 0,
  },
};

const createdPostRes = {
  data: {
    postId: 9,
    userId: 5,
    nickname: "Tester4",
    title: "새로생성한 글의 제목",
    content: "안녕하세요 새로 생성한 글의 content 입니다.",
    createdAt: "2022-08-04T14:45:40.000Z",
    updatedAt: "2022-08-04T14:45:40.000Z",
    likes: 0,
  },
};

const updatedPostRes = {
  data: {
    postId: 9,
    userId: 5,
    nickname: "Tester4",
    title: "수정한 글의 제목",
    content: "안녕하세요 수정한 글의 content 입니다.",
    createdAt: "2022-08-04T14:45:40.000Z",
    updatedAt: "2022-08-04T14:45:40.000Z",
    likes: 0,
  },
};

const getPostDetailRes_otherWriter = {
  data: {
    postId: 8,
    userId: 5,
    nickname: "Tester4",
    title: "안녕하세요 2번째 게시글 제목입니다.",
    content: "안녕하세요 content 입니다.",
    createdAt: "2022-08-04T14:45:40.000Z",
    updatedAt: "2022-08-04T14:45:40.000Z",
    likes: 0,
  },
};

const updatePostRes = {
  message: "게시글을 수정하였습니다.",
};
const deletePostRes = {
  message: "게시글을 삭제하였습니다.",
};

const getlikedPostsRes = {
  data: [
    {
      postId: 7,
      userId: 2,
      nickname: "Developer",
      title: "안녕하세요 2번째 게시글 제목입니다.",
      createdAt: "2022-08-03T20:55:18.000Z",
      updatedAt: "2022-08-03T20:55:18.000Z",
      likes: 1,
    },
    {
      postId: 3,
      userId: 1,
      nickname: "Developer",
      title: "안녕하세요 2번째 게시글 제목입니다.",
      createdAt: "2022-08-03T20:55:18.000Z",
      updatedAt: "2022-08-03T20:55:18.000Z",
      likes: 1,
    },
  ],
};

const likePostRes = {
  message: "게시글의 좋아요를 등록하였습니다.",
};

const dislikePostRes = {
  message: "게시글의 좋아요를 취소하였습니다.",
};

module.exports = {
  createPostRes,
  getPostsRes,
  getPostsResAscending,
  getPostDetailRes,
  getPostDetailRes_otherWriter,
  updatePostRes,
  deletePostRes,
  getlikedPostsRes,
  likePostRes,
  dislikePostRes,
  createdPostRes,
  updatedPostRes,
};
