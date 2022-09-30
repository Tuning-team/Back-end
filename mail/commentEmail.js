const User = require("../d_schemas/user");
const nodemailer = require("nodemailer");
// const user = require("../d_schemas/user");
// const smtpTransport = require("nodemailer-smtp-transport");
require("dotenv").config();

//메일발송 객체
const mailSender = {
    // 메일발송 함수
  sendGmail: function (param) {
    let transporter = nodemailer.createTransport({
      // smtpTransport({
        service: 'gmail',
        port: 465,
        // host: 'smtp.gmail.com',
        secure: true,
        auth: {
          // type: "login",
          user: process.env.GOOGLE_CLIENT_ID, // gmail 계정 아이디를 입력
          pass: process.env.GOOGLE_CLIENT_SECRET,
        },
      // })
      });

    // mailoptions
    let mailOptions = {
      from: process.env.GOOGLE_CLIENT_ID, // sender
      to: param.toEmail,
      subject: param.subject,
      text: param.text,
};

//메일 발송 
transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
},
};

module.exports = mailSender;