const CommentRepository = require("../c_repositories/comments.repository");
const CollectionRepository = require("../c_repositories/collections.repository");

class CommentService {
  commentRepository = new CommentRepository();
  collectionRepository = new CollectionRepository();
  //댓글 작성
  leaveCommentOn = async (_id, collection_id, comment) => {
    const thisCollection = await this.collectionRepository.getColletion(
      collection_id
    );

    if (!thisCollection) {
      return { status: 400, message: "컬렉션이 없습니다." };
      //존재하면 DB에 코멘트 create
    } else {
      await this.commentRepository.createComment(collection_id, _id, comment);
      return { status: 201, message: "댓글을 생성 하였습니다." };
    }
  };
  //댓글 목록 조회
  getCommentOn = async (collection_id) => {
    const thisCollection = await this.collectionRepository.getColletion(
      collection_id
    );
    if (!thisCollection) {
      return {
        status: 400,
        message: "해당 게시글이 없습니다.",
        data: undefined,
      };
    } else {
      const allCommentsInfo = await this.commentRepository.getAllComments(
        collection_id
      );

      const data = allCommentsInfo.map((el) => {
        return {
          commentId: el.comment_id,
          userId: el._id,
          comment: el.comment,
          createdAt: el.createdAt,
        };
      });

      return { status: 200, message: "댓글 목록을 불러왔습니다.", data: data };
    }
  };
  //댓글 수정
  updateComment = async (user_id, comment_id, comment) => {
    const commentToUpdate = await this.commentRepository.getCommentDetail(
      comment_id
    );

    if (!commentToUpdate) {
      return { status: 400, message: "해당 댓글이 없습니다." };
    } else if (user_id != commentToUpdate.user_id) {
      return { status: 400, message: "수정 권한이 없습니다." };
    } else {
      await this.commentRepository.updateComment(comment_id, comment);
      return { status: 201, message: "댓글을 수정하였습니다." };
    }
  };
  //댓글 삭제
  deleteComment = async (user_id, comment_id) => {
    const commentToUpdate = await this.collectionRepository.getCommentDetail(
      comment_id
    );

    if (!commentToUpdate) {
      return { status: 400, message: "해당 댓글이 없습니다." };
    } else if (user_id != commentToUpdate.user_id) {
      return { status: 400, message: "삭제 권한이 없습니다." };
    } else {
      await this.commentRepository.deleteComment(comment_id);
      return { status: 200, message: "댓글을 삭제하였습니다." };
    }
  };
}

module.exports = CommentService;
