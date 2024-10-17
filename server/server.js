const express = require("express");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors")
require("dotenv").config();

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } //Set to true in production wih HTTPS
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

const userRoute = require("./routes/user");
app.use(userRoute);

const cartRoute = require("./routes/cart");
app.use("/shopping_cart", cartRoute);

const orderRoute = require("./routes/orders");
app.use("/orders", orderRoute);

app.listen(port, () => {
  console.log(`Server is running on PORT:${port}`);
});
