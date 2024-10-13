import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

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
    }

    const fetchCartItems = async () => {
      if (!token) return;

      const decodedToken = jwtDecode(token);
      const user_id =decodedToken.id;

      try {
        const response = await axios.get(`/shopping_cart/${user_id}`);
        setCart(response.data || []);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    fetchCartItems();
  }, []);

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
      setCart((prevCart) => [...prevCart, response.data]);
    } catch (error) {
      console.error("Error adding product to the cart", error);
    }
  };

  return (
    <Router>
      <Navbar
        isAuthenticated={isAuthenticated}
        username={username}
        cart={cart}
        setIsAuthenticated={setIsAuthenticated}
        setUsername={setUsername}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/shopping_cart" element={<Cart cart={cart}/>} />
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
        <Route exact path="/checkout" element={<Checkout />} />
      </Routes>
    </Router>
  );
};

export default App;
