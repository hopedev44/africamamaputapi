// // controllers/webhookController.js
// import Stripe from "stripe";
// import nodemailer from "nodemailer";
// import Order from "../models/orderModel.js";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// export const stripeWebhook = async (req, res) => {
//   const sig = req.headers["stripe-signature"];

//   try {
//     const event = stripe.webhooks.constructEvent(
//       req.body,
//       sig,
//       process.env.STRIPE_WEBHOOK_SECRET
//     );

//     if (event.type === "checkout.session.completed") {
//       const session = event.data.object;
//       const orderId = session.metadata?.orderId;

//       console.log("✅ Payment completed for:", session.customer_email);

//       // ── Mark order as paid ──────────────────────────────────────────
//       if (orderId) {
//         await Order.findByIdAndUpdate(orderId, {
//           paymentStatus: "paid",
//           status: "processing",
//           stripePaymentIntentId: session.payment_intent,
//         });
//         console.log("✅ Order marked as paid:", orderId);
//       } else {
//         console.warn("⚠️ No orderId in session metadata");
//       }

//       // ── Send confirmation email ─────────────────────────────────────
//       const customerEmail = session.customer_email || session.customer_details?.email;

//       if (customerEmail) {
//         const transporter = nodemailer.createTransport({
//           service: "gmail",
//           auth: {
//             user: process.env.EMAIL_USER,
//             pass: process.env.EMAIL_PASS,
//           },
//         });

//         // Fetch order details for the email
//         const order = orderId ? await Order.findById(orderId) : null;
//         const itemsHtml = order?.items?.map(item => `
//           <tr>
//             <td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${item.name}</td>
//             <td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${item.quantity}</td>
//             ${item.litres ? `<td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${item.litres}L</td>` : `<td style="padding: 8px 12px; border-bottom: 1px solid #eee;">—</td>`}
//             ${item.protein ? `<td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${item.protein}</td>` : `<td style="padding: 8px 12px; border-bottom: 1px solid #eee;">—</td>`}
//             <td style="padding: 8px 12px; border-bottom: 1px solid #eee;">£${Number(item.price * item.quantity).toLocaleString()}</td>
//           </tr>
//         `).join("") || "";

//         await transporter.sendMail({
//           from: `"African Mama Put" <${process.env.EMAIL_USER}>`,
//           to: customerEmail,
//           subject: "Order Confirmation — African Mama Put",
//           html: `
//             <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #333;">
//               <div style="background: #1a1a1a; padding: 30px; text-align: center;">
//                 <h1 style="color: #fff; margin: 0; font-size: 24px; letter-spacing: 0.1em;">
//                   AFRICAN MAMA PUT
//                 </h1>
//               </div>

//               <div style="padding: 40px 30px;">
//                 <h2 style="color: #1a1a1a; font-size: 20px;">Order Confirmed!</h2>
//                 <p style="color: #666; line-height: 1.6;">
//                   Thank you${order?.billingAddress?.firstName ? ", " + order.billingAddress.firstName : ""}!
//                   Your payment was successful and we're preparing your African feast with love.
//                 </p>

//                 <div style="background: #f9f9f9; padding: 16px 20px; margin: 24px 0; border-left: 3px solid #c8a96e;">
//                   <p style="margin: 0; font-size: 13px; color: #999; letter-spacing: 0.08em;">ORDER ID</p>
//                   <p style="margin: 4px 0 0; font-size: 14px; color: #333; font-family: monospace;">
//                     ${orderId || session.id}
//                   </p>
//                 </div>

//                 ${order?.items?.length ? `
//                 <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
//                   <thead>
//                     <tr style="background: #f0f0f0;">
//                       <th style="padding: 10px 12px; text-align: left; font-size: 12px; letter-spacing: 0.06em;">ITEM</th>
//                       <th style="padding: 10px 12px; text-align: left; font-size: 12px; letter-spacing: 0.06em;">QTY</th>
//                       <th style="padding: 10px 12px; text-align: left; font-size: 12px; letter-spacing: 0.06em;">VOLUME</th>
//                       <th style="padding: 10px 12px; text-align: left; font-size: 12px; letter-spacing: 0.06em;">PROTEIN</th>
//                       <th style="padding: 10px 12px; text-align: left; font-size: 12px; letter-spacing: 0.06em;">SUBTOTAL</th>
//                     </tr>
//                   </thead>
//                   <tbody>${itemsHtml}</tbody>
//                 </table>

//                 <div style="text-align: right; padding: 12px 0; border-top: 2px solid #1a1a1a;">
//                   <strong style="font-size: 16px;">
//                     Total: £${Number(order.total).toLocaleString()}
//                   </strong>
//                 </div>
//                 ` : ""}

