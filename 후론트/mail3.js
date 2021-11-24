const nodemailer = require('nodemailer');
const nodemailerSendgrid = require('nodemailer-sendgrid');

const transport = nodemailer.createTransport(
    nodemailerSendgrid({
        apiKey: process.env.SENDGRID_API_KEY
    })
);


const mailOptions = {
    from: 'andy3638@naver.com',
    to: 'ponyoholics@gmail.com',
    subject: 'hello world',
    html: '<h1>Hello world!</h1>'
};



transport.sendMail(mailOptions, (err, data) => {
    if (err) {
        console.log(err);
    } else {
        console.log('Message sent: ' + info.response);
    }
});




// 'Receiver Name <receiver@example.com>, someother@example.com'