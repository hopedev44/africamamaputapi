import axios from "axios";
import Stripe from "stripe";
import dotenv from "dotenv";
import Order from "../models/orderModel.js";
dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);




export const createCheckoutSession = async (req, res) => {
  try {
    const { cartItems, paymentMethod, billing } = req.body;

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
// Save a pending order first
    const order = new Order({
      email: billing?.email || "",
      phone: billing?.phone || "",
      billingAddress: {
        firstName: billing?.firstName || "",
        lastName: billing?.lastName || "",
        address1: billing?.address1 || "",
        address2: billing?.address2 || "",
        city: billing?.city || "",
        state: billing?.state || "",
        postcode: billing?.postcode || "",
      },
      items: cartItems.map((item) => ({
        name: item.product.name,
        price: item.product.price,
        image: item.product.image || "",
        quantity: item.quantity,
        litres: item.litres || null,
        protein: item.protein || null,
      })),
      subtotal: cartItems.reduce((s, i) => s + i.product.price * i.quantity, 0),
      total: cartItems.reduce((s, i) => s + i.product.price * i.quantity, 0),
      status: "pending",
      paymentStatus: "unpaid",
    });

    await order.save();
    const session = await stripe.checkout.sessions.create({
      payment_method_types,
      line_items,
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/order-failed`,
          metadata: {
        orderId: order._id.toString(),
      },
    });
 order.stripeSessionId = session.id;
    await order.save();
    res.status(200).json({ id: session.id, url: session.url });
  } catch (err) {
    console.error("Stripe Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};