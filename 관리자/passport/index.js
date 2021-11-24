const passport = require('passport');
const local = require('./localStrategy');

const User = require('../models/user');

module.exports=()=>{
    passport.serializeUser((user,done)=>{
        done(null,user.id);
    });

    passport.deserializeUser((id,done)=>{
        User.findOne({
            where:{id}, 
        })
            .then(user=>{done(null,user)})
            .catch(err=>done(err));

            // 레디스 데이터베이스 사용자 정보 캐싱 나중에 배움
    });

    local();
};