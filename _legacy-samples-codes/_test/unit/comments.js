// 테스트할 User 컨트롤러, 서비스, 저장소의 각 클래스 import
const CommentsController = require("../../controllers/comments.controller");
const CommentsService = require("../../services/comments.service");
const CommentRepository = require("../../repositories/comments.repository");
const PostRepository = require("../../repositories/posts.repository");
const { Comment } = require("../../models");

// 테스트할 각 클래스의 인스턴스 생성
const commentsController = new CommentsController();
const commentsService = new CommentsService();
const commentRepository = new CommentRepository();

// 이 테스트에서 활용할 다른 인스턴스도 생성
const postRepository = new PostRepository();

// req, res, next 가상 객체를 생성해주는 모듈 import
const httpMocks = require("node-mocks-http");

// 테스트에 필요한 Mock Data import
const userDataIn = require("../data/user-data-in.js"); // 받아올 mock 데이터
const commentDataIn = require("../data/comment-data-in.js"); // 받아올 mock 데이터
const commentDataout = require("../data/comment-data-out.js"); // 나와야 할 mock 데이터
const postDataout = require("../data/post-data-out.js"); // 나와야 할 mock 데이터

let req, res, next; // beforeEach 밖에서도 활용해야 하므로 여기에 선언
beforeEach(() => {
  req = httpMocks.createRequest(); // 빈 리퀘스트 객체 생성
  res = httpMocks.createResponse(); // 빈 리스폰스 객체 생성
  next = jest.fn(); // mock 함수로 선언
});

//
describe("commentsController의 클래스의 테스트", () => {
  describe("leaveComment 메소드 테스트", () => {
    // leaveComment 메소드 테스터 전체에 사용할 재료 준비
    beforeEach(() => {
      // leaveComment 메소드안에서 사용할 commentService.leaveCommentOn는 mock 함수
      commentsController.commentService.leaveCommentOn = jest.fn();
      // 테스트하는 동안 늘 아래의 값을 리턴한다고 치자.
      commentsController.commentService.leaveCommentOn.mockReturnValue({
        status: 201,
        message: "댓글을 작성하였습니다.",
      });
      // 인증 거쳐온 로그인 유저는 "Tester3"
      res.locals.user = userDataIn.mockUser_ResLocals;
    });

    // 테스트 3가지 시작 ----------
    it("예외처리 : _postId로 전달받은 데이터가 숫자가 아니면 존재하지 않는 path로 지나가도록 next()를 전달합니다. ", async () => {
      // 들어올 데이터는 아래와 같다. _postId가 숫자가 아닐 경우를 정의한다.
      req.body = commentDataIn.createCommentReq;
      req.params._postId = "like";

      // 이때 이 단위테스트에서 테스트하는 leaveComment를 거치면,
      await commentsController.leaveComment(req, res, next);

      // 다음 라우터를 확인하게 하는 next 함수가 호출되어야 한다.
      expect(next.mock.calls.length).toBe(1);
      // 그리고 이 컨트롤러에서 -> 서비스로 넘기는 메소드를 실행하지 않아야 한다.
      expect(
        commentsController.commentService.leaveCommentOn.mock.calls.length
      ).toBe(0);
    });

    it("예외처리 : 바디로 전달받은 comment가 빈 문자열이라면 '댓글 내용을 입력해주세요' 를 반환합니다. 이 때 400번 status-code와 함께 반환합니다.", async () => {
      // 작성자가 코멘트를 작성하지 않았다고 치자.
      req.body = { comment: "" };
      req.params._postId = "3";

      // 그 경우 leaveComment에 접근한다면,
      await commentsController.leaveComment(req, res, next);

      // 오류 400을 내고 아래와 같은 메세지를 내어야 한다.
      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toStrictEqual({
        message: "댓글 내용을 입력해주세요",
      });
    });

    it("예외처리 : 바디로 전달반은 comment가 문자열이 아니라면 에러를 발생시키고 '잘못된 접근입니다.'라는 메세지와 함께 400 status-code를 반환합니다.", async () => {
      // 코멘트가 없거나 문자열이 아닌 것이 들어왔다고 치자.
      req.body = {};
      req.params._postId = "3";

      // 그 때 우리가 테스트 하고 있는 leaveComment를 거친다면,
      await commentsController.leaveComment(req, res, next);

      // 에러코드를 내고 아래와 같은 메세지를 응답해야 한다.
      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toStrictEqual({
        message: "잘못된 접근입니다.",
      });
    });
  });

  describe("updateComment 메소드 테스트", () => {
    // updatePost 메소드안에서 사용할 메소드와 변수를 공통 선언한다.
    beforeEach(async () => {
      // commentService.updateComment를 mock 함수로 정의
      commentsController.commentService.updateComment = jest.fn();
      // 그 리턴값을 항상 아래와 같다고 친다.
      commentsController.commentService.updateComment.mockReturnValue({
        status: 201,
        message: "게시글을 수정하였습니다.",
      });

      // 인증 거쳐온 로그인 유저는 "Tester3"
      res.locals = userDataIn.mockUser_ResLocals;
    });

    it("예외처리: _commentId로 전달받은 데이터가 숫자가 아니면 존재하지 않는 path로 지나가도록 next()를 전달합니다. ", async () => {
      // _commentId로 전달받은 데이터가 숫자가 아니라고 치자.
      req.body = commentDataIn.updateCommentReq;
      req.params._commentId = "like";

      // 그러면 테스팅 메소드 updateComment를 지나는 동안,
      await commentsController.updateComment(req, res, next);

      // next가 1번 불러지고, 그 뒤의 서비스 메소드는 불러와지지 않아야 한다.
      expect(next.mock.calls.length).toBe(1);
      expect(
        commentsController.commentService.updateComment.mock.calls.length
      ).toBe(0);
    });

    it("예외처리: 바디로 전달반든 comment가 문자열이 아니라면 에러를 발생시키고 '잘못된 접근입니다.'라는 메세지와 함께 400 status-code를 반환합니다.", async () => {
      // 코멘트가 문자열이 아니거나 선언되어 있지 않다고 치자.
      req.body = { comment: {} };
      req.params._postId = "like"; // params 에 이상한 데이터가 들어옴

      // 우리가 테스트 하고 있는 메소드를 지나고 나면,
      await commentsController.updateComment(req, res, next);

      // 아래와 같은 에러코드와 메세지를 응답해야 한다.
      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toStrictEqual({
        message: "잘못된 접근입니다.",
      });
    });
  });
});

