// 댓글 관련 아웃풋(응답) 데이터로 사용할법한 mock 데이터를 정리해놓고, export하여 외부에서 사용할 수 있게 함

const createCommentRes = {
  message: "댓글을 작성하였습니다.",
};

const getCommentDetailRes = {
  commentId: 10,
  userId: 2,
  nickname: "Developer",
  comment: "안녕하세요 2번째 댓글입니다.",
  createdAt: "2022-08-04T14:47:36.000Z",
  updatedAt: "2022-08-04T14:47:36.000Z",
};

const getCommentsRes = {
  data: [
    {
      commentId: 10,
      userId: 2,
      nickname: "Developer",
      comment: "안녕하세요 2번째 댓글입니다.",
      createdAt: "2022-08-04T14:47:36.000Z",
      updatedAt: "2022-08-04T14:47:36.000Z",
    },
    {
      commentId: 9,
      userId: 2,
      nickname: "Developer",
      comment: "안녕하세요 2번째 댓글입니다.",
      createdAt: "2022-08-03T14:47:36.000Z",
      updatedAt: "2022-08-03T14:47:36.000Z",
    },
  ],
};

const getCommentsResAscending = {
  data: [
    {
      commentId: 9,
      userId: 2,
      nickname: "Developer",
      comment: "안녕하세요 2번째 댓글입니다.",
      createdAt: "2022-08-03T14:47:36.000Z",
      updatedAt: "2022-08-03T14:47:36.000Z",
    },
    {
      commentId: 10,
      userId: 2,
      nickname: "Developer",
      comment: "안녕하세요 2번째 댓글입니다.",
      createdAt: "2022-08-04T14:47:36.000Z",
      updatedAt: "2022-08-04T14:47:36.000Z",
    },
  ],
};

const createdCommentRes = {
  _postId: 5,
  commentId: 10,
  userId: 4,
  nickname: "Tester5",
  comment: "안녕하세요 댓글입니다.",
  createdAt: "2022-08-04T14:47:36.000Z",
  updatedAt: "2022-08-04T14:47:36.000Z",
};

const deletedCommentRes = {
  _postId: 6,
  commentId: 11,
  userId: 4,
  nickname: "Tester5",
  comment: "안녕하세요 삭제할 댓글입니다.",
  createdAt: "2022-08-04T14:47:36.000Z",
  updatedAt: "2022-08-04T14:47:36.000Z",
};

const updateCommentRes = {
  message: "댓글을 수정하였습니다.",
};

const deleteCommentRes = {
  message: "댓글을 삭제하였습니다.",
};

module.exports = {
  createCommentRes,
  getCommentsRes,
  updateCommentRes,
  deleteCommentRes,
  createdCommentRes,
  deletedCommentRes,
  getCommentDetailRes,
  getCommentsResAscending,
};
