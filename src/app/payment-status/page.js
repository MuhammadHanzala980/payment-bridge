"use client";
import "../../../.env.local";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import lottie from "lottie-web";
import redirectCheckout from "../lottie/generateReciept.json";

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

const PaymentSuccessPage = () => {
  const [paymentStatus, setPaymentStatus] = useState("Processing...");
  const router = useRouter();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);

    if (searchParams.get("success") === "true") {
      setPaymentStatus("Payment Successful!");
      const orderData = JSON.parse(localStorage.getItem("orderData"));
      if (orderData) {
        const orderId = orderData.id;
        const transectionId = orderData.transectionId;
        const orderType = orderData.orderType;
        console.log(orderType)
        axios
          .put("/api/update-order-status", { orderId, transectionId, orderType })
          .then((response) => {
            const redirectUrl = `${response.data.checkOutUrl}/checkout/order-received/${orderId}/?key=${orderData.order_key}`;
            router.push(redirectUrl);
            console.log(response);
          })
          .catch((error) => {
            console.error("Error updating order status:", error);
          });
      } else {
        console.error("No orderData found in local storage");
      }
    } else if (searchParams.get("success") === "false") {
      setPaymentStatus("Payment Canceled.");
    }
  }, []);

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
        <div style={{ maxWidth: "400px" }}>
          <LottieAnimation animationData={redirectCheckout} />
        </div>
        <h2 style={{ color: "#000" }}>Payment Complete</h2>
        <p
          style={{
            color: "#222",
            fontWeight: "600",
            fontSize: "13px",
            marginTop: "1em",
          }}
        >
          Please Wait While We Generate Your Order Reciept!
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;