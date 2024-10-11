const express = require("express");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const db = require("../db/index");

const router = express.Router();

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      //Fetching user from db
      const result = await db.query("SELECT * FROM users WHERE username = $1", [
        username,
      ]);

      const user = result.rows[0];
      const isPasswordMatch = await bcrypt.compare(password, user.password);

      if (!user || !isPasswordMatch) {
        return done(null, false, { message: "Incorrect credentials." });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const result = await db.query("SELECT * FROM users WHERE id = $1", [id]);
    const user = result.rows[0];
    done(null, user);
  } catch (err) {
    done(err);
  }
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: false,
  })
);

module.exports = router;
