// 유저 관련 아웃풋(응답) 데이터로 사용할법한 mock 데이터를 정리해놓고, export하여 외부에서 사용할 수 있게 함

const signUpRes = {
  message: "회원 가입에 성공하였습니다.",
};

const loginRes = {
  token:
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTY1OTk1NDY2MH0.mJq5l_MB92xAeRawClUswYckh4vUSvccYeAgNBmYnNE",
};

module.exports = { signUpRes, loginRes };
