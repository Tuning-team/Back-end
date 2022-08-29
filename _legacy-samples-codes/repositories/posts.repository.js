// 서비스 계층에서 사용할 저장소 클래스와 그 안의 메소드를 정의
// 그 과정에서, 다시 각 메소드가 사용할 데이터베이스 모델(시퀄라이즈)를 필요로 함(require)

// 필요한 시퀄라이즈 모델을 확보합니다.
const { Post } = require("../models");
const Sequelize = require("sequelize");

// 저장소 클래스를 선언합니다.
class PostRepository {
  // postId를 받아 게시글 1개의 정보를 반환한다.
  getPost = async (postId) => {
    console.log("****** --- PostRepository.getPost ---");
    // postId에 해당하는 게시글 정보를 찾아서 리턴
    const thisPost = await Post.findOne({ where: { _id: postId } });
    return thisPost;
  };

  // 작성된 모든 게시글의 상세 정보를 요청한 발행일 순서대로 으로 모두 불러옴 (기본값 날짜 내림차순)
  getAllPosts = async (orderBy = "DESC") => {
    console.log("****** --- PostRepository.getAllPosts ---");

    // DB에서 날짜에 내림차순으로 데이터를 받아옴
    const allPosts = await Post.findAll({
      order: [["createdAt", orderBy]],
    });

    // 받아온 게시글들을 리턴
    console.log("****** --- PostRepository.getAllPosts Returns---");
    return allPosts;
  };

  // 좋아요리스트를 보내면 그 게시글을 좋아요 수 내림차순으로 가져온다.
  getPostsByLikedArray = async (likedArray) => {
    console.log("****** --- PostRepository.getPostsByLikedArray ---");
    // 헤딩 게시글 목록 배열(postIdsUserLiked)에 해당하는 게시글의 디테일한 정보들을 가져와서 반환한다.
    const allPostsUserLiked = await Post.findAll({
      where: { _id: likedArray },
      order: [["likes", "DESC"]],
    });

    // 찾아온 배열 반환
    console.log("****** --- PostRepository.getPostsByLikedArray Returns---");
    return allPostsUserLiked;
  };

  // 전달된 내용으로 새로운 게시글을 작성한다. returns 작성한 게시글정보
  createNewPost = async (userId, nickname, title, content) => {
    console.log("****** --- PostRepository.createNewPost ---");

    // 전달 받은 4가지 인자를 담아 새로운 게시글을 DB에 저장
    const createdPost = await Post.create({
      userId,
      nickname,
      title,
      content,
    });

    // 전달 받은 데이터 리턴
    console.log("****** --- PostRepository.createNewPost Returns ---");
    return createdPost;
  };

  // 전달된 postId에 해당하는 게시글을 수정하여 저장한다. returns 수정한 게시글정보
  updatePost = async (postId, title, content) => {
    console.log("****** --- PostRepository.updatePost ---");

    // 전달 받은 타이틀, 컨텐츠를 넣어 업데이트
    const updatedPost = await Post.update(
      { title, content }, // 어떤 댓글을 수정할지 넣고,
      { where: { _id: postId } }
    );

    // 업데이트 게시글을 리턴
    console.log("****** --- PostRepository.updatePost Returns---");
    return updatedPost;
  };

  // postId에 해당하는 게시글의 좋아요를 1개 올린다. returns 좋아한 게시글의 현재 좋아요 수
  likePost = async (postId) => {
    console.log("****** --- PostRepository.likePost ---");
    // 해당 게시글을 찾아 sequelize 문법으로 like를 한개 올린다.
    const likedPost = await Post.update(
      { likes: Sequelize.literal("likes + 1") },
      { where: { _id: postId } }
    );

    // 이번에 좋아한 게시글의 좋아요 수를 리턴
    console.log("****** --- PostRepository.likePost Returns---");
    return likedPost.likes;
  };

  // postId에 해당하는 게시글의 좋아요를 1개 내린다. returns 좋아요 취소한 게시글의 현재 좋아요
  dislikePost = async (postId) => {
    console.log("****** --- PostRepository.dislikePost ---");
    // 해당 게시글을 찾아 sequelize 문법으로 like를 한개 내린다.
    const dislikedPost = await Post.update(
      { likes: Sequelize.literal("likes - 1") },
      { where: { _id: postId } }
    );

    // 이번에 좋아한 게시글의 좋아요 수를 리턴
    console.log("****** --- PostRepository.dislikePost Returns ---");
    return dislikedPost.likes;
  };

  // 전달된 postId에 해당하는 게시글을 삭제한. returns 삭제한 게시글정보
  deletePost = async (postId) => {
    console.log("****** --- PostRepository.deletePost ---");
    // postId에 해당하는 게시글을 DB에서 삭제 수행
    const deletedPost = await Post.destroy({ where: { _id: postId } });

    // 삭제한 게시글 정보를 리턴
    console.log("****** --- PostRepository.deletePost Returns ---");
    return deletedPost;
  };
}
module.exports = PostRepository;

/*
PostRepository 매뉴얼 

  PostRepository.getPost(postId) 
  : postId를 받아 게시글 1개의 정보를 반환한다.
  
  PostRepository.getAllPosts(orderBy = "DESC")
  : 작성된 모든 게시글의 상세 정보를 요청한 발행일 순서대로 으로 모두 불러옴 (기본값 날짜 내림차순)

  PostRepository.getPostsByLikedArray(likedArray)
  : 좋아요리스트를 보내면 그 게시글을 좋아요 수 내림차순으로 가져온다.

  PostRepository.createNewPost(userId, nicknmame, title, content)
  : 전달된 내용으로 새로운 게시글을 작성한다. returns 작성한 게시글정보

  PostRepository.updatePost(postId, title, content)
  : 전달된 postId에 해당하는 게시글을 수정하여 저장한다. returns 수정한 게시글정보

  PostRepository.likePost(postId)
  : postId에 해당하는 게시글의 좋아요를 1개 올린다. returns 좋아한 게시글의 현재 좋아요 수

  PostRepository.dislikePost(postId)
  : postId에 해당하는 게시글의 좋아요를 1개 내린다. returns 좋아요 취소한 게시글의 현재 좋아요 수

  PostRepository.deletePost(postId)
  : 전달된 postId에 해당하는 게시글을 삭제한. returns 삭제한 게시글정보

*/
