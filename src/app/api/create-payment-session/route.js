const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
import { NextResponse } from "next/server";

// const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
// const stripeInstance = new stripe(stripeSecretKey);

export async function POST(request) {
  if (request.method === "POST") {
    const req = await request.json();
    const { totalAmount, orderId } = req;
    console.log(totalAmount, orderId, "<<<<body>>>>");
    try {
      console.log("Creating Session...");
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              unit_amount: totalAmount * 100,
              product_data: {
                name: "Total Amount",
                description: `Payment for order ${orderId} the total amount`,
              },
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${process.env.SUCCESS_URL}/payment-status/?success=true`,
        // cancel_url: `http://localhost:3000/payment-status/?success=false`,
        metadata: {
          order_id: orderId,
        },
      });
      return NextResponse.json({
        sessionId: session.id,
        checkoutSession: session,
      });
    } catch (error) {
      console.log(error);
      return NextResponse.json({ error: error.message });
    }
  } else {
    return NextResponse.json({ message: "Method not allowed" });
  }
}
