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
      `https://mcdfynew.itrakmedia.com/wp-json/wc/v3/orders/${orderId}?consumer_key=ck_7804b87d10f2dd1fac11683b48dfcbd874db1e57&consumer_secret=cs_01befbd49bfb3217cab554e5c1f50d46038155b9`
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
