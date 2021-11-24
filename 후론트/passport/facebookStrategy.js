const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

const User = require('../models/user');



module.exports=()=>{
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "/face/callback"
  }, async(accesToken, refreshToken, profile, done) =>{
    console.log('face profile', profile);
    try {
        const exUser = await User.findOne({
            where:{snsId:profile.id, provider: 'face'},
        
    });
    if (exUser){
        done(null,exUser);
    }else{
        const newUser = await User.create({
            email: profile._json && profile._json.face_account_email,
            nick: profile.displayName,
            snsId: profile.id,
            provider: 'face',
        });
        done(null, newUser);
    }
}catch(error){
    console.error(error);
    done(error);
}
}));

}