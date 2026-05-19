import Stripe from "stripe";
import dotenv from "dotenv";
import connectDB from "../config/db2.js";
import Order from "../models/orderModel.js";
import { sendOrderEmails } from "../utils/email.js";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const config = {
  api: {
    bodyParser: false, // ✅ CRITICAL — must be false for Stripe webhooks
  },
};

export default async function handler(req, res) {
  console.log("📨 Webhook HIT!", req.method);
  
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  await connectDB();

  const sig = req.headers["stripe-signature"];
  
  // Get raw body
  const rawBody = await getRawBody(req);
  
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    console.log("✅ Event:", event.type);
  } catch (err) {
    console.error("❌ Webhook Error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId = session.metadata?.orderId;
    console.log("📦 Order ID:", orderId);

    try {
      const order = await Order.findById(orderId);
      if (order) {
        order.paymentStatus = "paid";
        order.status = "confirmed";
        order.stripePaymentIntentId = session.payment_intent;
        await order.save();
        console.log("💾 Order updated!");
        await sendOrderEmails(order);
        console.log("✅ Emails sent!");
      } else {
        console.log("❌ Order not found:", orderId);
      }
    } catch (err) {
      console.error("❌ Error:", err.message);
    }
  }

  res.json({ received: true });
}

// Helper to get raw body on Vercel
function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}