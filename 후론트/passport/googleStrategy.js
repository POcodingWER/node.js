const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const User = require('../models/user');

module.exports=()=>{


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/google/callback"
  },
  async(accesToken, refreshToken, profile, done) =>{
    console.log('google profile', profile);
    try {
        const exUser = await User.findOne({
            where:{snsId:profile.id, provider: 'google'},
        
    });
    if (exUser){
        done(null,exUser);
    }else{
        console.log(profile);
        const newUser = await User.create({
            email: profile._json && profile._json.face_account_email,
            nick: profile.displayName,
            snsId: profile.id,
            provider: 'google',
        });
        done(null, newUser);
    }
}catch(error){
    console.error(error);
    done(error);
}
}));

}