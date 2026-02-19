import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,

      trim: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
 
    },

    description: {
      type: String,
    },

    images: [String], // Array of image URLs from S3

    price: {
      type: Number,

    },

    discountPrice: {
      type: Number,
    },

    quantityAvailable: {
      type: Number,
      default: 0,
    },

    // 👕 Clothing-specific fields
    color: {
      type: [String], // multiple colors e.g. ["red", "blue"]
    },

sizes: [
  {
    label: {
      type: String,
      enum: ["XXS", "XS", "S", "M", "L", "XL", "XXL"],
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
  },
],

    material: {
      type: String, // e.g., Cotton, Polyester, Blend
    },

    type: {
      type: String, // e.g., T-Shirt, Hoodie, Cap, Jacket
    },

    tag: {
      type: [String], // e.g., ["summer", "unisex", "sports"]
    },

decorationMethods: [
  {
    name: {
      type: String,
      enum: ["Printed", "Embroidered", "Debossed"],

    },
    note: {
      type: String, // e.g. "No Minimum"
    },
  },
],

    weight: {
      type: String,
      enum: ["Lightweight", "Mediumweight", "Heavyweight"],
    },

    minimumQuantity: {
      type: Number, // Minimum order quantity
      default: 1,
    },

brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Brand",   // ✅ must match the model name
  },

    features: {
      type: [String], // e.g., ["Waterproof", "Breathable", "Eco-friendly"]
    },

    closureType: {
      type: String,
      enum: ["No Closure", "Zipper", "Buttons", "Hooks", "Velcro"],
    },

    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        rating: {
          type: Number,
          min: 1,
          max: 5,
        },
        comment: String,
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    isBestSeller: { type: Boolean, default: false },
    isTrending: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },

    productDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
