const User = require("../d_schemas/user");

class UsersRepository {
  // id로 유저 정보 조회
  getUserById = async (user_id) => {
    const returnUserInfo = await User.findOne({ _id: user_id });
    return returnUserInfo;
  };

  // 유저 삭제
  deleteUser = async (_id) => {
    const deletedUser = await User.destroy({ where: { _id } });
    return deletedUser;
  };

  updateUserInterest = async (user_id, myInterestingCategories) => {
    const updatedUser = await User.updateOne({ _id: user_id }, { myInterestingCategories });
    return updatedUser;
  };

  // 담기
  keepCollection = async (user_id, collection_id) => {
    const { myKeepingCollections } = await User.findOne({ _id: user_id });
    myKeepingCollections.push(collection_id);
    const updateDatail = await User.updateOne({ _id: user_id }, { myKeepingCollections: myKeepingCollections });

    return updateDatail;
  };

  // 담기 취소
  notKeepCollection = async (user_id, collection_id) => {
    const { myKeepingCollections } = await User.findOne({ _id: user_id });
    const filteredArr = myKeepingCollections.filter((e) => e !== collection_id);
    const updatedDetail = await User.updateOne({ _id: user_id }, { myKeepingCollections: filteredArr });

    return updatedDetail;
  };

  // 좋아요
  likeCollection = async (user_id, collection_id) => {
    const { myLikingCollections } = await User.findOne({ _id: user_id });
    myLikingCollections.push(collection_id);
    const updatedDetail = await User.updateOne({ _id: user_id }, { myLikingCollections: myLikingCollections });

    return updatedDetail;
  };

  // 좋아요 취소
  disLikeCollection = async (user_id, collection_id) => {
    const { myLikingCollections } = await User.findOne({ _id: user_id });
    const filteredArr = myLikingCollections.filter((e) => e !== collection_id);
    const updatedDetail = await User.updateOne({ _id: user_id }, { myLikingCollections: filteredArr });

    return updatedDetail;
  };

  createMyCollection = async (user_id, collection_id) => {
    const { myCollections } = await User.findOne({ _id: user_id });
    myCollections.push(collection_id);
    const updatedDetail = await User.updateOne({ _id: user_id }, { myCollections: myCollections });

    return updatedDetail;
  };

  //관심사 등록
  setInterestCategories = async (user_id, myInterestingCategories) => {
    const updatedInterest = await User.updateOne({ _id: user_id }, { myInterestingCategories });
    return updatedInterest;
  };

  deleteMyCollection = async (user_id, collection_id) => {
    const { myCollections } = await User.findOne({ _id: user_id });
    const filteredArr = myCollections.filter((e) => e !== collection_id);
    const updatedDetail = await User.updateOne({ _id: user_id }, { myCollections: filteredArr });

    return updatedDetail;
  };

  followUser = async (user_id, userToFollow) => {
    const { followings } = await User.findOne({ _id: user_id });
    followings.push(userToFollow.toString());
    const updatedDetail = await User.updateOne({ _id: user_id }, { followings });

    return updatedDetail;
  };

  unfollowUser = async (user_id, userToFollow) => {
    const { followings } = await User.findOne({ _id: user_id });
    const filteredArr = followings.filter((e) => e !== userToFollow);
    const updatedDetail = await User.updateOne({ _id: user_id }, { followings: filteredArr });

    return updatedDetail;
  };

  // 유저가 보유한 좋아요 리스트
  getCollectionsByLikedArray = async (likeCollectionsArr) => {
    const allCollectionsUserLiked = await User.find({ likeCollectionsArr });
    return allCollectionsUserLiked;
  };

  // 댓글 좋아요
  likeComment = async (user_id, comment_id) => {
    const { myLikingComments } = await User.findOne({ _id: user_id });
    myLikingComments.push(comment_id);
    const updatedDetail = await User.updateOne({ _id: user_id }, { myLikingComments });

    return updatedDetail;
  };

  // 댓글 좋아요 취소
  dislikeComment = async (user_id, comment_id) => {
    const { myLikingComments } = await User.findOne({ _id: user_id });
    const filteredArr = myLikingComments.filter((e) => e !== comment_id);
    const updatedDetail = await User.updateOne({ _id: user_id }, { myLikingComments: filteredArr });

    return updatedDetail;
  };
}

module.exports = UsersRepository;
