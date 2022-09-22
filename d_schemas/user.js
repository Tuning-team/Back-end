const mongoose = require("mongoose"); // 몽구스를 사용하겠다는 선언

// 몽구스로 post라는 객체는 이런 모양으로 받겠다고 선언
const Users = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
  },
  displayName: {
    type: String,
    required: true,
  },
  profilePicUrl: {
    type: String,
    required: true,
    default:
      "https://t4.ftcdn.net/jpg/03/40/12/49/360_F_340124934_bz3pQTLrdFpH92ekknuaTHy8JuXgG7fi.jpg",
  },
  myCollections: {
    type: Array,
    required: true,
    default: [],
  },
  myLikingCollections: {
    type: Array,
    required: true,
    default: [],
  },
  myInterestingCategories: {
    type: Array,
    required: true,
    default: [],
  },
  myKeepingCollections: {
    type: Array,
    required: true,
    default: [],
  },
  followings: {
    type: Array,
    required: true,
    default: [],
  },
  createdAt: {
    type: Date, // 이건 날짜 형태로 받을게요~!
    default: Date.now,
    required: true,
  },
});

// 이로써 Users 관련 DB는, 여기서 만든 몽구스 모델을 기준으로 받겠다고 외부에 선언/공개합니다.
module.exports = mongoose.model("Users", Users);
