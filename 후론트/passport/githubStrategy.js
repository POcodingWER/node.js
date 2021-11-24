const passport = require("passport");
const GithubStrategy = require('passport-github2').Strategy;

const User = require('../models/user');

module.exports=()=>{


passport.use(new GithubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "/github/callback"
  },
  async(accesToken, refreshToken, profile, done) =>{
    console.log('github profile', profile);
    try {
        const exUser = await User.findOne({
            where:{snsId:profile.id, provider: 'github'},
        
    });
    if (exUser){
        done(null,exUser);
    }else{
        const newUser = await User.create({
            email: profile._json && profile._json.face_account_email,
            nick: profile.displayName,
            snsId: profile.id,
            provider: 'github',
        });
        done(null, newUser);
    }
}catch(error){
    console.error(error);
    done(error);
}
}));

}