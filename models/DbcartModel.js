import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    cartId: {
      type: String,
      required: true,
      unique: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      // unique: true,
      // sparse: true, // allows many guest carts
      // index: true,
    },

    items: [
      {
        product: {
          type: Object,
          required: true,
        },
        quantity: { type: Number, default: 1 },
        color: { type: String, default: "" },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("DbCart", cartSchema);
