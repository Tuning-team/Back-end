const User = require("../d_schemas/user");

class UsersRepository {
  // id로 유저 정보 조회
  getUserById = async (_id) => {
    const returnUserInfo = await User.findOne({ _id });
    console.log(returnUserInfo);
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
}

module.exports = UsersRepository;
