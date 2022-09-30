require("dotenv").config();
const nodemailer = require("nodemailer");
// const User = require("../d_schemas/user");
// const user = require("../d_schemas/user");
// const smtpTransport = require("nodemailer-smtp-transport");

//메일발송 객체
const mailSender = {
  // 메일발송 함수
  sendGmail: function (param) {
    let transporter = nodemailer.createTransport({
      // smtpTransport({
      service: "gmail",
      port: 465,
      // host: 'smtp.gmail.com',
      secure: true,
      auth: {
        // type: "login",
        user: "love.free.work@gmail.com", // gmail 계정 아이디를 입력
        pass: "hwnydebzanjtbmfq",
      },
      // })
    });

    // mailoptions
    let mailOptions = {
      from: "love.free.work@gmail.com", // sender
      to: param.toEmail,
      subject: param.subject,
      text: param.text,
    };

    //메일 발송
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  },
};

module.exports = mailSender;
