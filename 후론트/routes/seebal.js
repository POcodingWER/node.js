const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const User = require('../models/user'); //sequelize연결

const router = express.Router();

const nodemailer = require('nodemailer');




router.post('/', async(req, res,next) => {
    const {title, email,text } = await req.body;
    try{
        const mailOptions = { //옵션설정
            from: 'cjftns031@naver.com',
            to:email , //받는사람 멩리 
            subject:title,  //제목입력
            text: text,
            
        };
        
    transporter.sendMail(mailOptions,(error,info)=>{
    if(error)console.log(error);
    else{
        console.log('message sent:' `${info.response}`);
    }
    transporter.close();
})

      
      res.redirect('/');
      }catch(err){
        console.error(err);
        next(err);
    }
  });
const transporter = nodemailer.createTransport({
    service: 'naver', //사용할 메일 사이트입력
    auth:{
        host:'smtp.naver.com', //host입력
        port:'587',   //port번호입력
        user: 'cjftns031@naver.com',///'아이디'
        pass: 'cjftns1250!' //'비번'
    },
});

// const mailOptions = { //옵션설정
//     from: 'cjftns031@naver.com',
//     to:' cjftns031@naver.com', //받는사람 멩리 
//     subject:' nodejs로 mail보내긔',  //제목입력
//     text: '날라가나유~ '
// };

// transporter.sendMail(mailOptions,(error,info)=>{
//     if(error)console.log(error);
//     else{
//         console.log('message sent:' `${info.response}`);
//     }
//     transporter.close();
// })




module.exports = router;