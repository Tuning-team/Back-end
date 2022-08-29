// 서비스 레벨에서는 비즈니스 로직을 수행, 데이터를 요청하여 각 케이스별 요구사항 구현, 프레젠테이션 계층과 저장소 계층이 직접 통신하지 않게 함

// 이 파일에서는 댓글 컨트롤러에서 사용할 서비스 클래스와 그 안의 메소드를 정의

// 그 과정에서, 다시 각 메소드가 사용할 저장소 클래스를 필요로 함(require)
const CommentRepository = require("../repositories/comments.repository");
const PostRepository = require("../repositories/posts.repository");

// 댓글 서비스 클래스 선언
class CommentService {
  // 클래스 안에서 활용할 인스턴스를 확보
  commentRepository = new CommentRepository();
  postRepository = new PostRepository();

  // TASK 1. 댓글 작성 메소드
  leaveCommentOn = async (user, postId, comment) => {
    console.log("**** --- CommentService.leaveCommentOn---");

    // 부여받은 정보로 댓글 작성
    const thisPost = await this.postRepository.getPost(postId);

    // 댓글남길 포스트 id 가 존재하지 않으면,
    if (!thisPost) {
      console.log("**** --- CommentService.leaveCommentOn Returns---");
      return { status: 400, message: "해당 게시글이 없습니다." };

      //존재하면 DB에 코멘트 create
    } else {
      await this.commentRepository.createComment(
        postId,
        user.userId,
        user.nickname,
        comment
      );
      console.log("**** --- CommentService.leaveCommentOn Returns---");
      return { status: 201, message: "댓글을 생성하였습니다." };
    }
  };
  // TASK 2. 댓글 목록 조회
  getCommentsOn = async (postId) => {
    console.log("**** --- CommentService.getCommentsOn---");

    // postId에 해당하는 게시글 찾아서 없으면 반려
    const thisPost = await this.postRepository.getPost(postId);
    if (!thisPost) {
      console.log("**** --- CommentService.getCommentsOn End---");
      return {
        status: 400,
        message: "해당 게시글이 없습니다.",
        data: undefined,
      };

      //있으면,
    } else {
      // 특정 게시글에 달린 댓글 리스트 확보
      const allCommentsInfo = await this.commentRepository.getAllCommentsOn(
        postId
      );

      // DB에서 찾은 댓글상세정보의 배열 중에 -> 노출 필요한 요소만 담아 다시 배열을 만듦
      const data = allCommentsInfo.map((el) => {
        return {
          commentId: el._id,
          userId: el.userId,
          nickname: el.nickname,
          comment: el.comment,
          createdAt: el.createdAt,
          updatedAt: el.updatedAt,
        };
      });

      console.log("**** --- CommentService.getCommentsOn End---");
      return { status: 200, message: "댓글 목록을 불러왔습니다.", data: data };
    }
  };
  // TASK 3. 댓글 수정
  updateComment = async (user, commentId, comment) => {
    console.log("**** --- CommentService.updateComment---");

    // 저장소에서 댓글 번호에 해당하는 댓글 찾아보고
    const commentToUpdate = await this.commentRepository.getCommentDetail(
      commentId
    );

    // 없는 경우, 반려
    if (!commentToUpdate) {
      console.log("**** --- CommentService.updateComment End---");
      return { status: 400, message: "해당 댓글이 없습니다." };

      // 작성자와 로그인유저가 다르면 반렬
    } else if (user.nickname != commentToUpdate.nickname) {
      console.log("**** --- CommentService.updateComment End---");
      return { status: 400, message: "수정 권한이 없습니다." };

      // 댓글 수정하여 다시 저장
    } else {
      await this.commentRepository.updateComment(commentId, comment);
      console.log("**** --- CommentService.updateComment End---");
      return { status: 201, message: "댓글을 수정하였습니다." };
    }
  };
  // TASK 4.게시글 삭제
  deleteComment = async (user, commentId) => {
    console.log("**** --- CommentService.deleteComment---");
    // id에 해당하는 댓글을 찾아보고,
    const commentToUpdate = await this.commentRepository.getCommentDetail(
      commentId
    );

    // 없으면 반려
    if (!commentToUpdate) {
      console.log("**** --- CommentService.deleteComment End---");
      return { status: 400, message: "해당 댓글이 없습니다." };

      // 있는데 작성자와 로그인유저가 다르면 반려
    } else if (user.nickname != commentToUpdate.nickname) {
      console.log("**** --- CommentService.deleteComment End---");
      return { status: 400, message: "삭제 권한이 없습니다." };

      // 같으면 댓글 삭제 가능, 수행
    } else {
      await this.commentRepository.deleteComment(commentId);
      console.log("**** --- CommentService.deleteComment End---");
      return { status: 200, message: "댓글을 삭제하였습니다." };
    }
  };
}

module.exports = CommentService;
