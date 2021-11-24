const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const User = require('../models/user');

module.exports = () => {
  passport.use(new LocalStrategy({
    usernameField: 'userId',
    passwordField: 'userPwd',
  }, async (userId, userPwd, done) => {   
    try {
      const exUser = await User.findOne({ where: { userId } });
      if (exUser) { //esUser가 있다면
        const result = await bcrypt.compare(userPwd, exUser.userPwd);   //비밀번호 비교
        if (result) {
          done(null, exUser); //비밀번호가 일치하면 exUser인수에 사용자 정보넣어
        } else {
          done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
        }
      } else {      //exUser가없어 
        done(null, false, { message: '가입되지 않은 회원입니다.' });
      }
    } catch (error) {
      console.error(error);
      done(error);
    }
  }));
};
