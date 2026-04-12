import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true },
  email:     { type: String, required: true, lowercase: true, trim: true },
  phone:     { type: String, required: true },
  eventType: { type: String, required: true },
  guests:    { type: Number, required: true, min: 1 },
  date:      { type: Date, required: true },
  location:  { type: String, default: "" },
  notes:     { type: String, default: "" },
  status:    { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);