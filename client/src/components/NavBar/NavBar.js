import React from "react";
import "./NavBar.scss";

import { Link, useNavigate } from "react-router-dom";

import logo from "../../images/logo.png";
import homeIcon from "../../images/homeIcon.svg";
import productIcon from "../../images/productIcon.svg";
import cartIcon from "../../images/cartIcon.svg";

const Navbar = ({
  isAuthenticated,
  username,
  setIsAuthenticated,
  setUsername,
  cart,
}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");
    setIsAuthenticated(false);
    setUsername("");
    navigate("/");
  };

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
        <Link to="/shopping_cart">
          <img src={cartIcon} alt="Cart" className="navBar-icon" />
          Cart ({cart.length})
        </Link>
      </div>
      <div className="navBar-auth">
        {isAuthenticated ? (
          <div className="navBar-authenticated">
            <span className="navBar-username">Hello, {username}</span>
            <button
              onClick={handleLogout}
              className="navBar-btn navBar-btn-logout"
            >
              Logout
            </button>
          </div>
        ) : (
          <>
            <Link to="/register" className="navBar-btn navBar-btn-signup">
              Join
            </Link>
            <Link to="/login" className="navBar-btn navBar-btn-login">
              Log In
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
