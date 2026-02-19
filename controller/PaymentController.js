import axios from "axios";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// POST /api/payment/create-checkout-session
// export const createCheckoutSession = async (req, res) => {
//   try {
//     const { cartItems } = req.body;

//     // Convert cart items to Stripe line items
//     const line_items = cartItems.map((item) => ({
//       price_data: {
//         currency: "usd",
//         product_data: {
//           name: item.name,
//           images: item.images || [],
//         },
//         unit_amount: Math.round(item.price * 100), // in cents
//       },
//       quantity: item.quantity,
//     }));

//     // Create Checkout session
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card", "klarna"],
//       line_items,
//       mode: "payment",
//       success_url: `${process.env.FRONTEND_URL}/order-success?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${process.env.FRONTEND_URL}/order-failed`,
//     });

//     res.status(200).json({ id: session.id, url: session.url });
//   } catch (err) {
//     console.error("Stripe Error:", err.message);
//     res.status(500).json({ error: err.message });
//   }
// };
// export const createCheckoutSession = async (req, res) => {
//   try {
//     const { cartItems, paymentMethod } = req.body;

//     const line_items = cartItems.map((item) => ({
//       price_data: {
//         // currency: "usd",
//         currency: "eur",
//         product_data: {
//           name: item.name,
//           images: item.images || [],
//         },
//         unit_amount: Math.round(item.price * 100),
//       },
//       quantity: item.quantity,
//     }));

//     // Use only the selected payment method
//     const payment_method_types =
//       paymentMethod === "klarna" ? ["klarna"] : ["card"];

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types,
//       line_items,
//       mode: "payment",
//       success_url: `${process.env.FRONTEND_URL}/order-success?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${process.env.FRONTEND_URL}/order-failed`,
//     });

//     res.status(200).json({ id: session.id, url: session.url });
//   } catch (err) {
//     console.error("Stripe Error:", err.message);
//     res.status(500).json({ error: err.message });
//   }
// };

// export const createCheckoutSession = async (req, res) => {
//   try {
//     const { cartItems, paymentMethod } = req.body;

//     const line_items = cartItems.map((item) => {
//       // Use discountPrice if available, else price
//       const price = item.product?.discountPrice ?? item.product?.price ?? 0;

//       return {
//         price_data: {
//           currency: "usd", // or "eur" as needed
//           product_data: {
//             name: item.product?.name || "Unnamed Product",
//             images: item.product?.image ? [item.product.image] : [],
//           },
//           unit_amount: Math.round(price * 100), // Stripe expects cents
//         },
//         quantity: item.quantity || 1,
//       };
//     });

//     const payment_method_types =
//       paymentMethod === "klarna" ? ["klarna"] : ["card"];

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types,
//       line_items,
//       mode: "payment",
//       success_url: `${process.env.FRONTEND_URL}/order-success?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${process.env.FRONTEND_URL}/order-failed`,
//     });

//     res.status(200).json({ id: session.id, url: session.url });
//   } catch (err) {
//     console.error("Stripe Error:", err.message);
//     res.status(500).json({ error: err.message });
//   }
// };
export const createCheckoutSession = async (req, res) => {
  try {
    const { cartItems, paymentMethod, shippingInfo } = req.body;

    if (!shippingInfo) {
      return res.status(400).json({ error: "Shipping info is required" });
    }

    const line_items = cartItems.map((item) => {
      const price = item.product?.discountPrice ?? item.product?.price ?? 0;

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.product?.name || "Unnamed Product",
            images: item.product?.image ? [item.product.image] : [],
          },
          unit_amount: Math.round(price * 100),
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

      // ⭐ Stripe requires address to calculate shipping
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "GB", "AU", "NG", "DE", "FR"],
      },

      // ⭐ Dynamic shipping (your logic)
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: Math.round(shippingInfo.price * 100),
              currency: "usd",
            },
            display_name: shippingInfo.method,
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: parseInt(shippingInfo.deliveryTime.split(" ")[0]),
              },
              maximum: {
                unit: "business_day",
                value: parseInt(shippingInfo.deliveryTime.split(" ")[2]),
              },
            },
          },
        },
      ],

      success_url: `${process.env.FRONTEND_URL}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/order-failed`,
    });

    res.status(200).json({ id: session.id, url: session.url });
  } catch (err) {
    console.error("Stripe Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Initialize Paystack transaction
export const initializePayment = async (req, res) => {
  try {
    const { email, amount } = req.body;

    if (!email || !amount) {
      return res.status(400).json({ message: "Email and amount are required" });
    }

    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: amount * 100, // Paystack expects amount in kobo/cents
      },
      {
        headers: {
          Authorization: `Bearer sk_test_79242b93426b598a9b3e456fb0a03ac56d114e47`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json(response.data); // Send access_code and authorization_url to frontend
  } catch (error) {
    console.error("Paystack initialize error:", error.response?.data || error.message);
    res.status(500).json({ message: "Payment initialization failed" });
  }
};
