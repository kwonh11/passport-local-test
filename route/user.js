const express = require("express");
const router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const passport = require("passport");

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error(err);
      return next(err);
    }
    if (info) {
      return res.status(401).send(info.reason);
    }
    return req.login(user, async (loginErr) => {
      if (loginErr) {
        console.error(loginErr);
        return next(loginErr);
      }
      return res.status(200).send("login success");
    });
  })(req, res, next);
});

module.exports = router;
