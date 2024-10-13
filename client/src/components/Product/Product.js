import React from "react";
import { Link } from "react-router-dom";
import "./Products.scss";

const Product = ({ product }) => {
  return (
    <div className="product">
      <img src={product.image_url} alt={product.name} />
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <p className="product-price">${product.price}</p>
      <Link to={`/products/${product.id}`} className="details-link">
        View Details
      </Link>
    </div>
  );
};

export default Product;
