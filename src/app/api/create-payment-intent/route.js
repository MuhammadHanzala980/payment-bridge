import stripe from "stripe";
import { NextResponse } from "next/server";
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripeInstance = new stripe(stripeSecretKey);
import axios from "axios";
export async function POST(request) {
  if (request.method === "POST") {
    const req = await request.json();
    const { orderId } = req;
    console.log("geting order data...", orderId);
    const response = await axios.get(
      `${process.env.FETCH_ORDER_DETAILS}/${orderId}?consumer_key=${process.env.CONSUMER_KEY}&consumer_secret=${process.env.CONSUMER_SECRET}`
    );

    const orderData = response.data;
    try {
      const paymentIntent = await stripeInstance.paymentIntents.create({
        amount: orderData.total * 100,
        currency: "usd",
      });

      return NextResponse.json({
        paymentIntent: paymentIntent,
        clientSecret: paymentIntent.client_secret,
        orderData: orderData,
      });
    } catch (error) {
      return NextResponse.json({ error: error.message, data: req.body });
    }
  } else {
    return NextResponse.json(process.env.STRIPE_SECRET_KEY); // Method not allowed
  }
}
