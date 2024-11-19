import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axios";
import "../styles/ProductDetail.scss";

const ProductDetail = ({ addToCart }) => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [notification, setNotification] = useState("");

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`/products/${productId}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product details", error);
      }
    };

    fetchProductDetails();
  }, [productId]);

  const handleAddToCart = () => {
    addToCart(productId);
    setNotification("Item added to cart!");
    setTimeout(() => {
      setNotification("");
    }, 3000);
  };

  return (
    product && (
      <div className="product-details">
        <img src={product.image_url} alt={product.name} />
        <h2>{product.name}</h2>
        <p className="product-price">${product.price}</p>
        <p>{product.description}</p>
        <button onClick={handleAddToCart}>Add to Cart</button>
        {notification && <div className="notification">{notification}</div>}
      </div>
    )
  );
};

export default ProductDetail;
