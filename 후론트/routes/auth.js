const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const {
  isLoggedIn,
  isNotLoggedIn
} = require('./middlewares');
const User = require('../models/user'); //sequelize연결

const router = express.Router();

router.route('/')
  .get(async (req, res, next) => {
    try {
      const users = await User.findAll();
      res.json(users);
      console.log(users)
    } catch (err) {
      console.error(err);
      next(err);
    }
  })
  
  //회원가입
  router.post('/join', isNotLoggedIn, async (req, res, next) => {   
    console.log()
    const {userId, userPwd, userName,nick, userDate, postcode,address,detailAddress,extraAddress,userTel,userMail,userGender } = req.body;
    try {
      const exUser = await User.findOne({ where: { userId } });    //아이디 중복확인
      if (exUser) {
        return res.redirect('/join?error=exist');
      }
      const hash = await bcrypt.hash(userPwd, 12);  //비밀번호 암호화
      await User.create({
        userId,
        userPwd: hash,
        userName,
        nick,
        userDate,
        postcode,
        address,
        detailAddress,
        extraAddress,
        userTel,
        userMail,
        userGender,
      });
      return res.redirect('/');
    } catch (error) {
      console.error(error);
      return next(error);
    }
  });
  

  
   //로그인
   router.post('/login', isNotLoggedIn, (req, res, next) => {     //로그인 전략수행
    
    passport.authenticate('local', (authError, user, info) => {  
      if (authError) {
        console.error(authError);
        return next(authError);
      }
      if (!user) {
        return res.redirect(`/?loginError=${info.message}`);
      }
      return req.login(user, (loginError) => {   08 //passport.serializeUser호출  user ->serializeUser넘어감
        if (loginError) {
          console.error(loginError);
          return next(loginError);
      }
      return res.redirect('/');
    });
  })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
});

//로그아웃
router.get('/logout', isLoggedIn, (req, res) => {
  req.logout();              //req.user제거
  req.session.destroy();     //req.session 객체내용 제거
  res.redirect('/');         //메인페이지로
});


//회원정보수정불러오기
router.get('/userinfo',isLoggedIn, async(req, res, next) => {try{
  res.render('userinfo', { title: '개인정보 수정 - NodeBird'});
  }catch(err){
      console.error(err);
      next(err);
  }
});


//회원정보수정하기
router.post('/userinfo',isLoggedIn, async(req, res,next) => {
  const {userId, nick, userName, userDate, postcode, address, detailAddress, extraAddress, userTel, userMail,} = await req.body;
  try{
    const user = await User.update({
      userName,
      nick ,
      userDate,
      postcode,
      address,
      detailAddress,
      extraAddress,
      userTel,
      userMail,
    },{where : {userId : userId}});
    res.redirect('/');
    }catch(err){
      console.error(err);
      next(err);
  }
});

router.get('/:id',isLoggedIn, async(req, res,next) => {
  try{
    const user = await User.destroy({ where : {id :req.params.id}});
    
    res.redirect('/');
    }catch(err){
      console.error(err);
      next(err);
  }
});



module.exports = router;