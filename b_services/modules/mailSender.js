require("dotenv").config();
const nodemailer = require("nodemailer");

//메일발송 객체
const mailSender = {
  sendGmail: function (param) {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      port: 465,
      secure: true,
      auth: {
        user: process.env.GOOGLE_EMAIL_ID,
        pass: process.env.GOOGLE_EMAIL_PW,
      },
    });

    let mailOptions = {
      from: process.env.GOOGLE_EMAIL_ID,
      to: param.toEmail,
      subject: param.subject,
      text: param.text,
      html: param.html,
    };

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
