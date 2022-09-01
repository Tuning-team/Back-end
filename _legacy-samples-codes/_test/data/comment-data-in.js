// 댓글 관련 인풋데이터로 사용할법한 mock 데이터를 정리해놓고, export하여 외부에서 사용할 수 있게 함

const createCommentReq = {
  comment: "안녕하세요 이번에 1번 게시글에 새로 작성한 댓글입니다.",
};

const updateCommentReq = {
  comment: "수정된 댓글입니다.",
};

module.exports = { createCommentReq, updateCommentReq };
