import React from "react";
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

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products/:productId" element={<ProductDetail />} />
        <Route exact path="/checkout" element={<Checkout />} />
      </Routes>
    </Router>
  );
};

export default App;
