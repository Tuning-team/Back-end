const CommentRepository = require("../c_repositories/comments.repository");
const CollectionRepository = require("../c_repositories/collections.repository");
const UserRepository = require("../c_repositories/users.repository");
const { insertMany } = require("../d_schemas/videoSearch");

class CommentService {
  commentRepository = new CommentRepository();
  collectionRepository = new CollectionRepository();
  userRepository = new UserRepository();
  //댓글 작성
  leaveCommentOn = async (req, res) => {
    try {
      // 재료
      // const { user_id } = req.session.passport.user.user; // userId
      const user_id = req.session.passport
        ? req.session.passport.user.user._id
        : process.env.TEMP_USER_ID;
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
        res
          .status(201)
          .json({ success: true, message: "댓글을 생성 하였습니다." });
      }
    } catch (error) {
      console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
      res.status(400).json({
        success: false,
        message: "댓글을 생성하는 데에 실패했습니다. ",
      });
    }
  };

  //댓글 목록 조회
  getCommentOn = async (req, res) => {
    try {
      const { collection_id } = req.params;

      const thisCollection = await this.collectionRepository.getCollectionById(
        collection_id
      );
      if (!thisCollection) {
        res.status(400).json({
          status: false,
          message: "만들어진 컬렉션이 없습니다.",
        });
      } else {
        const allCommentsInfo =
          await this.commentRepository.getAllCommentsOnCollectionId(
            collection_id
          );

        // let data = [];
        // for (let i = 0; i < allCommentsInfo.length; i++) {
        //   const writerInfo = await this.userRepository.getUserById(
        //     allCommentsInfo[i].user_id
        //   );

        //   console.log(writerInfo);
        //   data.push({
        //     comment_id: allCommentsInfo[i]._id,
        //     user_id: allCommentsInfo[i].user_id,
        //     writerName: writerInfo.displayName,
        //     writerProfilePic: writerInfo.profilePicUrl,
        //     comment: allCommentsInfo[i].comment,
        //     createdAt: allCommentsInfo[i].createdAt,
        //   });
        // }

        const data = await Promise.all(
          allCommentsInfo.map(async (el) => {
            const writerInfo = await this.userRepository.getUserById(
              el.user_id
            );

            return {
              comment_id: el._id,
              user_id: el.user_id,
              writerName: writerInfo.displayName,
              writerProfilePic: writerInfo.profilePicUrl,
              comment: el.comment,
              createdAt: el.createdAt,
            };
          })
        );

        res.status(200).json({
          status: true,
          message: "댓글 목록을 불러왔습니다.",
          data: data,
        });
      }
    } catch (error) {
      console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
      res
        .status(400)
        .json({ success: false, message: "댓글 목록 조회에 실패하였습니다." });
    }
  };

  //댓글 수정
  updateComment = async (req, res) => {
    try {
      const user_id = req.session.passport
        ? req.session.passport.user.user._id
        : process.env.TEMP_USER_ID;
      const { comment_id } = req.params;
      const { comment } = req.body;

      const commentToUpdate = await this.commentRepository.getCommentDetail(
        comment_id
      );

      if (!commentToUpdate) {
        res
          .status(400)
          .json({ success: false, message: "해당 댓글이 없습니다." });
      } else if (user_id != commentToUpdate.user_id) {
        res
          .status(400)
          .json({ success: false, message: "수정 권한이 없습니다." });
      } else {
        const updatedComment = await this.commentRepository.updateComment(
          comment_id,
          comment
        );
        res.status(200).json({
          success: true,
          message:
            updatedComment.modifiedCount + "개의 데이터가 수정되었습니다.",
        });
      }
    } catch (error) {
      console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
      res
        .status(400)
        .json({ success: false, message: "댓글 수정에 실패하였습니다." });
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

      if (!commentToDelete) {
        res
          .status(400)
          .json({ success: false, message: "해당 댓글이 없습니다." });
      } else if (user_id != commentToDelete.user_id) {
        res
          .status(400)
          .json({ success: false, message: "삭제 권한이 없습니다." });
      } else {
        await this.commentRepository.deleteComment(comment_id);
        res.status(200).json({
          success: true,
          message: "댓글이 삭제되었습니다.",
        });
      }
    } catch (error) {
      console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
      res
        .status(400)
        .json({ success: false, message: "댓글 삭제에 실패하였습니다." });
    }
  };
}

module.exports = CommentService;
