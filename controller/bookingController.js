import sgMail from "@sendgrid/mail";
import Booking from "../models/Booking.js";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const createBooking = async (req, res) => {
  const { name, email, phone, eventType, guests, date, location, notes } = req.body;

  if (!name || !email || !phone || !eventType || !guests || !date) {
    return res.status(400).json({ message: "Please fill in all required fields." });
  }

  try {
    // 1. Save to MongoDB
    const booking = await Booking.create({
      name, email, phone, eventType,
      guests: Number(guests), date: new Date(date),
      location, notes,
    });

    // 2. Confirmation email → client
    try {
      await sgMail.send({
        to: email,
        from: process.env.FROM_EMAIL,
        subject: "Thank you for your booking — African Mamaput Catering",
        html: `
          <div style="font-family: Georgia, serif; max-width: 560px; margin: auto; color: #222;">
            <h2 style="font-weight: 400; border-bottom: 1px solid #ddd; padding-bottom: 12px;">
              Booking Received
            </h2>
            <p>Dear <strong>${name}</strong>,</p>
            <p>
              Thank you for choosing <strong>African Mamaput</strong> to cater your event.
              We have received your request and our team will be in touch within 24 hours
              to confirm all the details.
            </p>
            <table style="width:100%; border-collapse:collapse; margin: 24px 0; font-size:14px;">
              <tr><td style="padding:8px 0; color:#888; width:40%;">Event Type</td><td>${eventType}</td></tr>
              <tr><td style="padding:8px 0; color:#888;">Number of Guests</td><td>${guests}</td></tr>
              <tr><td style="padding:8px 0; color:#888;">Date</td><td>${new Date(date).toDateString()}</td></tr>
              ${location ? `<tr><td style="padding:8px 0; color:#888;">Venue</td><td>${location}</td></tr>` : ""}
              ${notes ? `<tr><td style="padding:8px 0; color:#888;">Notes</td><td>${notes}</td></tr>` : ""}
            </table>
            <p>If you have any urgent questions, call us on <strong>+44(0) 787 689 6986</strong>.</p>
            <p style="margin-top:32px; color:#888; font-size:13px;">
              Warm regards,<br/>The African Mamaput Team
            </p>
          </div>
        `,
      });
      console.log("✅ Client confirmation email sent to:", email);
    } catch (emailErr) {
      console.error("❌ Client email error:", JSON.stringify(emailErr?.response?.body?.errors, null, 2));
    }

    // 3. Internal notification email → your team
    try {
      await sgMail.send({
        to: process.env.ADMIN_EMAIL,
        from: process.env.FROM_EMAIL,
        subject: `New Catering Booking — ${eventType} for ${guests} guests`,
        html: `
          <h3>New Booking Request</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Event:</strong> ${eventType}</p>
          <p><strong>Guests:</strong> ${guests}</p>
          <p><strong>Date:</strong> ${new Date(date).toDateString()}</p>
          <p><strong>Venue:</strong> ${location || "Not specified"}</p>
          <p><strong>Notes:</strong> ${notes || "None"}</p>
        `,
      });
      console.log("✅ Admin notification email sent to:", process.env.ADMIN_EMAIL);
    } catch (emailErr) {
      console.error("❌ Admin email error:", JSON.stringify(emailErr?.response?.body?.errors, null, 2));
    }

    return res.status(201).json({ message: "Booking created successfully.", bookingId: booking._id });

  } catch (err) {
    console.error("❌ Booking error:", err.message);
    return res.status(500).json({ message: "Server error. Please try again." });
  }
};
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};