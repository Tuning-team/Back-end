/* 여기에 전달될 클라이언트의 요청을 적절히 나누어 처리보내고 반환해주는 역할을 함 (요청 수신, 데이터 검증, 결과 반환, 예외처리) */
// 라우터에서 사용할 컨트롤러 클래스와 그 안의 메소드를 정의
// 그 과정에서, 다시 각 메소드가 사용할 서비스 클래스를 필요로 함(require)

const CommentService = require("../services/comments.service");

// Post의 컨트롤러(Controller)역할을 하는 클래스
class CommentsController {
  commentService = new CommentService(); // Post 서비스를 클래스를 컨트롤러 클래스의 멤버 변수로 할당합니다.

  leaveComment = async (req, res, next) => {
    console.log("** --- CommentsController.leaveComment ---");

    try {
      // 받은 변수 정리, 예외처리
      console.log(res.locals, req.params, req.body);
      const { user } = await res.locals;
      const { _postId } = req.params;
      const { comment } = req.body;

      if (typeof comment !== "string") {
        return res.status(400).json({ message: "잘못된 접근입니다." });
      }
      if (!comment) {
        return res.status(400).json({ message: "댓글 내용을 입력해주세요" });
      }

      if (!Number.isInteger(Number(_postId))) {
        next();
        return;
      }

      // 서비스 계층으로부터 답을 받음
      const { status, message } = await this.commentService.leaveCommentOn(
        user,
        _postId,
        comment
      );

      console.log("** --- CommentsController.leaveComment returns ---");
      return res.status(status).send({ message });

      // 예외시 처리
    } catch (error) {
      const message = `${req.method} ${req.originalUrl} : ${error.message}`;
      return res.status(400).send({ message });
    }
  };

  getCommentsOn = async (req, res, next) => {
    try {
      console.log("** --- CommentsController.getCommentsOn ---");

      // 받은 변수 정리, 예외처리
      const { _postId } = req.params;

      // 댓글 목록 조회
      const { status, message, data } = await this.commentService.getCommentsOn(
        _postId
      );

      // 상탱와 데이터 응답
      console.log("** --- CommentsController.getCommentsOn returns---");
      return res.status(status).json({ message, data: data });

      // 예외시 처리
    } catch (error) {
      const message = `${req.method} ${req.originalUrl} : ${error.message}`;
      res.status(400).send({ message });
    }
  };

  updateComment = async (req, res, next) => {
    try {
      console.log("** --- CommentsController.updateComment ---");
      // 필요한 변수 확보 및 검증
      const { user } = await res.locals;
      const { _commentId } = req.params;
      const { comment } = req.body;

      if (typeof comment !== "string") {
        return res.status(400).json({ message: "잘못된 접근입니다." });
      }

      if (!comment) {
        return res.status(400).json({ message: "댓글 내용을 입력해주세요" });
      }

      if (!Number.isInteger(Number(_commentId))) {
        next();
        return;
      }
      const { status, message } = await this.commentService.updateComment(
        user,
        _commentId,
        comment
      );

      console.log("** --- CommentsController.updateComment returns ---");
      return res.status(status).json({ message });
    } catch (error) {
      const message = `${req.method} ${req.originalUrl} : ${error.message}`;
      res.status(400).send({ message });
    }
  };

  deleteComment = async (req, res, next) => {
    try {
      console.log("** --- CommentsController.deleteComment ---");
      // 필요한 변수 확보 및 검증
      const { user } = await res.locals;
      const { _commentId } = req.params;

      const { status, message } = await this.commentService.deleteComment(
        user,
        _commentId
      );

      console.log("** --- CommentsController.deleteComment returns ---");
      return res.status(status).json({ message });

      // 예외시 처리
    } catch (error) {
      const message = `${req.method} ${req.originalUrl} : ${error.message}`;
      res.status(400).send({ message });
    }
  };
}

module.exports = CommentsController;
