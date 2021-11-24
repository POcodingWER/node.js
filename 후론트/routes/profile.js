const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const Profile = require('../models/profile');

const router = express.Router();


router.get('/', async(req, res, next) => {
  try{
    const profile = await Profile.findAll();
  res.render('userSearch', {title : '내정보 - NodeBird', profiles : profile,});
  }catch(err){
      console.error(err);
      next(err);
  }
});



router.post('/',isLoggedIn, async(req, res,next) => {
  const {skill,work,companyName,divisionName,workstart,workend,experience,userName,age,userTel} = await req.body;
  try{
    const user = await Profile.create({
      skill: skill.join(),
      work: work.join(),
      userName,
      age,userTel,
      companyName,
      divisionName,
      workstart, 
      workend,
      experience,
      Administrator : req.user.userId,
      });
    
    res.redirect('/');
    }catch(err){
      console.error(err);
      next(err);
  }
});

router.post('/:id',isLoggedIn, async(req, res,next) => {
  const num = await req.params.id;
  console.log(num);
  const {skill,work,companyName,divisionName,workstart,workend,experience} = await req.body;
  try{
    const user = await Profile.update({
      companyName:companyName,
      divisionName:divisionName,
      workstart:workstart, 
      workend:workend,
      experience:experience,
    },{where : {id :num }});
    
    res.redirect('/');
    }catch(err){
      console.error(err);
      next(err);
  }
});



  
module.exports = router;
