const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;

const User = require('../models/user');

module.exports=()=>{
    passport.use(new KakaoStrategy({
        clientID : process.env.KAKAO_ID,
        callbackURL: '/auth/kakao/callback',
    }, async(accesToken, refreshToken, profile, done) =>{
        console.log('kakao profile', profile);
        try {
            const exUser = await User.findOne({
                where:{snsId:profile.id, provider: 'kakao'},
            
        });
        if (exUser){
            done(null,exUser);
        }else{
            const newUser = await User.create({
            //    여기 철순형 db에 맞게 써줘야함
                userMail: profile._json && profile._json.kakao_account_email,
                nick: profile.displayName,
                snsId: profile.id,
                provider: 'kakao',
            });
            done(null, newUser);
        }
    }catch(error){
        console.error(error);
        done(error);
    }
  }));
};