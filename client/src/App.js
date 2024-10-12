import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

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
  }, []);

  const addToCart = async (productId) => {
    try {
      const response = await axios.post('/cart', {productId});
      setCart([...cart, response.data]);
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
        <Route path="/cart" element={<Cart />} />
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
        <Route path="/products/:productId" element={<ProductDetail addToCart={addToCart}/>} />
        <Route exact path="/checkout" element={<Checkout />} />
      </Routes>
    </Router>
  );
};

export default App;
