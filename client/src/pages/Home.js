import React from "react";
import { Link } from "react-router-dom";
import "../styles/Home.scss";

const Home = () => {
  return (
    <div className="first-section">
      <h1 className="title">Shop Smart, Save Big with Our App</h1>
      <p>
        Discover unbeatable deals on a wide range of products tailored just for
        you. Experience
      </p>
      <p className="description-text">
        seamless shopping and fast delivery at your fingertips
      </p>
      <Link to="/products" className="shopBtn">
        Shop
      </Link>
      <h1 className="attention">
        Currently stragling some problems with the db (Render free subscription
        is expired)
      </h1>
      <p className="attention">Will be fixed until 20.11.24</p>
    </div>
  );
};

export default Home;
