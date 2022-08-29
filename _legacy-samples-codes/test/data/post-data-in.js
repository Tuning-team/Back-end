// 게시글 관련 인풋데이터로 사용할법한 mock 데이터를 정리해놓고, export하여 외부에서 사용할 수 있게 함

const createPostReq = {
  title: "게시글 제목입니다. sImlhdCI6MTY1OTk2MzA",
  content: "content 입니다.",
};

const sampleBaseReq_1 = {
  title: "게시글 제목입니다. 1",
  content: "content 입니다. AA",
};
const sampleBaseReq_2 = {
  title: "게시글 제목입니다. 2",
  content: "content 입니다. BB",
};
const sampleBaseReq_3 = {
  title: "게시글 제목입니다. 3",
  content: "content 입니다. CC",
};
const sampleBaseReq_4 = {
  title: "게시글 제목입니다. 4",
  content: "content 입니다. DD",
};

const updatePostReq = {
  title: "수정된 게시글 입니다.",
  content: "content 입니다.",
};

module.exports = {
  createPostReq,
  updatePostReq,
  sampleBaseReq_1,
  sampleBaseReq_2,
  sampleBaseReq_3,
  sampleBaseReq_4,
};
