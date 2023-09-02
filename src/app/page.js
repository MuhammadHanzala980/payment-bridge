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
      console.log(orderId);
      fetchOrderData(orderId);
    } else {
      console.log("err");
    }
  }, []);

  const createPaymentSession = async ({ orderId, totalAmount }) => {
    const createSession = await axios.post("/api/create-payment-session", {
      orderId: orderId,
      totalAmount: totalAmount,
    });
    return createSession;
  };

  const createSubscriptionSession = async ({
    orderId,
    email,
    totalAmount,
    interval,
  }) => {
    const createSession = await axios.post("/api/create-subscription-session", {
      orderId: orderId,
      email: email,
      totalAmount: totalAmount,
      interval: interval,
    });
    return createSession;
  };

  const redirectToStripe = async ({ sessionId }) => {
    const stripe = await stripePromise;
    const result = await stripe.redirectToCheckout({
      sessionId: sessionId,
    });

    if (result.error) {
      console.error("Payment error:", result.error.message);
    } else {
      console.log("Payment done!");
    }
  };

  async function getOrderType(orderData, orderId) {
    if (orderData.parent_id === 0) {
      const paymentSession = await createPaymentSession({
        orderId: orderId,
        totalAmount: orderData.total,
      });
      const { sessionId } = paymentSession.data;
      orderData.transectionId = sessionId;
      orderData.orderType = "orders";
      localStorage.setItem("orderData", JSON.stringify(orderData));
      await redirectToStripe({ sessionId });

      return "Single Payment Order";
    } else if (orderData.id > orderData.parent_id) {
      const subscriptionDetails = await axios.post(
        "/api/fetch-subscription-details",
        {
          orderId,
        }
      );
      console.log(subscriptionDetails, ">>>>");

      const subscriptionData = subscriptionDetails.data.orderData;
      if (subscriptionData.status == "active") {
        const interval = subscriptionData.billing_period;
        const billing = subscriptionData.billing;
        const subscriptionSession = await createSubscriptionSession({
          orderId,
          email: billing.email,
          totalAmount: subscriptionData.total,
          interval,
        });
        const { sessionId } = subscriptionSession.data;
        subscriptionData.transectionId = sessionId;
        subscriptionData.orderType = "subscriptions";
        localStorage.setItem("orderData", JSON.stringify(subscriptionData));
        await redirectToStripe({ sessionId });
      } else {
        console.log("expired>>>>");
      }
    }
    {
      return "Subscription Order";
    }
  }

  const fetchOrderData = async (orderId) => {
    try {
      const orderDetails = await axios.post("/api/fetch-order-details", {
        orderId,
      });
      console.log(orderDetails, ">>>>");
      const { orderData } = orderDetails?.data;

      const orderType = await getOrderType(orderData, orderId);

      // const { sessionId } = paymentSession.data;
      // orderData.transectionId = sessionId;
      // localStorage.setItem("orderData", JSON.stringify(orderData));
    } catch (error) {
      console.error(" request error:", error.message);
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
      <div style={{ textAlign: "center" }}>
        <LottieAnimation animationData={redirectCheckout} />
        <h2 style={{ color: "#000" }}>Redirecting To Secure Payment</h2>
        <p style={{ color: "#222", fontWeight: "600", fontSize: "13px" }}>
          Please Wait While We Generate Secure Payment Gateaway!
        </p>
      </div>
    </div>
  );
};

export default PaymentPage;
