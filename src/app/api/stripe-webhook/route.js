// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
// import { NextResponse } from 'next/server';


// const endpointSecret = 'whsec_dde633b6a958b90151b36b5ca869e8d2ea2435691448410c97046213b1e28358';

// export default async function POST(request) {
//   if (request.method === 'POST') {
//     const red = await request.json()
//     const sig = req.headers['stripe-signature'];

//     let event;

//     try {
//       event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
//     } catch (err) {
//       res.status(400).send(`Webhook Error: ${err.message}`);
//       return;
//     }

//     // Handle the event
//     switch (event.type) {
//       case 'checkout.session.async_payment_succeeded':
//         const checkoutSessionAsyncPaymentSucceeded = event.data.object;
//         console.log(checkoutSessionAsyncPaymentSucceeded)
//         // Then define and call a function to handle the event checkout.session.async_payment_succeeded
//         break;
//       case 'checkout.session.completed':
//         const checkoutSessionCompleted = event.data.object;
//         console.log(checkoutSessionCompleted)

//         // Then define and call a function to handle the event checkout.session.completed
//         break;
//       // ... handle other event types
//       default:
//         console.log(`Unhandled event type ${event.type}`);
//     }

//     // Return a 200 response to acknowledge receipt of the event
//     return NextResponse.ok('Webhook received successfully');
//   } else {
//   }
// }
