/* 여기에 전달될 클라이언트의 요청을 적절히 나누어 처리보내고 반환해주는 역할을 함 (요청 수신, 데이터 검증, 결과 반환, 예외처리) */

// 라우터에서 사용할 컨트롤러 클래스와 그 안의 메소드를 정의
// 그 과정에서, 다시 각 메소드가 사용할 서비스 클래스를 필요로 함(require)

const UserService = require("../services/users.service");
const Joi = require("joi");

// Post의 컨트롤러(Controller)역할을 하는 클래스
class UsersController {
  userService = new UserService(); // 인스턴스
  signupSchema = Joi.object({
    nickname: Joi.string().min(3).max(30).alphanum().required(),
    // 최소 3자 이상, 알파벳 대소문자(a~z, A~Z), 숫자(0~9)
    password: Joi.string().min(4).max(30).alphanum().required(),
    // 최소 4자 이상이며, 닉네임과 같은 값이 포함된 경우 회원가입에 실패 (API에서 검토)
    confirm: Joi.string().min(4).max(30).alphanum().required(),
  });
  loginSchema = Joi.object({
    nickname: Joi.string().min(3).max(30).alphanum().required(),
    password: Joi.string().min(4).max(30).required(),
  });

  // 어떤 요청에 대해서는 회원가입 진행 후 메세지를 반환합니다.
  signUp = async (req, res) => {
    try {
      console.log("** --- UsersController.signUp ---");

      // joi 객체의 스키마를 잘 통과했는지 확인
      const { nickname, password, confirm } =
        await this.signupSchema.validateAsync(req.body);

      // 헤더가 인증정보를 가지고 있으면 (로그인 되어 있으면,)
      if (req.cookies.token) {
        console.log("이미 로그인이 되어있습니다.");
        res.status(400).send({
          errorMessage: "이미 로그인이 되어있습니다.",
        });
        return;
      }

      // ---- 추가적인 유효성 검사 (validation) ------
      // 입력된 패스워드 2개가 같은지 확인
      if (password !== confirm) {
        console.log("입력하신 두개의 비밀번호가 다릅니다");
        res.status(400).send({
          errorMessage: "입력하신 두개의 비밀번호가 다릅니다",
        });
        return;
      }

      // 패스워드가 닉네임을 포함하는지 확인
      if (password.includes(nickname)) {
        console.log("비밀번호는 닉네임을 포함할 수 없습니다.");
        return res.status(400).send({
          errorMessage: "비밀번호는 닉네임을 포함할 수 없습니다. ",
        });
      }
      // ---- 추가적인 유효성 검사 (validation) End ------

      // signUp 서비스 진행해보고 결과 응답
      const { success, message } = await this.userService.signUp(
        nickname,
        password
      );

      console.log("** --- UsersController.signUp Returns---");
      if (success) {
        return res.status(200).json({ message });
      } else {
        return res.status(400).json({ message });
      }
    } catch (error) {
      const message = `${req.method} ${req.originalUrl} : ${error.message}`;
      console.log(message + "입력하신 아이디와 패스워드를 확인해주세요.");
      res.status(400).send({
        errorMessage: message + "입력하신 아이디와 패스워드를 확인해주세요.",
      });
    }
  };

  login = async (req, res) => {
    try {
      console.log("** --- UsersController.login ---");
      // joi 객체의 스키마를 잘 통과했는지 확인
      const { nickname, password } = await this.loginSchema.validateAsync(
        req.body
      );

      console.log(req.cookies);
      // 헤더가 인증정보를 가지고 있으면 (로그인 되어 있으면,) 반려
      if (req.cookies.token) {
        return res
          .status(400)
          .send({ errorMessage: "이미 로그인이 되어있습니다." });
      }

      const { success, token } = await this.userService.getToken(
        nickname,
        password
      );

      console.log("** --- UsersController.login Returns---");

      if (success) {
        res.cookie("token", `Bearer ${token}`, {
          maxAge: 30000, // 원활한 테스트를 위해 로그인 지속시간을 30초로 두었다.
          httpOnly: true,
        });
        return res.status(200).end();
      } else {
        return res
          .status(400)
          .json({ message: "닉네임 또는 패스워드를 확인해주세요." });
      }
    } catch (error) {
      const message = `${req.method} ${req.originalUrl} : ${error.message}`;
      res.status(400).send({ message });
    }
  };
}

module.exports = UsersController;
