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

  // 좋아요
  likeCollection = async (user_id, collection_id) => {
    // 기존 likedArr 찾아서,
    const { myLikingCollections } = await User.findOne({ _id: user_id });

    // 새로 좋아한 컬렉션 하나 넣어서
    myLikingCollections.push(collection_id);

    console.log("myLikingCollections:", myLikingCollections);

    // 업데이트
    const updatedDetail = await User.updateOne(
      { _id: user_id },
      { myLikingCollections: myLikingCollections }
    );
    return updatedDetail;
  };

  // 좋아요 취소
  disLikeCollection = async (user_id, collection_id) => {
    // 기존 likedArr 찾아서,
    const { myLikingCollections } = await User.findOne({ _id: user_id });

    // 새로 좋아한 컬렉션 하나 넣어서
    const filteredArr = myLikingCollections.filter((e) => e !== collection_id);

    // 업데이트
    const updatedDetail = await User.updateOne(
      { _id: user_id },
      { myLikingCollections: filteredArr }
    );
    return updatedDetail;
  };
}

module.exports = UsersRepository;
