// 이 테스트코드로 테스트할 Post 관련 컨트롤러, 서비스, 저장소의 각 클래스 import
const PostsController = require("../../controllers/posts.controller");
const PostsService = require("../../services/posts.service");
const PostRepository = require("../../repositories/posts.repository");

// 테스트할 각 클래스의 인스턴스 생성
const postsController = new PostsController();
const postsService = new PostsService();
const postRepository = new PostRepository();

// 테스트 과정에서 사용할 Post DB 모델 확보
const { Post } = require("../../models");

// req, res 가상 객체를 생성해주는 모듈 import
const httpMocks = require("node-mocks-http");

// 공용 변수들을 여기에 정의
// 테스트에 필요한 Mock Data import
const userDataIn = require("../data/user-data-in.js"); // 받아올 mock 데이터 (data 폴더에서 export)
const postDataIn = require("../data/post-data-in.js"); // 받아올 mock 데이터 (data 폴더에서 export)
const postDataOut = require("../data/post-data-out.js"); // 나와야 할 mock 데이터 (data 폴더에서 export)

let req, res, next; // beforeEach 밖에서도 사용하기 위해 여기에 선언
beforeEach(() => {
  req = httpMocks.createRequest(); // 빈 리퀘스트 객체 생성
  res = httpMocks.createResponse(); // 빈 리스폰스 객체 생성
  next = jest.fn(); // next는 특별한 기능이 없으나, 데이터 수집을 위해 mock 함수로 생성
});

// -------------- 여기부터 검증 시작 --------------------
describe("PostsController의 클래스의 테스트", () => {
  describe("getAllPosts 메소드 테스트", () => {
    beforeEach(() => {
      // getAllPosts 메소드안에서 사용 하고 있는 메소드 mocking
      postsController.postService.getAllPosts = jest.fn();

      // mock함수로 정의된 postsController.postService.getAllPosts
      // 본 테스터 안에서 호출되는 postsController.postService의 getAllPosts는 항상 postDataOut.getPostsRes.data값을 리턴하기로 함
      postsController.postService.getAllPosts.mockReturnValue(
        postDataOut.getPostsRes.data
      );
    });

    it("기능: 받아온 데이터를 받아 200번의 status-code를 응답해야 한다.", async () => {
      await postsController.getAllPosts(req, res, next);
      expect(res.statusCode).toBe(200);
    });
    it("기능: 받아온 데이터는 특정 형태로 응답하여 명세서에 맞춰야 한다.", async () => {
      await postsController.getAllPosts(req, res, next);
      expect(res._getJSONData()).toStrictEqual(postDataOut.getPostsRes);
    });
  });

  describe("updatePost 메소드 테스트", () => {
    beforeEach(async () => {
      // updatePost 메소드안에서 사용할 메소드 mocking
      postsController.postService.updatePost = jest.fn();

      // mock함수로 정의된 postsController.postService.updatePost
      // 본 테스터 안에서 호출되는 postsController.postService의 updatePost 항상 { status: 201, message: "게시글을 수정하였습니다.",} 값을 리턴하기로 함
      postsController.postService.updatePost.mockReturnValue({
        status: 201,
        message: "게시글을 수정하였습니다.",
      });

      // 인증 거쳐 나온 로그인 유저의 쿠키 전달 (유효기간 없는 token)
      res.locals = userDataIn.mockUser_ResLocals;
    });

    it("기능: 받아온 데이터를 받아 메세지만 전달받아 응답하고, 201번의 status-code를 응답해야 한다.", async () => {
      req.body = postDataIn.updatePostReq;
      req.params._postId = "3"; // body, params 에 모두 정상적인 데이터가 들어왔을 때,

      await postsController.updatePost(req, res, next); // 테스트 대상인 updatePost를 거쳐 나온 응답 res.

      // res의 모양이 아래와 같으면 성공
      expect(res.statusCode).toBe(201);
      expect(res._getJSONData()).toStrictEqual(postDataOut.updatePostRes);
    });

    it("예외처리: _postId 에 담겨 들어온 데이터가 숫자가 아니면,다음 경로를 검토하도록 흘려보낸다.", async () => {
      req.params._postId = "like"; // params 에 숫자가 아니라 이상한 데이터가 들어옴
      req.body = postDataIn.updatePostReq; // 바디엔 정상적인 데이터가 들어옴

      await postsController.updatePost(req, res, next); // 테스트 대상인 updatePost를 거치던 도중에,

      // 비정상 종료됐어야 하기 때문에 next가 1번 불러지고, 그 뒤의 서비스 메소드는 불러와지지 않아야 한다.
      // (.mock.calls.length는 몇번 불려졌는지를 카운트한다.)
      expect(next.mock.calls.length).toBe(1);
      expect(postsController.postService.updatePost.mock.calls.length).toBe(0);
    });

    it("예외처리: body에 담겨 들어온 title, content 가 이상하면, 에러메세지를 띄워 리턴한다.그때 400번의 에러메세지를 응답해야 한다.", async () => {
      req.params._postId = "3"; // params 에 정상적인 데이터가 들어왔지만,
      req.body = 3; // 바디에 객체가 아닌 비정상적인 데이터가 들어옴

      // 그 경우에는 service 계층의 코드를 통해 저장소와 비교하여 아래와 같은 에러를 리턴하게 될텐데,
      postsController.postService.updatePost.mockImplementation(() => {
        throw new Error("게시글을 수정할 수 없습니다.");
      });

      // 그렇다면 우리 테스트 대상인 updatePost의 응답은 400번대 코드를 내야 한다.
      await postsController.updatePost(req, res, next);
      expect(res.statusCode).toBe(400);
    });
  });
});

