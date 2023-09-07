import axios from "axios";
import qs from "qs"; // Import the qs library
import { NextResponse } from "next/server";

export async function PUT(request) {
  const req = await request.json();
  console.log(req);
  const orderType = req.orderType;
  if (request.method === "PUT") {
    try {
      const data = {
        status: orderType === "orders" ? "processing" : "active",
        transaction_id: req.transectionId,
      };

      const formData = qs.stringify(data);
      const id = req.orderId;

      const options = {
        method: orderType === "orders" ? "PUT" : "POST",
        url: `${process.env.SITE_URL}/wp-json/wc/v3/${orderType}/${id}/?consumer_key=${process.env.CONSUMER_KEY}&consumer_secret=${process.env.CONSUMER_SECRET}`,
        data: formData,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      };
      console.log(options, data, process.env.SITE_URL);

      const response = await axios(options);
      console.log(response);
      if (response.status === 200) {
        return NextResponse.json({
          message: `Order status updated to ${
            orderType === "orders" ? "processing" : "active"
          }`,
          id: id,
          checkOutUrl: process.env.SITE_URL,
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
