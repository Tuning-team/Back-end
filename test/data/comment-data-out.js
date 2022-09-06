const createCommentRes = {
  success: true,
  message: "댓글을 생성 하였습니다."
}

const deleteCommentRes = {
  success: true,
  message: "댓글을 삭제하였습니다."
}

const getCommentsRes = {      
    message: "댓글 목록을 불러왔습니다.",
    data: [
      {
        comment_id: "63136b9625b3d37574b18bee",
        user_id: "63118adb34c4109b398b1293",
        comment: "오 이런 컬렉션도 좋은 것 같아요!!",
        createdAt: "2022-09-03T14:58:30.675Z"
      },
      {
        comment_id: "6313486d790ff28463330af9",
        user_id: "63118adb34c4109b398b1293",
        comment: "오 이런 컬렉션도 좋은 것 같아요!!",
        createdAt: "2022-09-03T12:28:29.449Z"
      }
    ]
  }

  module.exports = {
    createCommentRes,
    deleteCommentRes,
    getCommentsRes
  }