describe("PostServices의 클래스의 테스트", () => {
  describe("getAllPosts 메소드 테스트", () => {
    beforeEach(() => {
      // getAllPosts 메소드안에서 사용할 메소드 mocking
      postsService.postRepository.getAllPosts = jest.fn();
    });

    it("예외처리: 받아온 데이터가 빈 배열일 경우에도 빈 배열을 리턴한다.", async () => {
      postsService.postRepository.getAllPosts.mockReturnValue([]); // 저장소의 getAllPosts는 항상 빈 배열을 주기로 했을 때
      const resultData = await postsService.getAllPosts();
      // 서비스가 리턴한 resultData을 아래와 같이 검증한다.
      expect(resultData).toMatchObject([]); // toBe 가 아니라 toMatchObject를 쓰는 이유 : Array는 참조형이기 때문 _ ex. [] === [] : false
    });
  });
  describe("updatePost 메소드 테스트", () => {
    beforeEach(() => {
      // getAllPosts 메소드안에서 사용할 메소드 mocking
      postsService.postRepository.getPost = jest.fn();
      postsService.postRepository.updatePost = jest.fn();
      // 인증 거쳐온 로그인 유저의 쿠키 전달
      res.locals.user = userDataIn.mockUser_ResLocals;
    });

    it("기능: - 게시글을 업데이트한 후 '게시글을 수정하였습니다.'라는 메세지를 컨트롤러에 전달한다. 이 때 status-code 201번을 함께 전달함으로써 컨트롤러가 객체로써 활용하도록 한다.", async () => {
      // 정상적인 데이터가 접수 되었을 때 postRepository 각 메소드의 리턴은 항상 아래와 같다고 치자.
      postsService.postRepository.getPost.mockReturnValue(
        postDataOut.getPostDetailRes.data
      );
      postsService.postRepository.updatePost.mockReturnValue(
        postDataOut.getPostDetailRes
      );

      // 전달됐던 정상 데이터를 넣고 받은 리턴값을 기준으로,
      const result = await postsService.updatePost(
        res.locals.user,
        "3",
        "title",
        "content"
      );

      // result 객체의 status 값은 201, 그 모습은 { status: 201, message: "게시글을 수정하였습니다.", }와 같아야 한다.
      expect(result.status).toBe(201);
      expect(result).toStrictEqual({
        status: 201,
        message: "게시글을 수정하였습니다.",
      });
    });

    it("예외처리: DB에서 게시글을 찾지 못하는 경우 '해당 게시글이 없습니다.'”'라는 메세지를 컨트롤러에 전달한다. 이 때 status-code 400번을 함께 전달하여 컨트롤러가 객체로서 사용하게 한다.", async () => {
      // postRepository가 게시글을 찾지 못한 경우에는 항상 null이 리턴되는 저장소라고 치자.
      postsService.postRepository.getPost.mockReturnValue(null);

      // 그 때에 테스트 대상인 updatePost에 인자를 넣고 받은 리턴값을 기준으로,
      const result = await postsService.updatePost(
        res.locals.user,
        "3",
        "title",
        "content"
      );

      // result 객체의 status 값은 201, 그 모습은 { status: 400, message: "해당 게시글이 없습니다.", }와 같아야 한다.
      expect(result.status).toBe(400);
      expect(result).toStrictEqual({
        status: 400,
        message: "해당 게시글이 없습니다.",
      });
    });

    it("예외처리: 수정하려는 글(postId)을 작성한 작성자가 아니면 수정 권한이 없으므로 수정하지 않고 '수정 권한이 없습니다.'라는 에러메세지를 리턴한다. 이 때 status-code 400번을 함께 전달하여 컨트롤러가 객체로서 사용하게 한다.", async () => {
      // 로그인 유저가 작성하지 않은 특정 글을 수정하려고 했을 때,
      // 우리가 테스트하려는 updatePost 안에서 postRepository.getPost가 리턴하는 값이 아래와 같다고 치자.
      postsService.postRepository.getPost.mockReturnValue(
        postDataOut.getPostDetailRes_otherWriter.data
      );

      // 게시글을 수정하려고 했을 때 받은 리턴값 result는,
      const result = await postsService.updatePost(
        res.locals.user,
        "3",
        "title",
        "content"
      );

      // result는 아래 모양이어야 한다.
      expect(result.status).toBe(400);
      expect(result).toStrictEqual({
        status: 400,
        message: "수정 권한이 없습니다.",
      });
    });
  });
  describe("likePost 메소드 테스트", () => {
    beforeEach(() => {
      // likePost 메소드안에서 사용할 메소드는 mock함수로 정의한다.
      postsService.postRepository.getPost = jest.fn();
      postsService.postRepository.likePost = jest.fn();
      postsService.postRepository.dislikePost = jest.fn();
      postsService.userRepository.getAllLikedPosts = jest.fn();
      postsService.userRepository.likePost = jest.fn();
      postsService.userRepository.dislikePost = jest.fn();

      // 인증 거쳐온 로그인 유저도 res객체에 전달한다.
      res.locals.user = userDataIn.mockUser_ResLocals;
    });

    it("기능: 사용자가 지금까지 좋아한 리스트에 이번 게시글이 없는 경우, 함께 호출되는 메소드는 this.postRepository.likePost와 this*.userRepository.likePost여야 한다.", async () => {
      // 전제된 경우, Repository들이 아래값을 리턴한다고 치자.
      postsService.postRepository.getPost.mockReturnValue(
        postDataOut.getPostDetailRes.data
      );
      postsService.userRepository.getAllLikedPosts.mockReturnValue(["1", "3"]); // 기존에 좋아한 배열이 1,3인 상태에서

      // 로그인한 유저가
      await postsService.likePost(res.locals.user, "4"); // 4번을 좋아하면

      // post저장소와 user저장소의 좋아요(likePost) 메소드가 각각 1번씩 호출되어야 한다.
      expect(postsService.postRepository.likePost.mock.calls.length).toBe(1);
      expect(postsService.userRepository.likePost.mock.calls.length).toBe(1);
    });

    it("기능: 사용자가 지금까지 좋아한 리스트에 이번 게시글이 있는 경우, 좋아요를 취소해야 하므로 함께 호출되는 메소드는 this.postRepository.dislikePost와 this.userRepository.dislikePost여야 한다.", async () => {
      // 전제된 경우, Repository들의 리턴값이 아래와 같다고 치자.
      postsService.postRepository.getPost.mockReturnValue(
        postDataOut.getPostDetailRes.data
      );
      postsService.userRepository.getAllLikedPosts.mockReturnValue(["1", "3"]); // 기존에 좋아한 배열이 1,3

      // 이 때 로그인한 유저가 3번 게시글을 좋아하면
      await postsService.likePost(res.locals.user, "3");

      // post저장소와 user저장소의 좋아요취소(dislikePost) 메소드가 각각 1번씩 호출되어야 한다.
      expect(postsService.postRepository.dislikePost.mock.calls.length).toBe(1);
      expect(postsService.userRepository.dislikePost.mock.calls.length).toBe(1);
    });

    it("예외처리: - DB에서 게시글을 찾지 못하는 경우 '해당 게시글이 없습니다.'라는 메세지를 컨트롤러에 전달한다.이 때 status-code 400번을 함께 전달하여 컨트롤러가 객체로서 사용하게 한다.", async () => {
      // 전제된 경우, Repository들의 리턴값이 아래와 같다고 치자.
      postsService.postRepository.getPost.mockReturnValue(null); // 좋아요 누른 포스트가 DB에 없어서 저장소가 못찾아오고,
      postsService.userRepository.getAllLikedPosts.mockReturnValue(["1", "3"]); // 기존에 좋아한 배열이 1,3인 상태

      // 이 때 유저가 존재하지 않는 55번을 좋아한다는 요청을 보냈다면,
      const result = await postsService.likePost(res.locals.user, "55");

      // 아래와 같이 에러메세지를 리턴해야 한다.
      expect(result.status).toBe(400);
      expect(result).toStrictEqual({
        status: 400,
        message: "해당 게시글이 없습니다.",
      });
    });
  });
  describe("listMyLikedPosts 메소드 테스트", () => {
    //
    beforeEach(() => {
      // listMyLikedPosts 내부에서 공통으로 쓰이는 메소드를 mock함수로 정의한다.
      postsService.userRepository.getAllLikedPosts = jest.fn();
      postsService.postRepository.getPostsByLikedArray = jest.fn();

      // 기존에 좋아한 배열이 1,3인 상태라고 쳐보자.
      postsService.userRepository.getAllLikedPosts.mockReturnValue(["1", "3"]);

      // 인증 거쳐온 로그인된 유저가 있다.  "Tester3"
      res.locals.user = userDataIn.mockUser_ResLocals;
    });

    it("기능: 반환하는 값이 배열인지 확인한다.", async () => {
      // 전제된 정상 상태에서 postRepository.getPostsByLikedArray가 리턴하는 값이 아래와 같다고 치자. (게시글 2개의 정보가 담긴 mock 배열)
      postsService.postRepository.getPostsByLikedArray.mockReturnValue(
        postDataOut.getlikedPostsRes.data
      );

      // 테스트하려는 대상 listMyLikedPosts에 로그인 유저를 인자로 넣고 리턴값을 받으면,
      const result = await postsService.listMyLikedPosts(res.locals.user);

      // 결과값은 배열이어야 하고,
      expect(Array.isArray(result)).toBe(true);
      // postRepository.getPostsByLikedArrays 메소드는 "Tester3"이 좋아한 ["1", "3"] 배열을 인자로 담아 호출되어야 한다.
      expect(postsService.postRepository.getPostsByLikedArray).toBeCalledWith([
        "1",
        "3",
      ]);
    });
  });
});

