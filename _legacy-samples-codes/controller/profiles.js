const USERS = require("../schemas/user");

// ----- 내 프로필 -----
// TASK 1 : 내 프로필 조회
exports.getProfile = async (req, res) => {
  try {
    const {
      _id,
      FIRST_NAME,
      LAST_NAME,
      PROFILE_PIC,
      FOLLOWER,
      FOLLOWING,
      REGISTER_FROM,
      DISPLAY_NAME,
      TIMESTAMPS,
    } = res.locals.user;
    // 내 프로필 정보 뿌려주기

    const myProfile = {
      _id, // user의 고유번호
      FIRST_NAME, // 이름
      LAST_NAME, // 성
      PROFILE_PIC, // 프로필사진 (기본값 있음)
      FOLLOWER, // 나를 팔로잉하는 유저의 _id 리스트
      FOLLOWING, // 내가 팔로잉하는 유저의 _id 리스트
      REGISTER_FROM, // 어떤 경로로 가입했는지
      DISPLAY_NAME, // 닉네임으로 사용할 이름 (기본값 First+Last name)
      TIMESTAMPS, // 가입일 또는 수정일
    };

    res.status(201).json({ statusCode: 201, myProfile });
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
// TASK 2 : 내 프로필 수정
exports.updateProfile = async (req, res) => {
  try {
    const { _id } = res.locals.user;
    // 내 프로필 정보 수정
    const { FIRST_NAME, LAST_NAME, PROFILE_PIC, DISPLAY_NAME } = req.body;

    // update 작업
    const updatedProfile = await USERS.findOneAndUpdate(
      {
        _id: _id,
      },
      {
        $set: {
          FIRST_NAME,
          LAST_NAME,
          PROFILE_PIC,
          DISPLAY_NAME,
        },
      }
    );
    res
      .status(201)
      .json({ statusCode: 201, updatedProfile: updatedProfile._id });
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

// ----- following 기능 -----
// TASK 3 : _id를 가진 유저가 팔로잉 하는 유저들의 (id, DISPLAY_NAME, PROFILE_PIC)
exports.userFollows = async (req, res) => {
  try {
    const { _id } = req.params; // prams 에 들어온 _id 값
    const { FOLLOWING } = await USERS.findOne({ _id: _id.toString() });

    // 이들의 정보를 받음,
    const whomUserFollows = await USERS.find({
      _id: FOLLOWING,
    });

    const resultData = whomUserFollows.map((e) => {
      return {
        _id: e._id,
        DISPLAY_NAME: e.DISPLAY_NAME,
        PROFILE_PIC: e.PROFILE_PIC,
      };
    });

    res.status(201).json({ statusCode: 201, resultData });
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
// TASK 4 : _id를 가진 유저를 팔로잉 하는 유저들의 리스트 (id, DISPLAY_NAME, PROFILE_PIC)
exports.userFollowedBy = async (req, res) => {
  try {
    const { _id } = req.params; // prams 에 들어온 _id 값
    const { FOLLOWER } = await USERS.findOne({ _id: _id.toString() });

    // 이들의 정보를 받음,

    const whomUserFollows = await USERS.find({
      _id: FOLLOWER,
    });

    const resultData = whomUserFollows.map((e) => {
      return {
        _id: e._id,
        DISPLAY_NAME: e.DISPLAY_NAME,
        PROFILE_PIC: e.PROFILE_PIC,
      };
    });

    res.status(201).json({ statusCode: 201, resultData });
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
// TASK 5 : 로그인된 유저가 _id 유저를 팔로우
exports.followAction = async (req, res) => {
  try {
    const user = res.locals.user;
    console.log("followAction user", user);
    // const user = await USERS.findOne({ _id: "630055fce3c4e17206ebec77" });
    const { _id } = req.params;
    console.log("followAction _id", _id);

    // 유저가 현재 팔로우하는 사람에 한명 추가
    const newFollowing = Array.from(
      new Set([...user.FOLLOWING, _id.toString()])
    );

    // 특정유저(_id)의 현재 팔로어에 한명 추가
    const { FOLLOWER } = await USERS.findOne({ _id: _id });
    console.log("FOLLOWER", FOLLOWER);
    const newFollower = Array.from(new Set([...FOLLOWER, user._id.toString()]));

    // 우선 로그인유저 FOLLOWING에 새로운 _id 하나 추가
    await USERS.findOneAndUpdate(
      { _id: user._id },
      { $set: { FOLLOWING: newFollowing } }
    );

    // 신규팔로어 DB FOLLOWER에 user._id도 하나 추가
    await USERS.findOneAndUpdate(
      { _id: _id },
      { $set: { FOLLOWER: newFollower } }
    );

    // 내 프로필 정보 수정
    res.status(201).json({
      statusCode: 201,
      message: `${user._id} 유저가 ${_id} 유저를 팔로우 합니다.`,
    });
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
// TASK 6 : 로그인된 유저가 _id 유저를 팔로우
exports.unfollowAction = async (req, res) => {
  try {
    const user = res.locals.user;
    const { _id } = req.params;

    // 유저가 현재 팔로우하는 사람에 한명 제외
    const newFollowing = user.FOLLOWING.filter((e) => e !== _id.toString());

    // 특정유저(_id)의 현재 팔로어에 한명 제외
    const { FOLLOWER } = await USERS.findOne({ _id: _id });
    console.log(FOLLOWER);
    const newFollower = FOLLOWER.filter((e) => e !== user._id.toString());

    // 우선 로그인유저 FOLLOWING에 새로운 _id 하나 추가
    await USERS.findOneAndUpdate(
      { _id: user._id },
      { $set: { FOLLOWING: newFollowing } }
    );

    // 신규팔로어 DB FOLLOWER에 user._id도 하나 추가
    await USERS.findOneAndUpdate(
      { _id: _id },
      { $set: { FOLLOWER: newFollower } }
    );

    // 내 프로필 정보 수정
    res.status(201).json({
      statusCode: 201,
      message: `${user._id} 유저가 ${_id} 유저를 언팔로우 했습니다.`,
    });
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

// ----- 다른유저 프로필 ----
// TASK 7 : 특정 유저(:_id)의 프로필 보기
exports.getOthersProfile = async (req, res) => {
  try {
    const { _id } = req.params;

    const {
      _id: USER_ID,
      FIRST_NAME,
      LAST_NAME,
      PROFILE_PIC,
      FOLLOWER,
      FOLLOWING,
      REGISTER_FROM,
      DISPLAY_NAME,
      IMAGE,
      TIMESTAMPS,
    } = await USERS.findOne({ _id });
    // 프로필 정보 뿌려주기

    const profileInfo = {
      USER_ID, // user의 고유번호
      FIRST_NAME, // 이름
      LAST_NAME, // 성
      PROFILE_PIC, // 프로필사진 (기본값 있음)
      FOLLOWER, // 나를 팔로잉하는 유저의 _id 리스트
      FOLLOWING, // 내가 팔로잉하는 유저의 _id 리스트
      REGISTER_FROM, // 어떤 경로로 가입했는지
      DISPLAY_NAME, // 닉네임으로 사용할 이름 (기본값 First+Last name)
      IMAGE, // 구글이미지(구글 프로필이 있으면 이걸 사용)
      TIMESTAMPS, // 가입일 또는 수정일
    };

    res.status(200).json({ statusCode: 200, profileInfo });
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
// TASK 8 : 프로필을 검색하여, 리스트로 보기
exports.searchProfiles = async (req, res) => {
  try {
    // 내 프로필 정보 수정
    res.status(201).json({ statusCode: 201 });
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

// TASK 9 : 팔로우할 프로필 추천
exports.whoTofollow = async (req, res) => {
  try {
    // const user = res.locals.user;
    const usersTofollow = await USERS.find({}).sort({ TIMESTAMPS: 1 });
    const topTenToFollow = usersTofollow.slice(0, 10);

    const resultData = topTenToFollow.map((e) => {
      return {
        _id: e._id,
        DISPLAY_NAME: e.DISPLAY_NAME,
        PROFILE_PIC: e.PROFILE_PIC,
      };
    });

    res.status(201).json({ statusCode: 201, resultData });
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