describe("CommentService의 클래스의 테스트", () => {
  describe("leaveCommentOn 메소드 테스트", () => {
    beforeEach(() => {
      // leaveCommentOn 메소드안에서 사용할 메소드 mocking
      commentsService.postRepository.getPost = jest.fn();
      commentsService.commentRepository.createComment = jest.fn();
      // 인증 거쳐온 로그인 유저의 쿠키 전달 : "Tester3"
      res.locals.user = userDataIn.mockUser_ResLocals;
    });

    it("기본기능 _ 리턴하는 데이터에 두가지 key : status와 message 가 있어야 합니다. ", async () => {
      // 의존하고 있는 두가지 저장소에서 항상 아래와 같은 데이터들이 리턴된다고 치자.
      commentsService.postRepository.getPost.mockReturnValue(
        postDataout.getPostDetailRes.data
      );
      commentsService.commentRepository.createComment.mockReturnValue(
        commentDataout.createdCommentRes
      );

      // 우리가 테스트하려는 leaveCommentOn 메소드에 정상값들이 들어간다면,
      const result = await commentsService.leaveCommentOn(
        res.locals.user,
        "3",
        "안녕하세요 댓글입니다."
      );

      // 그 리턴값에는 항상 상태와 메세지가 리턴되도록 디자인한다.
      expect(result).toHaveProperty("status");
      expect(result).toHaveProperty("message");
    });

    it("예외처리: 전달 받은 데이터 id에 해당하는 게시글이 없으면 status-code 400 과 함께 ‘해당 게시글이 없습니다.’를 메세지로 리턴합니다. ", async () => {
      // 테스트하고 있는 leaveCommentOn 메소드가 의존하고 있는 저장소가 항상 undefined, 즉 해당하는 리턴을 찾지 못한다고 치자
      commentsService.postRepository.getPost.mockReturnValue(undefined);

      // 그때 leaveCommentOn의 리턴값은
      const result = await commentsService.leaveCommentOn(
        res.locals.user,
        "3",
        "안녕하세요 댓글입니다."
      );

      // 아래와 같은 내용을 담고 있어야 한다.
      expect(result.status).toBe(400);
      expect(result).toStrictEqual({
        status: 400,
        message: "해당 게시글이 없습니다.",
      });
    });
  });

  describe("updateComment 메소드 테스트", () => {
    //
    beforeEach(() => {
      // updateComment 메소드안에서 사용할 메소드 mocking
      commentsService.commentRepository.getCommentDetail = jest.fn();
      commentsService.commentRepository.updateComment = jest.fn();
      // 인증 거쳐온 로그인 유저의 쿠키 전달 : "Tester3"
      res.locals.user = userDataIn.mockUser_ResLocals;
    });

    it("기능:리턴하는 데이터에 두가지 key : status와 message 가 있어야 합니다. ", async () => {
      // 우리가 테스팅 하려는 단위가 의존하고 있는 아래 메소드가 늘 getCommentDetailRes과 같은 데이터를 리턴한다고 치자. (정상적인 상황)
      commentsService.commentRepository.getCommentDetail.mockReturnValue(
        commentDataout.getCommentDetailRes
      );

      // 이때 정상적인 데이터를 주입한 updateComment의 리턴값은
      const result = await commentsService.updateComment(
        "5",
        "수정된 댓글입니다."
      );

      // status와 message 프로퍼티를 모두 가지고 있어야 한다.
      expect(result).toHaveProperty("status");
      expect(result).toHaveProperty("message");
    });

    it("예외처리:전달 받은 데이터 id에 해당하는 게시글이 없으면 status-code 400 과 함께 '해당 댓글이 없습니다.'를 메세지로 리턴합니다. ", async () => {
      // commentRepository가 게시글을 찾지 못한 경우라고 치자.
      commentsService.commentRepository.getCommentDetail.mockReturnValue(null);

      // 그때 그 댓글을 찾아 수정하려고 했던 updateComment를 거치면,
      const result = await commentsService.updateComment(
        res.locals.user,
        "3",
        "title",
        "content"
      );

      // 아래와 같은 오류메세지와 코드를 담고 있어야 한다.
      expect(result.status).toBe(400);
      expect(result).toStrictEqual({
        status: 400,
        message: "해당 댓글이 없습니다.",
      });
    });

    it("예외처리: 기존 댓글의 작성자와 수정을 희망하는 로그인 작성자가 다른 경우 status-code 400 과 함께 ’수정 권한이 없습니다.’를 메세지로 리턴합니다.", async () => {
      // commentRepository가 아래와 같이 Tester3가 작성하지 않은 어떤 게시글데이터를 리턴하고 있다고 치자.
      commentsService.commentRepository.getCommentDetail.mockReturnValue(
        commentDataout.getCommentDetailRes
      );

      // updateComment로 접근한 유저가 작성자가 아닌 상황에서는
      const result = await commentsService.updateComment(
        res.locals.user, // 접속한 유저 id : 3 ("Tester3")
        "10",
        "title",
        "content"
      );

      // 수정권한이 없으므로 오류코드와 메세지를 전달해야 한다.
      expect(result.status).toBe(400);
      expect(result).toStrictEqual({
        status: 400,
        message: "수정 권한이 없습니다.",
      });
    });
  });
});

