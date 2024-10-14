import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { jwtDecode } from "jwt-decode";
import "../styles/Cart.scss";

const Cart = ({ cart = [], setCart, fetchCartItems }) => {
  const [showCurrentOrder, setShowCurrentOrder] = useState(true);
  const [orderHistory, setOrderHistory] = useState([]);
  const navigate = useNavigate();

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
    if (!showCurrentOrder) fetchOrderHistory();
  }, [showCurrentOrder]);

  const increaseQuantity = async (item) => {
    const { user_id, id: product_id, quantity } = item;

    if (!user_id || !product_id) {
      console.error("User ID or Product ID is missing.");
      return;
    }

    try {
      await axios.put(`/shopping_cart/${user_id}/${product_id}`, {
        quantity: quantity + 1,
      });
      fetchCartItems();
    } catch (error) {
      console.error("Error increasing item quantity", error);
    }
  };

  const decreaseQuantity = async (item) => {
    const { user_id, id: product_id, quantity } = item;

    if (!user_id || !product_id) {
      console.error("User ID or Product ID is missing.");
      return;
    }

    if (quantity > 1) {
      try {
        await axios.put(`/shopping_cart/${user_id}/${product_id}`, {
          quantity: quantity - 1,
        });
        fetchCartItems();
      } catch (error) {
        console.error("Error decreasing item quantity", error);
      }
    } else {
      removeFromCart(item);
    }
  };

  const removeFromCart = async (item) => {
    const { user_id, id: product_id } = item;

    if (!user_id || !product_id) {
      console.error("User ID or Product ID is missing.");
      return;
    }

    try {
      await axios.delete(`/shopping_cart/${user_id}/${product_id}`);

      setCart((prevCart) =>
        prevCart.filter((cartItem) => cartItem.id !== product_id)
      );

      await fetchCartItems();
    } catch (error) {
      console.error("Error removing item from cart", error);
    }
  };

  const handleCheckout = () => {
    navigate("/checkout");
  }

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
            <div key={item.product_id} className="cart-item">
              <img
                src={item.image_url}
                alt={item.name}
                className="cart-item-image"
              />
              <div className="cart-item-details">
                <p>{item.name}</p>
                <p>Price: ${item.price}</p>
                <div className="quantity-controls">
                  <button onClick={() => decreaseQuantity(item)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => increaseQuantity(item)}>+</button>
                </div>
                <button
                  onClick={() => removeFromCart(item)}
                  className="remove-button"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <div className="total-price">
            <p>Total: ${totalPrice}</p>
          </div>
          <button onClick={handleCheckout} className="checkout-button">
            Checkout
          </button>
        </div>
      ) : (
        <div className="order-history">
          {orderHistory.map((order) => (
            <div key={order.id} className="order-item">
              <p>Order #{order.id}</p>
              <p>Total: ${order.total_price}</p>
              <p>Date: {new Date(order.created_at).toLocaleDateString()}</p>
              <div>
                <h4>Items: </h4>
                <ul>
                  {order.items.map((item) => (
                    <li key={item.product_id}>
                      {item.name} - ${item.price} x {item.quantity}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Cart;
