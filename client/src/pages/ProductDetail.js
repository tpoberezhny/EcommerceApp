import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axios";
import { jwtDecode } from "jwt-decode";
import "../styles/ProductDetail.scss";

const ProductDetail = ({ addToCart }) => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);

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

  const handleAddToCart = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    const decodedToken = jwtDecode(token);
    const user_id = decodedToken.id;

    try {
       await axios.post("/shopping_cart", {
        user_id,
        product_id: productId,
        quantity: 1,
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  return (
    product && (
      <div className="product-details">
        <img src={product.image_url} alt={product.name} />
        <h2>{product.name}</h2>
        <p className="product-price">${product.price}</p>
        <p>{product.description}</p>
        <button onClick={handleAddToCart}>Add to Cart</button>
      </div>
    )
  );
};

export default ProductDetail;
