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

  const totalAmount =
    cart && cart.length > 0
      ? cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
      : 0;

  const handleSubmit = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("authToken");
    if (!token) return;

    setIsProcessing(true);
    setError(null);

    try {
      const decodedToken = jwtDecode(token);
      const user_id = decodedToken.id;
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
    <>
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
      <div className="card-info">
        <h3>For succecfull payment test, use these numbers:</h3>
        <h4>Card number: 4242 4242 4242 4242</h4>
        <h4>MM / RR: 12/34</h4>
        <h4>CVC: 123</h4>
        <h4>PSČ: 15000</h4>
      </div>
    </>
  );
};

export default Checkout;
