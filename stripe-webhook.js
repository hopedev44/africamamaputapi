import Stripe from "stripe";
import connectDB from "./config/db2.js";
import Order from "./models/orderModel.js";
import { sendOrderEmails } from "./utils/email.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ← This is the critical Vercel config
export const config = {
  api: {
    bodyParser: false,
  },
};

function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  await connectDB();

  const sig = req.headers["stripe-signature"];
  const rawBody = await getRawBody(req);

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    console.log("✅ Webhook verified:", event.type);
  } catch (err) {
    console.error("❌ Webhook signature failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId = session.metadata?.orderId;

    if (!orderId) {
      console.error("❌ No orderId in metadata");
      return res.json({ received: true });
    }

    try {
      const order = await Order.findById(orderId);

      if (!order) {
        console.error("❌ Order not found:", orderId);
        return res.json({ received: true });
      }

      order.paymentStatus = "paid";
      order.status = "confirmed";
      order.stripePaymentIntentId = session.payment_intent;
      await order.save();
      console.log("✅ Order saved");

      await sendOrderEmails(order);
      console.log("✅ Emails sent");

    } catch (err) {
      console.error("❌ Error:", err.message);
    }
  }

  res.json({ received: true });
}