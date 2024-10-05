const express = require("express");
const session = require("express-session");
const passport = require("passport");
require("dotenv").config();

const app = express();
const port = 3000;

app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

const registerRoute = require("./routes/register");
app.use(registerRoute);

const authRoute = require("./routes/auth");
app.use(authRoute);

const productRoute = require("./routes/products");
app.use(productRoute);

const userRoute = require("./routes/users");
app.use(userRoute);

const cartRoute = require("./routes/cart");
app.use(cartRoute);

const orderRoute = require("./routes/orders");
app.use(orderRoute);

app.listen(port, () => {
  console.log(`Server is running on PORT:${port}`);
});
