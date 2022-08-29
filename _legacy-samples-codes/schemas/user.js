const mongoose = require("mongoose"); // 몽구스를 사용하겠다는 선언

// 몽구스로 post라는 객체는 이런 모양으로 받겠다고 선언
const UserSchema = new mongoose.Schema({
  EMAIL: {
    type: String,
    required: true,
    unique: true,
  },
  FIRST_NAME: {
    type: String,
    required: true,
  },
  LAST_NAME: {
    type: String,
    required: true,
  },
  PASSWORD: {
    type: String,
  },
  PROFILE_PIC: {
    type: String,
    required: true,
    default:
      "https://t4.ftcdn.net/jpg/03/40/12/49/360_F_340124934_bz3pQTLrdFpH92ekknuaTHy8JuXgG7fi.jpg",
  },
  FOLLOWER: {
    type: Array,
    required: true,
    default: [],
  },
  FOLLOWING: {
    type: Array,
    required: true,
    default: [],
  },
  REGISTER_FROM: {
    type: String,
    enum: ["google", "web"],
    required: true,
  },
  GOOGLE_ID: {
    type: String,
  },
  DISPLAY_NAME: {
    type: String,
    required: true,
  },
  TIMESTAMPS: {
    type: Date, // 이건 날짜 형태로 받을게요~!
    default: Date.now,
    required: true,
  },
});

// 이로써 Users 관련 DB는, 여기서 만든 몽구스 모델을 기준으로 받겠다고 외부에 선언/공개합니다.
module.exports = mongoose.model("Users", UserSchema);