describe("CommentRepository 클래스의 메소드 테스트", () => {
  beforeEach(() => {
    // commentRepository가 의존하는 DB 모델을 모두 mocking
    Comment.findOne = jest.fn();
    Comment.findAll = jest.fn();
    Comment.create = jest.fn();
    Comment.update = jest.fn();
    Comment.destroy = jest.fn();
  });
  describe("getAllCommentsOn 메소드 테스트", () => {
    it("기능: 인자가 'DESC'이거나 없으면, 모델로부터 받아온 데이터가 날짜의 내림차순 정렬되어 있다.", async () => {
      // 의존하고 있는 Comment DB 모델이 정상 작동하여 내림차순으로 데이터를 잘 찾아오는 경우를 만들어 두었다.
      Comment.findAll.mockReturnValue(commentDataout.getCommentsRes.data);

      // 인자만 잘 전달되어 getAllCommentsOn가 실행된다면 그 결과값에는
      const result = await commentRepository.getAllCommentsOn("DESC");

      // 결과값이 2개 이상이면 그 정렬을 확인했을 때 내림차순이어야 하고,
      if (result.length > 1) {
        expect(
          new Date(result[0].createdAt) -
            new Date(result[result.length - 1].createdAt)
        ).toBeGreaterThanOrEqual(0);

        // 결과값이 1개 이하라면 늘 옳다.
      } else {
        expect(true).toBe(true);
      }
    });

    it("기능: 인자가 ‘ASC’이면, 모델로부터 받아온 데이터가 날짜의 오름차순 정렬되어 있다.", async () => {
      // Comment DB 모델이 정상 작동하여 날짜의 오름차순으로 데이터를 잘 찾아오는 경우를 만들어 두었다.
      Comment.findAll.mockReturnValue(
        commentDataout.getCommentsResAscending.data
      );

      // 그를 요청한 ASC인자를 담은 getAllCommentsOn 메소드를 호출하면,
      const result = await commentRepository.getAllCommentsOn("ASC");

      // 결과값이 2개 이상이면 그 정렬을 확인했을 때 오름차순이어야 하고,
      if (result.length > 1) {
        expect(
          new Date(result[0].createdAt) -
            new Date(result[result.length - 1].createdAt)
        ).toBeLessThanOrEqual(0);
        // 1개 이하이면 늘 옳다.
      } else {
        expect(true).toBe(true);
      }
    });

    it("예외처리: 해당 게시글에 달린 댓글이 없더라도 빈 배열을 반환합니다.", async () => {
      // 찾아온 data 가 빈배열인 경우가 있다고 치자.
      Comment.findAll.mockReturnValue([]);

      // 그 경우에 테스팅 메소드를 실행하더라도,
      const result = await commentRepository.getAllCommentsOn("DESC");

      // 리턴값도 빈 배열이어야 한다.
      // toMatchObject를 쓰는 이유 _ Array는 참조형 : [] === [] 는 참조값이 다르므로 False 이다. 모양을 비교해야 해서 toMatchObject을 사용한다.
      expect(result).toMatchObject([]);
    });
  });

  describe("createComment 메소드 테스트", () => {
    it("기능: 저장하기 위해 전달한 데이터의 값 → create 메소드 실행 후 리턴으로 받아 → 리턴으로 전달할 데이터가 동일합니다.", async () => {
      // 테스트하려는 createComment 안에서 의존하고 있는 Comment DB 모델이 정상적으로 댓글을 생성할 수 있다면,
      Comment.create.mockReturnValue(commentDataout.createdCommentRes);

      // createComment에 인자를 제대로 넣었을 때 그 결과값 result의 내용은
      const result = await commentRepository.createComment(
        5,
        4,
        "Tester5",
        "안녕하세요 댓글입니다."
      );

      const dataToComeOut = [
        // 이 저장소에서 리턴할 데이터
        result._postId,
        result.userId,
        result.nickname,
        result.comment,
      ];

      // 정확히 넣었던 데이터를 그대로 가지고 있어야 한다.
      expect(dataToComeOut).toMatchObject([
        5,
        4,
        "Tester5",
        "안녕하세요 댓글입니다.",
      ]);
    });
  });

  describe("deleteComment 메소드 테스트", () => {
    it("기능: DB모델에 destroy 수행 후 삭제된 데이터의 객체를 반환받아, 지우려고 의도했던 데이터가 잘 지워진 것을 확인합니다.  ", async () => {
      // 테스트하려는 createComment 안에서 의존하고 있는 Comment DB 모델이 정상적으로 댓글을 삭제할 수 있다고 치자.
      Comment.destroy.mockReturnValue(commentDataout.deletedCommentRes);

      // 그러면 위 mock 데이터에 해당하는 11번 코멘트를 삭제하겠다고 이 저장소와 deleteComment가 호출되면,
      const result = await commentRepository.deleteComment(11);

      // 이 저장소가 리턴할 데이터는 commentId, userId, nickname 등을 가지고 있는데,
      const dataToReturn = [result.commentId, result.userId, result.nickname];

      // 그 리턴 데이터는 11번 코멘트의 정보와 동일해야 한다.
      expect(dataToReturn).toMatchObject([11, 4, "Tester5"]);
    });
  });
});
