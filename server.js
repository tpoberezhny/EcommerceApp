const express = require("express");
const session = require('express-session');
const passport = require('passport');
require('dotenv').config();

const app = express();
const port = 3000;
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

const registerRoute = require("./routes/register");
app.use(registerRoute);

const authRoute = require('./routes/auth');
app.use(authRoute);

app.listen(port, () => {
  console.log(`Server is running on PORT:${port}`);
});