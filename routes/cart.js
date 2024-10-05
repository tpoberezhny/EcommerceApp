const express = require("express");
const db = require("../db/index");
const router = express.Router();

// POST /shopping_cart - Add a product to users shopping cart
router.post("/shopping_cart", async (req, res) => {
  const { user_id, product_id, quantity } = req.body;

  try {
    // Check if the product is already in the shopping cart for the user
    const productInCart = await db.query(
      "SELECT * FROM shopping_cart WHERE user_id = $1 AND product_id = $2",
      [user_id, product_id]
    );

    if (productInCart.rows.length > 0) {
      // If product already exists in the cart, update the quantity
      const updatedItem = await db.query(
        "UPDATE shopping_cart SET quantity = quantity + $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2 AND product_id = $3 RETURNING *",
        [quantity, user_id, product_id]
      );
      res.json(updatedItem.rows[0]);
    } else {
      // If product is not in the cart, add it
      const newItem = await db.query(
        "INSERT INTO shopping_cart (user_id, product_id, quantity, created_at, updated_at) VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *",
        [user_id, product_id, quantity]
      );
      res.status(201).json(newItem.rows[0]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// GET /shopping_cart/{user_id} - Retrieve the shopping cart for the user
router.get("/shopping_cart/:user_id", async (req, res) => {
  const { user_id } = req.params;

  try {
    const cartItems = await db.query(
      `SELECT products.id, products.name, products.price, shopping_cart.quantity
       FROM shopping_cart
       JOIN products ON shopping_cart.product_id = products.id
       WHERE shopping_cart.user_id = $1`,
      [user_id]
    );
    if (cartItems.rows.length === 0) {
      return res.status(404).send("Shopping cart is empty or does not exist");
    }
    res.json(cartItems.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

//PUT /shopping_cart/{user_id}/{product_id} - Update quantity of a product in the cart
router.put("/shopping_cart/:user_id/:product_id", async (req, res) => {
  const { user_id, product_id } = req.params;
  const { quantity } = req.body;

  try {
    const updatedItem = await db.query(
      "UPDATE shopping_cart SET quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2 AND product_id = $3 RETURNING *",
      [quantity, user_id, product_id]
    );

    if (updatedItem.rows.length === 0) {
      return res.status(404).send("Product not found in shooping cart");
    }
    res.send(updatedItem.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

//DE:ETE /shopping_cart/{user_id}/{product_id} - Remove product from the cart
router.delete("/shopping_cart/:user_id/:product_id", async (req, res) => {
  const { user_id, product_id } = req.params;

  try {
    const deletedItem = await db.query(
      "DELETE FROM shopping_cart WHERE user_id = $1 AND product_id = $2 RETURNING *",
      [user_id, product_id]
    );
    if (deletedItem.rows.length === 0) {
      return res.status(404).send("Product not found in shopping cart");
    }

    res.send("Product removed from shopping cart");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
