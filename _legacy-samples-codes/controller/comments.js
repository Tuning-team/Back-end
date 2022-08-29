const COMMENTS = require("../schemas/comment");

// 게시글에 댓글작성 목록 조회
exports.getAllComments = async (req, res) => {
  try {
    const { postId } = req.params;

    if (!postId) {
      res.status(400).json({ message: "데이터 형식이 올바르지 않습니다" });
      return;
    }

    const comments = await COMMENTS.find({ POST_ID: postId });
    let result = [];
    for (const comment of comments) {
      result.push({
        COMMENT_ID: comment._id,
        USER_ID: comment.USER_ID,
        CONTENT: comment.CONTENT,
        TIMESTAMPS: comment.TIMESTAMPS,
      });
    }
    res.status(200).json(result);
  } catch (error) {
    const message = `${req.method} ${req.originalUrl} : ${error.message}`;
    console.log(message);
    res.status(400).json({ statusCode: 400, errReason: message });
  }
};

exports.createCommentsPage = async (req, res) => {
  // console.log(req.user);
  console.log("A");
  res.render("writeComments");
};
// 게시글에 댓글작성
exports.createComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const { CONTENT } = req.body;
    const { _id } = res.locals.user;
    // const _id = "63004dfa1759949daf48394b";

    if (!CONTENT) {
      res.status(411).json({ mesaage: "댓글 내용을 입력해주세요!" });
      return;
    }

    const createdComment = await COMMENTS.create({
      POST_ID: postId,
      USER_ID: _id,
      CONTENT,
      TIMESTAMPS: new Date(),
    });
    // await COMMENTS.create({ post_id: postId, USER_ID: _id, CONTENT, TIMESTAMPS: new Date() });
    res.status(201).json({ message: "댓글을 작성했습니다." });
    //   .json({ statusCode: 201, createdComment_id: createdComment.id });
  } catch (error) {
    const message = `${req.method} ${req.originalUrl} : ${error.message}`;
    console.log(message);
    res.status(400).json({ message });
  }
};

// 댓글 수정
exports.updateComments = async (req, res) => {
  try {
    const { _id } = res.locals.user;
    const { comment_Id, CONTENT } = req.body;
    console.log(_id);
    const commentExist = await COMMENTS.findOne({ _id: comment_Id });
    const foundComment = await COMMENTS.findOne({
      _id: comment_Id,
      USER_ID: _id,
    });

    if (!commentExist) {
      res.send({
        statusCode: 411,
        errReason: "지정한 댓글이 없습니다",
      });
      return;
    } else if (!foundComment) {
      res.send({
        statusCode: 412,
        errReason: "권한이 없습니다.",
      });
      return;
    }

    const updatedComment = await COMMENTS.findOneAndUpdate(
      {
        _id: comment_Id,
      },
      {
        $set: { CONTENT },
      }
    );
    res
      .status(201)
      .json({ statusCode: 201, updatedComment_id: updatedComment._id });
    return;
  } catch (error) {
    const message = `${req.method} ${req.originalUrl} : ${error.message}`;
    console.log(message);
    return res.send({
      statusCode: 400,
      errReason: message,
    });
  }
};

// 댓글 삭제
exports.deleteComments = async (req, res) => {
  try {
    const { _id } = res.locals.user;
    const { comment_Id } = req.body;

    const commentExist = await COMMENTS.findOne({ _id: comment_Id });
    const foundComment = await COMMENTS.findOne({
      _id: comment_Id,
      USER_ID: _id,
    });

    if (!commentExist) {
      res.send({
        statusCode: 411,
        errReason: "지정한 댓글이 없습니다",
      });
      return;
    } else if (!foundComment) {
      res.send({
        statusCode: 412,
        errReason: "권한이 없습니다.",
      });
      return;
    }

    const deletedComment = await COMMENTS.deleteOne({
      _id: comment_Id,
    });
    res
      .status(201)
      .json({ statusCode: 201, deletedComment_id: deletedComment._id });
    return;
  } catch (error) {
    const message = `${req.method} ${req.originalUrl} : ${error.message}`;
    console.log(message);
    return res.send({
      statusCode: 400,
      errReason: message,
    });
  }
};
