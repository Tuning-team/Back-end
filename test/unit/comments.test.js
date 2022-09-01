const CommentsService = require("../../b_services/comments.service");
const CommentsRepository = require("../../c_repositories/comments.repository");
const CollectionsRepository = require("../../c_repositories/collections.repository");
const Comment = require("../d_schemas/comment");

const commentsService = new CommentsService();
const commentsRepository = new CommentsRepository();

const collectionsRepository = new CollectionsRepository();

const httpMocks = require("node-mocks-http");

const commentDataIn = require("../data/comment-data-in.js");
const commentDataout = require("../data/comment-data-out.js");

let req, res, next; // beforeEach 밖에서도 활용해야 하므로 여기에 선언
beforeEach(() => {
  req = httpMocks.createRequest(); // 빈 리퀘스트 객체 생성
  res = httpMocks.createResponse(); // 빈 리스폰스 객체 생성
  next = jest.fn(); // mock 함수로 선언
});

describe("leaveCommentOn 메소드 테스트", () => {
  beforeEach(() => {
    commentsService.leaveCommentOn = jest.fn();

    commentsService.leaveCommentOn.mockReturnValue({
      status: 201,
      message:"댓글을 작성하였습니다.",
    });
    res.locals.user = userDataIn.mockUser_ResLocals;
  });
});