//                 ${order?.billingAddress ? `
//                 <div style="margin-top: 24px; padding: 16px 20px; border: 1px solid #eee;">
//                   <p style="margin: 0 0 8px; font-size: 12px; color: #999; letter-spacing: 0.08em;">DELIVERING TO</p>
//                   <p style="margin: 0; font-size: 14px; line-height: 1.8; color: #333;">
//                     ${order.billingAddress.firstName} ${order.billingAddress.lastName}<br/>
//                     ${order.billingAddress.address1}${order.billingAddress.address2 ? ", " + order.billingAddress.address2 : ""}<br/>
//                     ${order.billingAddress.city}, ${order.billingAddress.state}${order.billingAddress.postcode ? " " + order.billingAddress.postcode : ""}
//                   </p>
//                 </div>
//                 ` : ""}

//                 <p style="margin-top: 32px; color: #666; font-size: 13px; line-height: 1.6;">
//                   If you have any questions about your order, reply to this email or contact us directly.
//                 </p>
//               </div>

//               <div style="background: #f5f5f5; padding: 20px 30px; text-align: center; font-size: 12px; color: #999;">
//                 © African Mama Put · Liverpool, United Kingdom
//               </div>
//             </div>
//           `,
//         });

//         console.log("📧 Confirmation email sent to:", customerEmail);
//       }
//     }

//     res.json({ received: true });
//   } catch (err) {
//     console.error("❌ Webhook error:", err.message);
//     res.status(400).send(`Webhook Error: ${err.message}`);
//   }
// };

// import Order from "../models/orderModel.js";
// import Stripe from "stripe";
// import { sendOrderEmails } from "../utils/email.js";
// import dotenv from "dotenv";
// dotenv.config(); // ✅ add this

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// export const stripeWebhook = async (req, res) => {
//   const sig = req.headers["stripe-signature"];
//   let event;

//   try {
//     event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
//   } catch (err) {
//     return res.status(400).send(`Webhook Error: ${err.message}`);
//   }

// if (event.type === "checkout.session.completed") {
//     const session = event.data.object;
//     const orderId = session.metadata.orderId;
    
//     console.log("✅ Webhook received for order:", orderId);

//     try {
//       const order = await Order.findById(orderId);
//       if (order) {
//         order.paymentStatus = "paid";
//         order.status = "confirmed";
//         order.stripePaymentIntentId = session.payment_intent;
//         await order.save();

//         console.log("📧 Sending emails to:", order.email);
//         await sendOrderEmails(order);
//         console.log("✅ Emails sent!");
//       } else {
//         console.log("❌ Order not found for ID:", orderId);
//       }
//     } catch (err) {
//       console.error("❌ Webhook handler error:", err.message);
//       console.error(err); // full error
//     }
//   }

//   res.json({ received: true });
// };

// import Order from "../models/orderModel.js";
// import Stripe from "stripe";
// import dotenv from "dotenv";
// import { sendOrderEmails } from "../utils/email.js";

// dotenv.config();

// console.log("🔑 Stripe key loaded:", process.env.STRIPE_SECRET_KEY ? "YES" : "NO");
// console.log("🔑 Webhook secret loaded:", process.env.STRIPE_WEBHOOK_SECRET ? "YES" : "NO");
// console.log("🔑 SendGrid key loaded:", process.env.SENDGRID_API_KEY ? "YES" : "NO");

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// export const stripeWebhook = async (req, res) => {
//   console.log("📨 Webhook endpoint HIT!");
//   console.log("Headers:", req.headers["stripe-signature"] ? "Signature present" : "NO SIGNATURE");
  
//   const sig = req.headers["stripe-signature"];
//   let event;

//   try {
//     event = stripe.webhooks.constructEvent(
//       req.body, 
//       sig, 
//       process.env.STRIPE_WEBHOOK_SECRET
//     );
//     console.log("✅ Event verified:", event.type);
//   } catch (err) {
//     console.error("❌ Webhook signature failed:", err.message);
//     return res.status(400).send(`Webhook Error: ${err.message}`);
//   }

//   if (event.type === "checkout.session.completed") {
//     const session = event.data.object;
//     const orderId = session.metadata?.orderId;
    
//     console.log("✅ checkout.session.completed received!");
//     console.log("📦 Order ID from metadata:", orderId);

//     try {
//       const order = await Order.findById(orderId);
//       console.log("📋 Order found:", order ? "YES" : "NO");
      
//       if (order) {
//         order.paymentStatus = "paid";
//         order.status = "confirmed";
//         order.stripePaymentIntentId = session.payment_intent;
//         await order.save();
//         console.log("💾 Order saved!");
//         console.log("📧 Sending email to:", order.email);

//         await sendOrderEmails(order);
//         console.log("✅ Emails sent successfully!");
//       } else {
//         console.log("❌ No order found for ID:", orderId);
//       }
//     } catch (err) {
//       console.error("❌ Error:", err.message);
//       console.error(err);
//     }
//   } else {
//     console.log("ℹ️ Event type ignored:", event.type);
//   }

//   res.json({ received: true });
// };

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