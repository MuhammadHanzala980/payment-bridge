"use client";
import { useEffect, useRef } from "react";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import lottie from "lottie-web";
import redirectCheckout from "./lottie/redirectCheckout.json";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

// components/LottieAnimation.js

const LottieAnimation = ({ animationData }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      const anim = lottie.loadAnimation({
        container: containerRef.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData: animationData,
      });

      return () => {
        anim.destroy();
      };
    }
  }, [animationData]);

  return <div ref={containerRef} />;
};

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
      console.log(createPaymentIntent.data,">>>>");

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

  return (
    <div
      style={{
        backgroundColor: "#fff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div style={{textAlign: 'center'}} >
        <LottieAnimation animationData={redirectCheckout} />
        <h2 style={{ color: "#000" }}>Redirecting To Secure Payment</h2>
        <p style={{color: "#222", fontWeight:'600', fontSize: "13px"}} >Please Wait While We Generate Secure Payment Gateaway!</p>
      </div>
    </div>
  );
};

export default PaymentPage;
