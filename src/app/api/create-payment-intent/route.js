import stripe from "stripe";
import { NextResponse } from "next/server";
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripeInstance = new stripe(stripeSecretKey);

export async function POST(request) {
  if (request.method === "POST") {
    const req = await request.json();
    const { orderId, totalAmount } = req;
    console.log(orderId, totalAmount);
    try {
      const paymentIntent = await stripeInstance.paymentIntents.create({
        amount: totalAmount,
        currency: "usd",
      });

      return NextResponse.json({
        paymentIntent: paymentIntent,
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error) {
      return NextResponse.json({ error: error.message, data: req.body });
    }
  } else {
    return NextResponse.json(process.env.STRIPE_SECRET_KEY); // Method not allowed
  }
}
