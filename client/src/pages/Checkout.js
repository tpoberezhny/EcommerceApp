import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { jwtDecode } from "jwt-decode";
import axios from "../api/axios";
import "../styles/Checkout.scss";

const Checkout = ({ cart = [], fetchCartItems, setCart }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  console.log("Cart:", cart);

  const totalAmount =
    cart && cart.length > 0
      ? cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
      : 0;

  console.log("Total Amount:", totalAmount);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("authToken");
    if (!token) return;

    setIsProcessing(true);
    setError(null);

    try {
      const decodedToken = jwtDecode(token);
      const user_id = decodedToken.id;

      console.log("Total Amount being sent to backend:", totalAmount); // Add logging

      // Request the Payment Intent from backend
      const {
        data: { clientSecret },
      } = await axios.post("/shopping_cart/create-payment-intent", {
        user_id,
        amount: totalAmount,
      });

      const { error: paymentError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        });

      if (paymentError) {
        setError(`Payment failed: ${paymentError.message}`);
      } else if (paymentIntent.status === "succeeded") {
        console.log("Payment succeeded, proceeding with checkout");
        await axios.post("/shopping_cart/checkout", { user_id });
        setSuccess(true);
        fetchCartItems();
        setCart([]);
      }
    } catch (error) {
      console.error("Error during payment:", error);
      setError("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="checkout">
      <h2>Checkout</h2>
      <form onSubmit={handleSubmit}>
        <CardElement />
        <button type="submit" disabled={!stripe || isProcessing}>
          {isProcessing ? "Processing..." : "Pay"}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
      {success && (
        <p className="success">
          Payment successful! Thank you for your purchase.
        </p>
      )}
    </div>
  );
};

export default Checkout;
