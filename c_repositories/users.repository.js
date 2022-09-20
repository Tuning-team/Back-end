const User = require("../d_schemas/user");

class UsersRepository {
  // id로 유저 정보 조회
  getUserById = async (user_id) => {
    const returnUserInfo = await User.findOne({ _id: user_id });
    return returnUserInfo;
  };

  // 유저 정보 수정
  updateVideo = async (_id, profilePicUrl, displayName) => {
    const updatedUser = await User.update(
      { profilePicUrl, displayName },
      { where: { _id } }
    );
    return updatedUser;
  };

  // 유저 삭제
  deleteUser = async (_id) => {
    const deletedUser = await User.destroy({ where: { _id } });
    return deletedUser;
  };

  // 담기
  keepCollection = async (user_id, collection_id) => {
    const { keepCollectionsArr } = await User.findOne({ _id: user_id });
    keepCollectionsArr.push(collection_id);

    const updateDatail = await User.updateOne(
      { _id: user_id },
      { keepCollectionsArr: keepCollectionsArr }
    );
    return updateDatail;
  };

  // 담기 취소(삭제)
  notKeepCollection = async (collection_id) => {
    const notKeepCollection = await User.deleteOne({
      _id: collection_id,
    });
    return notKeepCollection;
  };

  // 유저가 보유한 담기 리스트
  getCollectionsByKeepingArray = async (keepCollectionsArr) => {
    const allCollectionsUserKept = await User.find({ keepCollectionsArr });
    return allCollectionsUserKept;
  };

  // 좋아요
  likeCollection = async (user_id, collection_id) => {
    // 기존 likedArr 찾아서,
    const { likedCollectionsArr } = await User.findOne({ _id: user_id });

    // 새로 좋아한 컬렉션 하나 넣어서
    likedCollectionsArr.push(collection_id);

    console.log("likedCollectionsArr:", likedCollectionsArr);

    // 업데이트
    const updatedDetail = await User.updateOne(
      { _id: user_id },
      { likedCollectionsArr: likedCollectionsArr }
    );
    return updatedDetail;
  };

  // 좋아요 취소
  disLikeCollection = async (user_id, collection_id) => {
    // 기존 likedArr 찾아서,
    const { likedCollectionsArr } = await User.findOne({ _id: user_id });

    // 새로 좋아한 컬렉션 하나 넣어서
    const filteredArr = likedCollectionsArr.filter((e) => e !== collection_id);

    // 업데이트
    const updatedDetail = await User.updateOne(
      { _id: user_id },
      { likedCollectionsArr: filteredArr }
    );
    return updatedDetail;
  };

  // 유저가 보유한 좋아요 리스트
  getCollectionsByLikedArray = async (likeCollectionsArr) => {
    const allCollectionsUserLiked = await User.find({ likeCollectionsArr });
    return allCollectionsUserLiked;
  };
}

module.exports = UsersRepository;
