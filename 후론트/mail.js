const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  // 사용하고자 하는 서비스, gmail계정으로 전송할 예정이기에 'gmail'
  service: 'gmail',
  // host를 gmail로 설정
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    // Gmail 주소 입력, 'testmail@gmail.com'
    //   user: process.env.NODEMAILER_USER,
    // Gmail 패스워드 입력
    //   pass: process.env.NODEMAILER_PASS,
    user: "ponyoholics@gmail.com",
    pass: "vnfmsgksmf7",
  },
});


const mailOptions = {
  from: "Ateam@co.kr",
  to: "andy3638@naver.com",
  subject: "메일의 제목",
  html: `<p>메일의 내용(html 템플릿 형식으로 작성)</p>`,
  text: "템플릿 정도가 아니고 단순히 텍스트 보낼때는 해당 값으로 보내도 됨",
};

transporter.sendMail(mailOptions, (err, data) => {
  if (err) {
    console.error(err);
    res.status(500).json({
      status: "fail"
    });
  } else {
    res.status(200).json({
      status: "success"
    });
  }
});