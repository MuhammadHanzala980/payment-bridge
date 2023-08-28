"use client";

import { useEffect } from "react";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

const PaymentPage = () => {
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const orderId = searchParams.get("orderid");
    const totalAmount = searchParams.get("totalAmount");

    if (orderId && totalAmount) {
      initiatePayment(orderId, totalAmount);
    } else {
      console.log("err");
    }
  }, []);

  const initiatePayment = async (orderId, totalAmount) => {
    try {
      const createPaymentIntent = await axios.post(
        "/api/create-payment-intent",
        {
          orderId,
          totalAmount,
        }
      );

      const { paymentIntent, clientSecret } = createPaymentIntent.data;
      console.log(clientSecret, paymentIntent);

      const createSession = await axios.post("/api/create-payment-session", {
        // clientSecret,
        totalAmount,
      });
      const { sessionId } = createSession.data;

      const stripe = await stripePromise;

      const result = await stripe.redirectToCheckout({
        sessionId: sessionId,
      });

      if (result.error) {
        console.error("Payment error:", result.error.message);
      } else {
        console.log("Payment done!");
      }
    } catch (error) {
      console.error(" request error:", error);
    }
  };

  return <div>Redirecting to Stripe...</div>;
};

export default PaymentPage;
