const MY_SECRET_KEY = process.env.MY_SECRET_KEY;
const jwt = require("jsonwebtoken"); // jwt 토큰 사용
const Joi = require("joi");
const bcrypt = require("bcryptjs");
// 이 파일에서 사용할 post DB가 어떻게 생겼는지 불러옵니다. (schema/post.js)
const USERS = require("../schemas/user");
const passport = require("passport");

// ------------------

// GOOGLE 로그인
exports.googleLogin = passport.authenticate("google", {
  scope: ["profile", "email"],
});

// exports.mainPage = async (req, res) => {
//   res.render("main");
// };
// exports.registerPage = async (req, res) => {
//   res.render("signup");
// };

exports.registerDirect = async (req, res) => {
  // 로그인 상태가 아닐 때 진행
  if (req.cookies.token) {
    return res.send({
      statusCode: 411,
      message: "이미 로그인이 되어있습니다.",
    });
  }

  // joi validation 객체
  const hangulAcceptRegX = /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9]+$/;
  const signupSchema = Joi.object({
    EMAIL: Joi.string().email().required(),
    PASSWORD: Joi.string().min(5).max(12).alphanum().required(),
    CONFIRM: Joi.string().min(5).max(12).alphanum().required(),
    FIRST_NAME: Joi.string()
      .max(20)
      .pattern(new RegExp(hangulAcceptRegX))
      .required(),
    LAST_NAME: Joi.string()
      .max(20)
      .pattern(new RegExp(hangulAcceptRegX))
      .required(),
  });

  try {
    // joi 객체의 스키마를 잘 통과했는지 확인
    const { EMAIL, PASSWORD, CONFIRM, FIRST_NAME, LAST_NAME } =
      await signupSchema.validateAsync(req.body);

    // 기타 확인
    if (PASSWORD !== CONFIRM) {
      return res.send({
        statusCode: 412,
        message: "입력하신 두개의 비밀번호가 다릅니다.",
      });
    }

    // Email 존재 확인
    const isExistEmail = await USERS.findOne({ EMAIL });
    if (isExistEmail) {
      return res.send({
        statusCode: 413,
        message: "이미 가입된 이메일 입니다.",
      });
    }

    //
    const PASSWORD_SALT = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(PASSWORD, PASSWORD_SALT);

    // signUp 서비스 진행해보고 결과 응답
    const createdUser = await USERS.create({
      PASSWORD: hashedPassword,
      EMAIL,
      FIRST_NAME,
      LAST_NAME,
      REGISTER_FROM: "web",
      DISPLAY_NAME: FIRST_NAME + " " + LAST_NAME,
      TIMESTAMPS: new Date(),
    });

    return res.status(201).send({
      statusCode: 201,
      createdUser_id: createdUser._id,
      msg: "회원가입이 되었습니다.",
    });
  } catch (error) {
    const message = `${req.method} ${req.originalUrl} : ${error.message}`;
    return res.send({
      statusCode: 400,
      errReason: message,
      message: "입력하신 이메일과 패스워드를 확인해주세요.",
    });
  }
};

//TASK 2: 로그인
exports.logIn = async (req, res) => {
  const { EMAIL, PASSWORD } = req.body;
  if (!EMAIL || !PASSWORD) {
    return res.status(403).send({
      message: "아이디 또는 비밀번호를 입력해주세요.",
    });
  }

  try {
    const userOnDB = await USERS.findOne({ EMAIL });
    const isSuccess = bcrypt.compareSync(PASSWORD, userOnDB.PASSWORD); // True or False
    if (isSuccess) {
      const token = jwt.sign(
        { email: userOnDB.EMAIL, display_name: userOnDB.DISPLAY_NAME },
        process.env.TOKEN_KEY,
        { expiresIn: "2h" } //2시간뒤 유효 기간 만료
      );
      return res.status(200).send({ token, message: "로그인 성공" });
    } else {
      return res
        .status(403)
        .send({ message: "아이디 또는 비밀번호가 틀렸습니다." });
    }
  } catch (error) {
    return res.status(403).send({ message: "로그인 실패" });
  }
};

//GOOGLE LOGIN
exports.googleCallback = (req, res, next) => {
  try {
    passport.authenticate("google", { failureRedirect: "/" }, (error, user) => {
      if (error) {
        return next(error);
      }
      console.log(user);
      const { EMAIL, DISPLAY_NAME } = user;
      const token = jwt.sign({ EMAIL }, process.env.TOKEN_KEY, {
        expiresIn: "24h",
      });
      res.status(200).send({ token, EMAIL, DISPLAY_NAME });
    })(req, res, next);
  } catch (error) {
    res.status(400).send({ message: "구글 로그인 실패" });
  }
};

//testing
exports.submitTest = (req, res) => {
  // const name = req.body;
  // const file = req.files.file;
  // const fileName = file.name;
  if (req.files === null) {
    return res.status(400).json({ msg: "No file uploaded" });
  }

  const file = req.files.file;
  const fileName = file.name;
  file.mv(`${__dirname}/public/uploads/${fileName}`, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }

    res.json({ fileName: file.name, filePath: `/uploads/${file.name}` });
  });
};

// exports.login = async (req, res) => {
//   const loginSchema = Joi.object({
//     EMAIL: Joi.string().email().required(),
//     PASSWORD: Joi.string().min(5).max(12).alphanum().required(),
//   });

//   try {
//     // joi 객체의 스키마를 잘 통과했는지 확인
//     const { EMAIL, PASSWORD } = await loginSchema.validateAsync(req.body);

//     if (req.cookies.token) {
//       return res.send({
//         statusCode: 411,
//         message: "이미 로그인이 되어있습니다.",
//       });
//     }

//     const userOnDB = await USERS.findOne({ EMAIL });
//     const isSuccess = bcrypt.compareSync(PASSWORD, userOnDB.PASSWORD); // True or False

//     if (isSuccess) {
//       return res
//         .cookie("token", "로그인 성공", {
//           sameSite: "Strict",
//           maxAge: 30000, // 30sec
//           httpOnly: true,
//         })
//         .status(200)
//         .send({
//           statusCode: 200,
//           token: "로그인 성공",
//           message: "로그인에 성공하였습니다.",
//         });
//     }
//   } catch (error) {
//     const message = `${req.method} ${req.originalUrl} : ${error.message}`;
//     return res.send({
//       statusCode: 412,
//       errReason: message,
//       message: "입력하신 이메일과 패스워드를 확인해주세요.",
//     });
//   }
// };

// 임시 인증절차 middleware (모두 tester1로 통과)
// exports.authMiddleware = async (req, res, next) => {
//   try {
//     console.log("------ 🤔 Authorization Checking ------");

//     let user = await USERS.findOne({ EMAIL: "test@test3.com" }); // 임시 통과

//     console.log("------ ✅  Authorization Checked ------");

//     // 다 통과하면 토큰을 복호화하여 user 정보를 다음 미들웨어가 사용할 수 있는 형태로 넘겨준다.
//     res.locals.user = user;
//     next();
//     return;

//     // 에러 생기면 에러메세지
//   } catch (e) {
//     return res.send({
//       statusCode: 400,
//       message: "로그인 후 사용하세요",
//     });
//   }
// };
