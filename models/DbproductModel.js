import mongoose from "mongoose";
import slugify from "slugify";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true, trim: true },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DbCategory",
    },

    description: String,
    images: [String],

    // 💰 Pricing
    originalPrice: { type: Number, default: null }, // old/before price (optional, shown crossed out)
    price: { type: Number, required: true },         // current price customer pays

    // 🍔 Food-specific
    weight: { type: String },
    unit: {
      type: String,
      enum: ["kg", "g", "litre", "ml", "pack", "piece", "dozen", "carton"],
      default: "kg",
    },
    quantityAvailable: { type: Number, default: 0 },
    minimumQuantity: { type: Number, default: 1 },
    expiryInfo: { type: String },
    storageInfo: { type: String },
    ingredients: [String],
    allergens: [String],
    tag: [String],
    features: [String],

    reviews: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "DbUser" },
        rating: { type: Number, min: 1, max: 5 },
        comment: String,
        date: { type: Date, default: Date.now },
      },
    ],

    isBestSeller: { type: Boolean, default: false },
    isTrending: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    isSpecial: { type: Boolean, default: false },
    productDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

productSchema.pre("save", function (next) {
  if (this.isModified("name") || !this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

export default mongoose.models.DbProduct ||
  mongoose.model("DbProduct", productSchema);