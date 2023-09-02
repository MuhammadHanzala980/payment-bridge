import axios from "axios";
import qs from "qs"; // Import the qs library
import { NextResponse } from "next/server";

function formatDateToISO(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

function getTodayAndOneMonthAgo() {
  const today = new Date();
  const oneMonthAgo = new Date(today);
  oneMonthAgo.setMonth(today.getMonth() - 1);

  const formattedToday = formatDateToISO(today);
  const formattedOneMonthAgo = formatDateToISO(oneMonthAgo);

  return {
    today: formattedToday,
    oneMonthAgo: formattedOneMonthAgo,
  };
}

export async function PUT(request) {
  //   const req = await request.json();
  const req = await request.json();
  console.log(req);
  const orderType = req.orderType;
  if (request.method === "PUT") {
    try {
      const data = {
        status: orderType === "orders" ? "processing" : "active",
        transaction_id: req.transectionId,
      };
      if (orderType == "subscriptions") {
        console.log(getTodayAndOneMonthAgo());
        const { today, oneMonthAgo } = getTodayAndOneMonthAgo();
        data.last_payment_date_gmt = today;
        data.next_payment_date_gmt = oneMonthAgo;
      }
      const formData = qs.stringify(data);
      console.log(formData);
      const id = req.orderId;
      const response = await axios.put(
        `https://mcdfynew.itrakmedia.com/wp-json/wc/v3/${orderType}/${id}/?consumer_key=ck_7804b87d10f2dd1fac11683b48dfcbd874db1e57&consumer_secret=cs_01befbd49bfb3217cab554e5c1f50d46038155b9`,
        formData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      if (response.status === 200) {
        return NextResponse.json({
          message: `Order status updated to ${
            orderType === "orders" ? "processing" : "active"
          }`,
          id: id,
          checkOutUrl: process.env.CHECKOUT_URL,
        });
      } else {
        return NextResponse.json({ message: "Failed to update order status" });
      }
    } catch (error) {
      return NextResponse.json(
        { message: "Error updating order status" },
        { status: 404 }
      );
    }
  }

  return NextResponse.json({ message: "Invalid request method" });
}
