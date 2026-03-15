import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  quantity: Number,
  litres: Number,
  protein: String,
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  email: String,
  phone: String,
  billingAddress: {
    firstName: String,
    lastName: String,
    address1: String,
    address2: String,
    city: String,
    state: String,
    postcode: String,
  },
  items: [orderItemSchema],
  subtotal: Number,
  total: Number,
  currency: { type: String, default: "gbp" },
  status: {
    type: String,
    enum: ["pending", "paid", "processing", "delivered", "cancelled"],
    default: "pending",
  },
  paymentStatus: { type: String, default: "unpaid" },
  stripeSessionId: String,
  stripePaymentIntentId: String,
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);