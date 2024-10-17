const express = require("express");
const db = require("../db/index");
const bcrypt = require("bcrypt");
const router = express.Router();
//GET /users - Retrieve all users (will be restricted to admins)
router.get("/users", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT id, username, email, created_at FROM users"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});
//GET /users/:id - Retrieve spesific userby ID
router.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      "SELECT id, username, email, created_at FROM users WHERE id = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send("User not found");
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});
//PUT /users/:id - Update user information (name, email, etc.)
router.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { username, email, password } = req.body;
  try {
    //Checking if password is provided
    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }
    const result = await db.query(
      "UPDATE users SET username = $1, email = $2, password = COALESCE($3, password) WHERE id = $4 RETURNING id, username, email, created_at",
      [username, email, hashedPassword, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send("User not found");
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});
module.exports = router;
