const nodeMailer = require('nodemailer');
const account = require('../../config/google.account.json');

// 이메일 코드 발급 함수
exports.createEmailCode = async () => {
  const min = Math.ceil(12340);
  const max = Math.floor(99999);
  return Math.floor(Math.random() * (max - min)) + min;
};

exports.sendEmailCode = (email, code) => {
  const transporter = nodeMailer.createTransport({ // 보내는 사람 설정
    service: 'gmail',
    port: 587,
    host: 'smtp.gmail.com',
    secure: false,
    requireTLS: true,
    auth: {
      user: account.email,
      pass: account.pw,
    },
  });

  const mailOption = { // 이메일 내용
    from: account.email,
    to: email,
    subject: 'DGSW-SODA 회원가입 인증 코드',
    html: `<html>
            <head>
              <h1>DGSW-SODA 회원가입 인증 코드</h1>
            </head>
            <body>
              ${code}
            </body>
           </html>`,
  };

  // 이메일 보내기
  transporter.sendMail(mailOption, (err, info) => {
    if (err) { console.log(err); throw new Error(err); } else {
      console.log('Message sent : ', info);
    }
  });
};
