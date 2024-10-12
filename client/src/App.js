import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

//components
import Navbar from "./components/NavBar/NavBar";

//pages
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Register from "./pages/Register";
import Login from "./pages/Login";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const storedUsername = localStorage.getItem("username");
    if (token && storedUsername) {
      setIsAuthenticated(true);
      setUsername(storedUsername);
    }
  }, []);

  return (
    <Router>
      <Navbar
        isAuthenticated={isAuthenticated}
        username={username}
        setIsAuthenticated={setIsAuthenticated}
        setUsername={setUsername}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
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
        <Route path="/products/:productId" element={<ProductDetail />} />
        <Route exact path="/checkout" element={<Checkout />} />
      </Routes>
    </Router>
  );
};

export default App;
