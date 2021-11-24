const express = require('express');
const {
  isLoggedIn,
  isNotLoggedIn
} = require('./middlewares'); //미들웨어에 만든거 가져와서 추가
const passport = require('passport');

const User = require('../models/user');
const Profile = require('../models/profile');
const Notice = require('../models/notice');
const Forum = require('../models/forum');
const Noticeboard = require('../models/noticeboard');

const {
  compareSync
} = require('bcrypt');

const {
  sequelize
} = require('../models');

const {Op} = require('sequelize');

const router = express.Router();

let check = 0;

router.use(async (req, res, next) => {
  try {
    res.locals.user = req.user;
    next();
  } catch (err) {
    next(err);
  }

})

router.get('/', async (req, res, next) => {
  try {
    const notices = await Notice.findAll();
    const noticeboards = await Noticeboard.findAll();
    const forums = await Forum.findAll();
    const ff = await Noticeboard.findAll({where:{boardCount :{[Op.lt]:1 }}});
    console.log(ff.length);
    if (check > 0) {
      res.render('관리자 첫 페이지', {
        notices,
        noticeboards,
        forums,
        ff,
      });
    } else {
      res.render('login_v2', {});
    }
  } catch (err) {
    next(err);
  }
});


router.post('/admin', isNotLoggedIn, async (req, res, next) => {
  try {


    const notices = await Notice.findAll();
    const noticeboards = await Noticeboard.findAll();
    const forums = await Forum.findAll();
    const ff = await Noticeboard.findAll({where:{boardCount :{[Op.lt]:1}}});

    if (req.body.id == process.env.ADMIN_ID && req.body.pwd == process.env.ADMIN_PASSWORD) {
      req.session.id = req.body.id;
      check = 1;
      console.log(req.session);
      req.session.save();
      res.render('관리자 첫 페이지', {
        notices,
        noticeboards,
        forums,
        ff,
      });
    } else {
      res.redirect('/');
    }
  } catch (err) {
    next(err);
  }
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



router.get('/profile', async (req, res, next) => {
  try {
    const profile = await Profile.findAll();
    res.render('1', {
      title: '내정보 - NodeBird',
      profiles: profile,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.post('/profile', isLoggedIn, async (req, res, next) => {
  const {
    skill,
    work,
    companyName,
    divisionName,
    workstart,
    workend,
    experience
  } = await req.body;
  try {
    const user = await Profile.create({
      skill: skill.join(),
      work: work.join(),
      companyName,
      divisionName,
      workstart,
      workend,
      experience,
      Administrator: req.user.userId
    });

    res.redirect('/');
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.post('/profile/:id', isLoggedIn, async (req, res, next) => {
  const num = await req.params.id;
  console.log(num);
  const {
    skill,
    work,
    companyName,
    divisionName,
    workstart,
    workend,
    experience
  } = await req.body;
  try {
    const user = await Profile.update({
      companyName: companyName,
      divisionName: divisionName,
      workstart: workstart,
      workend: workend,
      experience: experience,
    }, {
      where: {
        id: num
      }
    });

    res.redirect('/');
  } catch (err) {
    console.error(err);
    next(err);
  }
});







module.exports = router;