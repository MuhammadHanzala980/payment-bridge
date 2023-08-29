import axios from "axios";
import qs from "qs"; // Import the qs library
import { NextResponse } from "next/server";

export async function PUT(request) {
  //   const req = await request.json();
  const req = await request.json();
  console.log(req.transectionId,);
  if (request.method === "PUT") {
    try {
      const formData = qs.stringify({
        status: "processing",
        transaction_id: req.transectionId
      });
      const id = req.orderId;
      const response = await axios.put(
        `${process.env.SITE_URL}/wp-json/wc/v3/orders/${id}/?consumer_key=ck_7804b87d10f2dd1fac11683b48dfcbd874db1e57&consumer_secret=cs_01befbd49bfb3217cab554e5c1f50d46038155b9`,
        formData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      if (response.status === 200) {
        return NextResponse.json({
          message: "Order status updated to processing",
          id: id,
          checkOutUrl: `${process.env.SITE_URL}/checkout/order-received`
        });
      } else {
        return NextResponse.json({ message: "Failed to update order status" });
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      return NextResponse.json({ message: "Error updating order status"  });
    }
  }

  return NextResponse.json({ message: "Invalid request method" });
}
