import React from "react";
import "./NavBar.scss";

import { Link } from "react-router-dom";

import logo from "../../images/logo.png";
import homeIcon from "../../images/homeIcon.svg";
import productIcon from "../../images/productIcon.svg";
import cartIcon from "../../images/cartIcon.svg";

const Navbar = () => {
  return (
    <nav className="navBar">
      <div className="navBar-logo">
        <img src={logo} alt="Logo" />
      </div>
      <div className="navBar-links">
        <Link to="/">
          <img src={homeIcon} alt="Home" className="navBar-icon" />
          Home
        </Link>
        <Link to="/products">
          <img src={productIcon} alt="Product" className="navBar-icon" />
          Products
        </Link>
        <Link to="/cart">
          <img src={cartIcon} alt="Cart" className="navBar-icon" />
          Cart
        </Link>
      </div>
      <div className="navBar-auth">
        <Link to="/registration" className="navBar-btn navBar-btn-signup">
          Join
        </Link>
        <Link to="/login" className="navBar-btn navBar-btn-login">
          Log In
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
