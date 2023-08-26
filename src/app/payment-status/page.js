"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const PaymentSuccessPage = () => {
  const [paymentStatus, setPaymentStatus] = useState("Processing...");
  const [paymentAmount, setPaymentAmount] = useState("");
  const router = useRouter();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);

    if (searchParams.get("success") === "true") {
      setPaymentStatus("Payment Successful!");
      router.push("https://dainty-sunshine-58544a.netlify.app/thank-you")
      // here user will be redirect to thank you page
    } else if (searchParams.get("success") === "false") {
      setPaymentStatus("Payment Canceled.");
      router.push("https://dainty-sunshine-58544a.netlify.app/thank-you")
      // here user will be redirect to cancele  page

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
