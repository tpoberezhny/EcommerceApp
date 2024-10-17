const express = require("express");
const db = require("../db/index");

const router = express.Router();

//GET /products?category={categoryId} - Retrieving products by category
router.get("/products", async (req, res) => {
  const { category } = req.query;

  try {
    let query;
    let params = [];

    if (category) {
      query = "SELECT * FROM products WHERE category_id = $1";
      params = [category];
    } else {
      query = "SELECT * FROM products";
    }

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

//GET /products/{productId} - Retrieving single product by ID
router.get("/products/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query("SELECT * FROM products WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).send("Product not found");
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

//POST /products - Create a new product
router.post("/products", async (req, res) => {
  const { name, description, price, category_id } = req.body;

  try {
    const result = await db.query(
      "INSERT INTO products (name, description, price, category_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, description, price, category_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

//PUT /products/{productId} - Update an existing product
router.put("/products/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description, price, category_id } = req.body;

  try {
    const result = await db.query(
      "UPDATE products SET name = $1, description = $2, price = $3, category_id = $4 WHERE id = $5 RETURNING *",
      [name, description, price, category_id, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Product not found");
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

//DELETE /products/{pdoductId} - Delete a product
router.delete("/products/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      "DELETE FROM products WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Product not found");
    }

    res.send("Product deleted successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
