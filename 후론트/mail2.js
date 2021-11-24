// const nodemailer = require('nodemailer');
// const nodemailerSendgrid = require('nodemailer-sendgrid');




// async function f () {

// const transporter = nodemailer.createTransport(
//     nodemailerSendgrid({
//         // apiKey: process.env.SENDGRID_API_KEY
//         apiKey : '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'
//     })
// );

 
// const mailOptions = {
//     from: "andy3638@naver.com",
//     to: "ponyoholics@gmail.com",   
//     subject: "메일의 제목",
//     html: `<p>메일의 내용(html 템플릿 형식으로 작성)</p>`,
//     text: "템플릿 정도가 아니고 단순히 텍스트 보낼때는 해당 값으로 보내도 됨",
//   };
  
// const email = await  transporter.sendMail(mailOptions);
// }

// f().catch(console.error);


const sgMail = require('@sendgrid/mail')
sgMail.setApiKey('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')
const msg = {
  to: 'ponyoholics@gmail.com', // Change to your recipient
  from: 'andy3638@naver.com', // Change to your verified sender
  subject: 'Sending with SendGrid is Fun',
  html: `<strong>and easy to do anywhere, even with Node.js</strong>`,
}
sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent')
  })
  .catch((error) => {
    console.error(error)
  })


//   var nodemailer = require('nodemailer');
// var smtpTransport = require('nodemailer-smtp-transport');
 
// var transporter = nodemailer.createTransport(smtpTransport({
//   service: 'gmail',
//   host: 'smtp.gmail.com',
//   auth: {
//     user: 'somerealemail@gmail.com',
//     pass: 'realpasswordforaboveaccount'
//   }
// }));
 
// var mailOptions = {
//   from: 'somerealemail@gmail.com',
//   to: 'friendsgmailacc@gmail.com',
//   subject: 'Sending Email using Node.js[nodemailer]',
//   text: 'That was easy!'
// };
 
// transporter.sendMail(mailOptions, function(error, info){
//   if (error) {
//     console.log(error);
//   } else {
//     console.log('Email sent: ' + info.response);
//   }
// });  
