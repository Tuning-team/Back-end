const Comment = require("../d_schemas/comment");

class CommentRepository {
  // 모든 댓글 조회 (기본값 날짜 내림차순)
  getAllComments = async (_id) => {
    const comments = await Comment.find({ collection_id: _id }).sort({ createdAt: -1 });
 
    return comments;
  };

  // commentId에 해당하는 댓글을 불러옴
  getCommentDetail = async (_id) => {
    const thisComment = await Comment.findOne({ _id });

    return thisComment;
  };

  // collection_id에 해당하는 컬렉션에 댓글 작성
  createComment = async (user_id, collection_id, comment) => {
    const createComment = await Comment.create({
        user_id,
        collection_id,
        comment,
      });
      return createComment;
    };

  // collection_id에 해당하는 컬렉션에 댓글 수정
  updateComment = async (_id, comment) => {
    const updateComment = await Comment.updateOne(
        { _id }, { $set: { comment } }
      );
      return updateComment;
  };

  // collection_id에 해당하는 컬렉션에 댓글 삭제
  deleteComment = async (_id) => {
    const deleteComment = await Comment.deleteOne(
        { _id }
      );
      return deleteComment;
  };
}

module.exports = CommentRepository;