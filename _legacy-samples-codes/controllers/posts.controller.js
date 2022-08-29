/* 여기에 전달될 클라이언트의 요청을 적절히 나누어 처리보내고 반환해주는 역할을 함 (요청 수신, 데이터 검증, 결과 반환, 예외처리) */
// 라우터에서 사용할 컨트롤러 클래스와 그 안의 메소드를 정의
// 그 과정에서, 다시 각 메소드가 사용할 서비스 클래스를 필요로 함(require)

const PostService = require("../services/posts.service");

// Post의 컨트롤러(Controller)역할을 하는 클래스
class PostsController {
  postService = new PostService(); // Post 서비스를 클래스를 컨트롤러 클래스의 멤버 변수로 할당합니다.

  getAllPosts = async (req, res, next) => {
    try {
      console.log("** --- PostsController.getAllPosts ---");

      // 서비스 계층에 구현된 findAllPost 로직을 실행합니다.
      const posts = await this.postService.getAllPosts();

      console.log("** --- PostsController.getAllPosts returns ---");
      return res.status(200).json({ data: posts });

      //에러발생 시,
    } catch (error) {
      const message = `${req.method} ${req.originalUrl} : ${error.message}`;
      res.status(400).send({ message });
    }
  };

  createNewPost = async (req, res, next) => {
    try {
      console.log("** --- PostsController.createNewPost ---");

      const { user } = await res.locals;

      console.log(user);
      const { title, content } = req.body;
      // 서비스 계층에 구현된 findAllPost 로직을 실행합니다.

      const { message } = await this.postService.createNewPost(
        user,
        title,
        content
      );
      console.log("** --- PostsController.createNewPost Returns ---");
      return res.status(201).json({ message });

      //에러발생 시,
    } catch (error) {
      const message = `${req.method} ${req.originalUrl} : ${error.message}`;
      console.log(message);
      return res.status(400).send({ message });
    }
  };

  getPostDetail = async (req, res, next) => {
    try {
      console.log("** --- PostsController.getPostDetail ---");
      const { _postId } = req.params;

      if (!Number.isInteger(Number(_postId))) {
        next();
        return;
      }
      const data = await this.postService.getPostDetail(_postId);
      console.log("** --- PostsController.getPostDetail Returns ---");
      return res.status(200).json({ data: data });
      //에러발생 시,
    } catch (error) {
      const message = `${req.method} ${req.originalUrl} : ${error.message}`;
      return res.status(400).send({ message });
    }
  };

  updatePost = async (req, res, next) => {
    try {
      console.log("** --- PostsController.updatePost ---");
      const { user } = await res.locals;
      const { _postId } = req.params;
      const { title, content } = req.body;

      if (!Number.isInteger(Number(_postId))) {
        next();
        return;
      }

      const { status, message } = await this.postService.updatePost(
        user,
        _postId,
        title,
        content
      );

      console.log("** --- PostsController.updatePost Returns ---");
      return res.status(status).json({ message });

      //에러발생 시,
    } catch (error) {
      const message = `${req.method} ${req.originalUrl} : ${error.message}`;
      return res.status(400).json({ message });
    }
  };

  deletePost = async (req, res, next) => {
    try {
      console.log("** --- PostsController.deletePost ---");
      const { user } = await res.locals;
      const { _postId } = req.params;

      if (!Number.isInteger(Number(_postId))) {
        next();
        return;
      }
      const { status, message } = await this.postService.deletePost(
        user,
        _postId
      );

      console.log("** --- PostsController.deletePost Returns ---");
      return res.status(status).json({ message });

      //에러발생 시,
    } catch (error) {
      const message = `${req.method} ${req.originalUrl} : ${error.message}`;
      return res.status(400).send({ message });
    }
  };

  likePost = async (req, res, next) => {
    try {
      console.log("** --- PostsController.likePost ---");
      // 변수 정의
      const { user } = await res.locals;
      const { _postId } = req.params;
      if (!Number.isInteger(Number(_postId))) {
        next();
        return;
      }

      // 좋아요 눌렀을 때 서비스 계층으로부터 결과값 받아옴
      const { status, message } = await this.postService.likePost(
        user,
        _postId
      );

      // 결과값 (status, message) 응답
      console.log("** --- PostsController.likePost Returns ---");
      return res.status(status).json({ message });

      //에러발생 시,
    } catch (error) {
      const message = `${req.method} ${req.originalUrl} : ${error.message}`;
      return res.status(400).send({ message });
    }
  };

  listMyLikedPosts = async (req, res, next) => {
    try {
      console.log("** --- PostsController.listMyLikedPosts ---");
      // 로그인된 유저의
      const { user } = await res.locals;

      // 포스트 좋아요 리스트와 그 디테일을 전달 받아,
      const data = await this.postService.listMyLikedPosts(user);

      // data에 담아 응답한다.
      console.log("** --- PostsController.listMyLikedPosts Return ---");
      return res.status(200).json({ data: data });

      //에러발생 시,
    } catch (error) {
      const message = `${req.method} ${req.originalUrl} : ${error.message}`;
      return res.status(400).send({ message });
    }
  };
}

module.exports = PostsController;
