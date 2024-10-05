const express = require("express");
const db = require("../db/index");
const router = express.Router();

//GET /orders - Retrieve all orders for the logged in user
router.get("/orders", async (req, res) => {
  const { user_id } = req.body;

  try {
    const orders = await db.query(
      "SELECT id, total_price, status, created_at FROM orders WHERE user_id = $1",
      [user_id]
    );

    if (orders.rows.length === 0) {
      return res.status(404).send("No orders found for the user");
    }

    res.json(orders.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

//Get /orders/{orderId} - Retrieve details of a specific order
router.get("/orders/:orderId", async (req, res) => {
  const { orderId } = req.params;

  try {
    //Fetch the order detail
    const order = await db.query(
      "SELECT id, total_price, status, created_at FROM orders WHERE id = $1",
      [orderId]
    );

    if (order.rows.length === 0) {
      return res.status(404).send("Order not found");
    }

    //Fetching items for the order
    const orderItems = await db.query(
      `SELECT products.name, order_items.quantity, order_items.price
     FROM order_items
     JOIN products ON order_items.product_id = products.id
     WHERE order_items.order_id = $1`,
      [orderId]
    );

    res.json({
      order: order.rows[0],
      items: orderItems.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server errror");
  }
});

module.exports = router;
