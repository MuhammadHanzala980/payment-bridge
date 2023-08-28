"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const PaymentSuccessPage = () => {
  const [paymentStatus, setPaymentStatus] = useState("Processing...");
  const [paymentAmount, setPaymentAmount] = useState("");
  const router = useRouter();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);

    if (searchParams.get("success") === "true") {
      setPaymentStatus("Payment Successful!");

      // Retrieve orderData from local storage
      const orderData = JSON.parse(localStorage.getItem("orderData"));

      if (orderData) {
        // Extract orderId from orderData
        const orderId = orderData.id;

        // Call the update-order-status API route to update the order status to processing
        axios
          .put("/api/update-order-status", { orderId })
          .then((response) => {
            console.log(response.data);
            router.push(
              `https://mcdfynew.itrakmedia.com/checkout/order-received/${orderId}/?key=${orderData.order_key}`
            );
          })
          .catch((error) => {
            console.error("Error updating order status:", error);
          });
      } else {
        console.error("No orderData found in local storage");
      }
    } else if (searchParams.get("success") === "false") {
      setPaymentStatus("Payment Canceled.");

      // router.push("https://dainty-sunshine-58544a.netlify.app/canceled");
    }
  }, []);

  return (
    <div>
      <h1>{paymentStatus}</h1>
      <p>{paymentAmount}</p>
    </div>
  );
};

export default PaymentSuccessPage;
