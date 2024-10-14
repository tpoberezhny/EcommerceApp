import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

//components
import Navbar from "./components/NavBar/NavBar";

//pages
import Home from "./pages/Home";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Register from "./pages/Register";
import Login from "./pages/Login";
import axios from "./api/axios";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [cart, setCart] = useState([]);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const storedUsername = localStorage.getItem("username");
    if (token && storedUsername) {
      setIsAuthenticated(true);
      setUsername(storedUsername);
      fetchCartItems();
    }
  }, []);

  const fetchCartItems = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setCart([]);
      return;
    }

    const decodedToken = jwtDecode(token);
    const user_id = decodedToken.id;

    try {
      const response = await axios.get(`/shopping_cart/${user_id}`);
      const cartItemsWithUserId = response.data.map((item) => ({
        ...item,
        user_id,
      }));
      setCart(cartItemsWithUserId || []);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  const addToCart = async (productId) => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    const decodedToken = jwtDecode(token);
    const user_id = decodedToken.id;

    try {
      const response = await axios.post("/shopping_cart", {
        user_id,
        product_id: productId,
        quantity: 1,
      });

      setCart((prevCart) => {
        const existingItem = prevCart.find(
          (item) => item.id === response.data.product_id
        );
        if (existingItem) {
          // Increase quantity if item exists
          return prevCart.map((item) =>
            item.id === response.data.product_id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          // Add new item to cart
          return [...prevCart, { ...response.data, quantity: 1 }];
        }
      });

      setTimeout(() => {
        fetchCartItems();
      }, 100);
    } catch (error) {
      console.error("Error adding product to the cart", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchCartItems();
    }
  }, [isAuthenticated]);

  return (
    <Router>
      <Navbar
        isAuthenticated={isAuthenticated}
        username={username}
        cart={cart}
        setIsAuthenticated={setIsAuthenticated}
        setUsername={setUsername}
        setCart={setCart}
      />
      <Elements stripe={stripePromise}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductList />} />
          <Route
            path="/shopping_cart"
            element={
              <Cart
                cart={cart}
                setCart={setCart}
                fetchCartItems={fetchCartItems}
              />
            }
          />
          <Route
            path="/register"
            element={
              <Register
                setIsAuthenticated={setIsAuthenticated}
                setUsername={setUsername}
              />
            }
          />
          <Route
            path="/login"
            element={
              <Login
                setIsAuthenticated={setIsAuthenticated}
                setUsername={setUsername}
              />
            }
          />
          <Route
            path="/products/:productId"
            element={<ProductDetail addToCart={addToCart} />}
          />
          <Route
            exact
            path="/checkout"
            element={
              <Checkout
                cart={cart}
                fetchCartItems={fetchCartItems}
                setCart={setCart}
              />
            }
          />
        </Routes>
      </Elements>
    </Router>
  );
};

export default App;
