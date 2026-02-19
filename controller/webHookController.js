// controllers/webhookController.js
import Stripe from "stripe";
import nodemailer from "nodemailer";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    // When payment is successful
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      console.log("✅ Payment completed for:", session.customer_email);

      // Send confirmation email
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: `"Your Store" <${process.env.EMAIL_USER}>`,
        to: session.customer_email,
        subject: "Order Confirmation",
        html: `
          <h2>Thank you for your order!</h2>
          <p>Your payment was successful.</p>
          <p>Order ID: <b>${session.id}</b></p>
          <p>We’ll start processing your order right away.</p>
        `,
      });

      console.log("📧 Confirmation email sent to:", session.customer_email);
    }

    res.json({ received: true });
  } catch (err) {
    console.error("❌ Webhook error:", err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
};
