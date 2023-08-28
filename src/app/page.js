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

    if (orderId) {
      initiatePayment(orderId);
    } else {
      console.log("err");
    }
  }, []);

  const initiatePayment = async (orderId) => {
    try {
      const createPaymentIntent = await axios.post(
        "/api/create-payment-intent",
        {
          orderId,
        }
      );

      const { paymentIntent, clientSecret, orderData } =
        createPaymentIntent.data;
      console.log(createPaymentIntent.data);

      const createSession = await axios.post("/api/create-payment-session", {
        clientSecret,
        totalAmount: orderData.total,
      });

      const { sessionId, checkoutSession } = createSession.data;
      console.log(sessionId, createSession);
      orderData.transectionId = sessionId;
      localStorage.setItem("orderData", JSON.stringify(orderData));
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
