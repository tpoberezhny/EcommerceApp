import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import { jwtDecode } from "jwt-decode";
import "../styles/Cart.scss";

const Cart = ({ cart = [], setCart }) => {
  const [showCurrentOrder, setShowCurrentOrder] = useState(true);
  const [orderHistory, setOrderHistory] = useState([]);

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  useEffect(() => {
    const fetchOrderHistory = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      const decodedToken = jwtDecode(token);
      const user_id = decodedToken.id;

      try {
        const response = await axios.get(`/orders/${user_id}`);
        setOrderHistory(response.data);
      } catch (error) {
        console.error("Error fetching order history", error);
      }
    };
    fetchOrderHistory();
  }, []);

  return (
    <div className="cart-page">
      <div className="cart-buttons">
        <button onClick={() => setShowCurrentOrder(true)}>Current Order</button>
        <button onClick={() => setShowCurrentOrder(false)}>
          History of Orders
        </button>
      </div>

      {showCurrentOrder ? (
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <p>{item.name}</p>
              <p>Quantity: {item.quantity}</p>
              <p>Price: ${item.price}</p>
            </div>
          ))}
          <div className="total-price">
            <p>Total: ${totalPrice}</p>
          </div>
          <button className="checkout-button">Checkout</button>
        </div>
      ) : (
        <div className="order-history">
          {orderHistory.map((order) => (
            <div key={order.id} className="order-item">
              <p>Order #{order.id}</p>
              <p>Total: ${order.total_price}</p>
              <p>Date: {new Date(order.created_at).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Cart;
