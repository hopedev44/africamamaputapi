import axios from "axios";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);




export const createCheckoutSession = async (req, res) => {
  try {
    const { cartItems, paymentMethod } = req.body;

    const line_items = cartItems.map((item) => {
      // Use discountPrice if available, else price
      const price = item.product?.discountPrice ?? item.product?.price ?? 0;

      return {
        price_data: {
       currency: "gbp", 
          product_data: {
            name: item.product?.name || "Unnamed Product",
            images: item.product?.image ? [item.product.image] : [],
          },
          unit_amount: Math.round(price * 100), // Stripe expects cents
        },
        quantity: item.quantity || 1,
      };
    });

    const payment_method_types =
      paymentMethod === "klarna" ? ["klarna"] : ["card"];

    const session = await stripe.checkout.sessions.create({
      payment_method_types,
      line_items,
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/order-failed`,
    });

    res.status(200).json({ id: session.id, url: session.url });
  } catch (err) {
    console.error("Stripe Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};