describe("PostRepository 클래스의 메소드 테스트", () => {
  beforeEach(() => {
    // PostRepository가 의존하는 DB 모델을 모두 mock함수로 정의
    Post.findOne = jest.fn();
    Post.findAll = jest.fn();
    Post.create = jest.fn();
    Post.update = jest.fn();
    Post.destroy = jest.fn();
  });

  describe("getPost 메소드 테스트", () => {
    it("기능: 파라미터에 존재하는 게시글의 를 넣으면 DB의 컬럼이 모두 담긴 데이터를 반환한다.", async () => {
      // 전제된 조건에서 DB는 아래와 같은 데이터를 반환한다 치자.
      Post.findOne.mockReturnValue(postDataOut.getPostDetailRes.data);

      // 테스트 대상인 getPost가 정상작동한다면,
      const result = await postRepository.getPost("3");

      // 그 결과값은 아래의 파라미터들을 가지고 있어야 한다.
      expect(result).toHaveProperty("postId");
      expect(result).toHaveProperty("userId");
      expect(result).toHaveProperty("nickname");
      expect(result).toHaveProperty("title");
      expect(result).toHaveProperty("content");
      expect(result).toHaveProperty("createdAt");
      expect(result).toHaveProperty("updatedAt");
      expect(result).toHaveProperty("likes");
    });
  });

  describe("getAllPosts 메소드 테스트", () => {
    it("기능: 인자가 'DESC'이거나 없으면, 모델로부터 받아온 데이터가 날짜의 내림차순 정렬되어 있다.", async () => {
      // 전제된 조건에서 getAllPosts가 의존하는 DB가 아래와 같은 값을 리턴한다고 치자.
      Post.findAll.mockReturnValue(postDataOut.getPostsRes.data);

      // 그럼 우리가 테스트하려는 getAllPosts의 DESC 결과값은,
      const result = await postRepository.getAllPosts("DESC");

      // 검색된 게시글이 2개 이상이라면, 그 순서는 날짜의 내림차순 정렬이어야 한다.
      if (result.length > 1) {
        expect(
          new Date(result[0].createdAt) -
            new Date(result[result.length - 1].createdAt)
        ).toBeGreaterThanOrEqual(0);

        // 1개 이하라면 늘 옳다.
      } else {
        expect(true).toBe(true);
      }
    });
    it("기능: 인자가 ‘ASC’이면, 모델로부터 받아온 데이터가 날짜의 오름차순 정렬되어 있다.", async () => {
      // 전제된 조건에서 getAllPosts가 의존하는 DB가 아래와 같은 값을 리턴한다고 치자.
      Post.findAll.mockReturnValue(postDataOut.getPostsResAscending.data);

      // 그럼 우리가 테스트하려는 getAllPosts의 ASC 결과값은,
      const result = await postRepository.getAllPosts("ASC");

      // 검색된 게시글이 2개 이상이라면, 그 순서는 날짜의 오름차순 정렬이어야 한다.
      if (result.length > 1) {
        expect(
          new Date(result[0].createdAt) -
            new Date(result[result.length - 1].createdAt)
        ).toBeLessThan(0);

        // 1개 이하라면 늘 옳다.
      } else {
        expect(true).toBe(true);
      }
    });
  });

  describe("getPostsByLikedArray 메소드 테스트", () => {
    it("기능: findAll을 통해서 반환된 값(allPostsUserLiked)이 likes수에 내림차순으로 잘 정렬 되어 있는지 확인한다.", async () => {
      // 전제된 조건에서 getAllPosts가 의존하는 DB가 아래와 같은 값을 리턴한다고 치자. (likes 내림차순 정렬돼있는 mock data 준비.)
      Post.findAll.mockReturnValue(postDataOut.getPostsResAscending.data);

      // 해당 값을 리턴하기 적합한 ["7", "8"]을 넣고 테스팅 메소드를 호출했을 때,
      const result = await postRepository.getPostsByLikedArray(["7", "8"]);

      // 그 게시글 정보가 나열된 배열은 좋아요의 내림차순이어야 한다.
      if (result.length > 1) {
        expect(
          new Date(result[0].likes) - new Date(result[result.length - 1].likes)
        ).toBeGreaterThanOrEqual(0);
      } else {
        expect(true).toBe(true);
      }
    });
  });

  describe("createNewPost 메소드 테스트", () => {
    //
    it("기능: 모델 Post에 Post.create를 명령하고 반환 받은 리턴값이 전달한 값과 동일하게 잘 들어왔는지 확인한다. ", async () => {
      // 게시글 생성 후 DB 모델로부터 리턴받을 데이터가 아래와 같다 치자.
      const mockDataDBout = postDataOut.createdPostRes.data;
      Post.create.mockReturnValue(mockDataDBout);

      // 그럼 그를 위한 정상적인 데이터를 넣고 받은 리턴값도
      const result = await postRepository.createNewPost(
        5,
        "Tester4",
        "새로생성한 글의 제목",
        "안녕하세요 새로 생성한 글의 content 입니다."
      );

      const dataToComeOut = [
        // 이 저장소에서 리턴할 데이터
        result.userId,
        result.nickname,
        result.title,
        result.content,
      ];

      // 동일한 모습이어야 한다.
      expect(dataToComeOut).toMatchObject([
        5,
        "Tester4",
        "새로생성한 글의 제목",
        "안녕하세요 새로 생성한 글의 content 입니다.",
      ]);
    });
  });

  describe("updatePost 메소드 테스트", () => {
    it("기능: 모델 Post에 Post.update를 명령하고 반환 받은 리턴값이 전달한 값과 동일하게 잘 들어왔는지 확인한다. ", async () => {
      // 이 데이터를 수정 저장하고 리턴 받는 데이터가 아래와 같다고 치자.
      const mockDataDBout = postDataOut.updatedPostRes.data;
      Post.update.mockReturnValue(mockDataDBout);

      // 그를 위해 정상적인 데이터를 아래와 같이 전달했다면,
      const result = await postRepository.updatePost(
        5,
        "수정한 글의 제목",
        "안녕하세요 수정한 글의 content 입니다."
      );

      // 그로부터 나온 정상적인 데이터는
      const dataToComeOut = [
        // 이 저장소에서 리턴할 데이터
        result.userId,
        result.title,
        result.content,
      ];

      // 넣었던 것과 동일해야 한다.
      expect(dataToComeOut).toMatchObject([
        5,
        "수정한 글의 제목",
        "안녕하세요 수정한 글의 content 입니다.",
      ]);
    });
  });
});
