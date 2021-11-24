const express = require('express');
const {
  isLoggedIn,
  isNotLoggedIn
} = require('./middlewares'); //미들웨어에 만든거 가져와서 추가
const passport = require('passport');

const User = require('../models/user');
const Noticeboard = require('../models/noticeboard');
const Profile = require('../models/profile');

const router = express.Router();

router.use(async (req, res, next) => {
  try {
    res.locals.user = req.user;
    next();
  } catch (err) {
    next(err);
  }

})


router.get('/',  async (req, res, next) => {
  try {
    res.render('layout', {
      title: 'TheATeam'
    });
  } catch (err) {
    next(err);
  }
});

router.get('/login', isNotLoggedIn, (req, res) => {
  res.render('login', {
    title: '로그인 - NodeBird'
  });
});


router.get('/join', isNotLoggedIn, async (req, res, next) => {
  try {
    res.render('register', {
      title: '회원가입'
    });
  } catch (err) {
    next(err);
  }
});


router.get('/userinfo', isLoggedIn, (req, res) => {
  res.render('userinfo', {
    title: '로그인 - NodeBird'
  });
});

router.get('/chat', isLoggedIn, (req, res) => {
  res.render('chat', {
    title: '로그인 - NodeBird'
  });
});


  // sns 연동

router.get('/kakao', passport.authenticate('kakao'));

router.get('/kakao/callback', passport.authenticate('kakao',{
    failureRedirect: '/',
}), (req,res)=>{
    res.redirect('/');
});


router.get('/face',
  passport.authenticate('facebook'));

router.get('/face/callback',
  passport.authenticate('facebook', { failureRedirect: '/login ' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });


router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: '/login',
}), (req,res)=>{
    res.redirect('/');
})


router.get('/github',
  passport.authenticate('github', { scope: [ 'user:email' ] }));

router.get('/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

module.exports = router;