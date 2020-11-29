const passport = require("passport");
const { Strategy: LocalStrategy } = require("passport-local");
const { user: User } = require("../models");

module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "username",
        passwordField: "password",
      },
      async (username, password, done) => {
        console.log(username);
        console.log(password);
        try {
          const user = await User.findOne({
            where: { username },
          });
          if (!user) {
            return done(null, false, { reason: "존재하지 않는 이메일입니다!" });
          }
          if (password == user.password) {
            return done(null, user);
          }
          return done(null, false, { reason: "비밀번호가 틀렸습니다." });
        } catch (error) {
          console.error(error);
          return done(error);
        }
      }
    )
  );
};
