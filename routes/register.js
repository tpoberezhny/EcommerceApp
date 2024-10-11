const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../db/index");
const { body, validationResult } = require("express-validator");
const passport = require("passport");

const router = express.Router();

router.post(
  "/register",
  [
    body("username").notEmpty().withMessage("Username is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    try {
      // Checking if user alresdy exist
      const userCheck = await db.query(
        "SELECT * FROM users WHERE username = $1 OR email = $2",
        [username, email]
      );
      if (userCheck.rows.length > 0) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      // Inserting new user into the db
      const result = await db.query(
        "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email, created_at",
        [username, email, hashedPassword]
      );

      const user = result.rows[0];

      req.login(user, (err) => {
        if (err) {
          console.error(err);
          return res
            .status(500)
            .json({ message: "Login failed after registration" });
        }
        res.status(201).json({
          success: true,
          message: "User registered successfully and logged in",
          user: result.rows[0],
        });
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
