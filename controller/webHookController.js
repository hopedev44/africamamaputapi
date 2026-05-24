
import Order from "../models/orderModel.js";
import Stripe from "stripe";
import dotenv from "dotenv";
import { sendOrderEmails } from "../utils/email.js";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhook = async (req, res) => {
  const timestamp = new Date().toISOString();
  console.log(`\n${"=".repeat(60)}`);
  console.log(`[${timestamp}] 🔔 WEBHOOK HIT`);
  console.log(`[${timestamp}] Method: ${req.method}`);
  console.log(`[${timestamp}] URL: ${req.originalUrl}`);
  console.log(`[${timestamp}] Stripe-Signature header: ${req.headers["stripe-signature"] ? "PRESENT ✅" : "MISSING ❌"}`);
  console.log(`[${timestamp}] Body type: ${typeof req.body}`);
  console.log(`[${timestamp}] Body is Buffer: ${Buffer.isBuffer(req.body)}`);
  console.log(`[${timestamp}] STRIPE_SECRET_KEY: ${process.env.STRIPE_SECRET_KEY ? "SET ✅" : "MISSING ❌"}`);
  console.log(`[${timestamp}] STRIPE_WEBHOOK_SECRET: ${process.env.STRIPE_WEBHOOK_SECRET ? "SET ✅" : "MISSING ❌"}`);
  console.log(`[${timestamp}] SENDGRID_API_KEY: ${process.env.SENDGRID_API_KEY ? "SET ✅" : "MISSING ❌"}`);

  const sig = req.headers["stripe-signature"];

  if (!sig) {
    console.error(`[${timestamp}] ❌ No stripe-signature header — rejecting`);
    return res.status(400).send("No stripe-signature header");
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error(`[${timestamp}] ❌ STRIPE_WEBHOOK_SECRET is not set in environment!`);
    return res.status(500).send("Webhook secret not configured");
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    console.log(`[${timestamp}] ✅ Signature verified. Event type: ${event.type}`);
    console.log(`[${timestamp}] Event ID: ${event.id}`);
  } catch (err) {
    console.error(`[${timestamp}] ❌ Signature verification FAILED: ${err.message}`);
    console.error(`[${timestamp}] This usually means wrong STRIPE_WEBHOOK_SECRET or body was parsed before reaching here`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    console.log(`[${timestamp}] 💳 checkout.session.completed`);
    console.log(`[${timestamp}] Session ID: ${session.id}`);
    console.log(`[${timestamp}] Payment status: ${session.payment_status}`);
    console.log(`[${timestamp}] Customer email from session: ${session.customer_details?.email || "none"}`);
    console.log(`[${timestamp}] Metadata:`, JSON.stringify(session.metadata));

    const orderId = session.metadata?.orderId;
    if (!orderId) {
      console.error(`[${timestamp}] ❌ No orderId in metadata! Cannot find order.`);
      return res.json({ received: true });
    }

    console.log(`[${timestamp}] 🔍 Looking up order: ${orderId}`);

    try {
      const order = await Order.findById(orderId);

      if (!order) {
        console.error(`[${timestamp}] ❌ Order NOT found in DB for ID: ${orderId}`);
        return res.json({ received: true });
      }

      console.log(`[${timestamp}] ✅ Order found. Current status: ${order.status}, paymentStatus: ${order.paymentStatus}`);
      console.log(`[${timestamp}] Order email: "${order.email}"`);
      console.log(`[${timestamp}] Order has ${order.items?.length || 0} item(s)`);

      if (!order.email) {
        console.error(`[${timestamp}] ❌ Order has no email address! Email will fail.`);
      }

      order.paymentStatus = "paid";
      order.status = "confirmed";
      order.stripePaymentIntentId = session.payment_intent;
      await order.save();
      console.log(`[${timestamp}] ✅ Order updated and saved.`);

      console.log(`[${timestamp}] 📧 Attempting to send emails to: ${order.email}`);
      await sendOrderEmails(order);
      console.log(`[${timestamp}] ✅ sendOrderEmails completed.`);

    } catch (err) {
      console.error(`[${timestamp}] ❌ Error processing order:`, err.message);
      console.error(err.stack);
    }

  } else {
    console.log(`[${timestamp}] ℹ️ Ignored event type: ${event.type}`);
  }

  res.json({ received: true });
};