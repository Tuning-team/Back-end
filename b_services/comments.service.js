const CommentRepository = require("../c_repositories/comments.repository");
const CollectionRepository = require("../c_repositories/collections.repository");

class CommentService {
  commentRepository = new CommentRepository();
  collectionRepository = new CollectionRepository();
  //댓글 작성
  leaveCommentOn = async (req, res) => {
    try {
      // 재료
      // const { user_id } = req.session.passport.user.user; // userId
      const user_id = process.env.TEMP_USER_ID;
      const { collection_id } = req.params;
      const { comment } = req.body;

      const thisCollection = await this.collectionRepository.getCollectionById(
        collection_id
      );

      if (!thisCollection) {
        res.status(400).json({ success: false, message: "컬렉션이 없습니다." });
        //존재하면 DB에 코멘트 create
      } else {
        await this.commentRepository.createComment(
          user_id,
          collection_id,
          comment
        );
        res.status(201).json({ success: true, message: "댓글을 생성 하였습니다." });
      }
    } catch (error) {
      console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
      return res.status(400).json({
        errorMessage: "댓글 생성에 실패하였습니다.",
      });
    }
  };

  //댓글 목록 조회
  getCommentOn = async (req, res) => {
    const { collection_id } = req.params;

    const thisCollection = await this.collectionRepository.getCollectionById(
      collection_id
    );
    if (!thisCollection) {
      return {
        status: 400,
        message: "만들어진 컬렉션이 없습니다.",
      };
    } else {
      const allCommentsInfo =
        await this.commentRepository.getAllCommentsOnCollectionId(
          collection_id
        );

      const data = allCommentsInfo.map((el) => {
        // const writerName = await this.userRepository.getUserNameById(el.user_id)

        return {
          comment_id: el._id,
          user_id: el.user_id,
          comment: el.comment,
          createdAt: el.createdAt,
        };
      });

      res.json({
        success: true,
        status: 200,
        message: "댓글 목록을 불러왔습니다.",
        data: data,
      });
    }
  };

  //댓글 수정
  updateComment = async (req, res) => {
    try {
      const user_id = process.env.TEMP_USER_ID;
      const { comment_id } = req.params;
      const { comment } = req.body;

      const commentToUpdate = await this.commentRepository.getCommentDetail(
        comment_id
      );

      if (!commentToUpdate) {
        res.json({ status: 400, message: "해당 댓글이 없습니다." });
      } else if (user_id != commentToUpdate.user_id) {
        res.json({ status: 400, message: "수정 권한이 없습니다." });
      } else {
        const updatedComment = await this.commentRepository.updateComment(
          comment_id,
          comment
        );
        res.status(201).json({
          success: true,          
          message:
            updatedComment.modifiedCount + "개의 데이터가 수정되었습니다.",
        });
      }
    } catch (error) {
      console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
      return res.status(400).json({
        errorMessage: "댓글 수정에 실패하였습니다.",
      });
    }
  };

  //댓글 삭제
  deleteComment = async (req, res) => {
    try {
      const user_id = process.env.TEMP_USER_ID;
      const { comment_id } = req.params;

      const commentToDelete = await this.commentRepository.getCommentDetail(
        comment_id
      );

      console.log("commentToDelete:", commentToDelete);

      if (!commentToDelete) {
        res.json({ status: 400, message: "해당 댓글이 없습니다." });
      } else if (user_id != commentToDelete.user_id) {
        res.json({ status: 400, message: "삭제 권한이 없습니다." });
      } else {
        await this.commentRepository.deleteComment(comment_id);
        res.status(200).json({ success: true, message: "댓글을 삭제하였습니다." });
      }
    } catch (error) {
      console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
      return res.status(400).json({
        errorMessage: "댓글 삭제에 실패하였습니다.",
      });
    }
  };
}

module.exports = CommentService;
