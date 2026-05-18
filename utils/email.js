// import nodemailer from "nodemailer";

// // const transporter = nodemailer.createTransport({
// //   service: "gmail",
// //   auth: {
// //     user: process.env.EMAIL_USER,      // your gmail e.g. hello@africanmamaput.co.uk
// //     pass: process.env.EMAIL_PASS,      // gmail app password (not your login password)
// //   },
// // });
// const transporter = nodemailer.createTransport({
//   host: "mail.africanmamaput.co.uk",  // your hosting SMTP server
//   port: 465,
//   secure: true,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// export const sendOrderEmails = async (order) => {
//   const itemsHtml = order.items.map(item => `
//     <tr>
//       <td style="padding:8px;border-bottom:1px solid #eee">${item.name}</td>
//       <td style="padding:8px;border-bottom:1px solid #eee">x${item.quantity}</td>
//       <td style="padding:8px;border-bottom:1px solid #eee">£${(item.price * item.quantity).toFixed(2)}</td>
//     </tr>
//   `).join("");

//   // ── Email to CUSTOMER ──────────────────────────────
//   await transporter.sendMail({
//     from: `"African Mama Put" <${process.env.EMAIL_USER}>`,
//     to: order.email,
//     subject: "Order Confirmed – African Mama Put 🍛",
//     html: `
//       <h2>Thank you, ${order.billingAddress.firstName}!</h2>
//       <p>Your order has been confirmed. We're preparing your African feast with love!</p>
//       <table style="width:100%;border-collapse:collapse">
//         <thead>
//           <tr style="background:#f5f5f5">
//             <th style="padding:8px;text-align:left">Item</th>
//             <th style="padding:8px;text-align:left">Qty</th>
//             <th style="padding:8px;text-align:left">Price</th>
//           </tr>
//         </thead>
//         <tbody>${itemsHtml}</tbody>
//       </table>
//       <h3 style="margin-top:16px">Total: £${order.total.toFixed(2)}</h3>
//       <p>Delivering to: ${order.billingAddress.address1}, ${order.billingAddress.city}</p>
//       <p>Need help? Email us at hello@africanmamaput.co.uk</p>
//     `,
//   });

//   // ── Email to YOU (owner) ───────────────────────────
//   await transporter.sendMail({
//     from: `"African Mama Put Orders" <${process.env.EMAIL_USER}>`,
//     to: process.env.OWNER_EMAIL,       // e.g. your personal email
//     subject: `🛒 New Order from ${order.billingAddress.firstName} ${order.billingAddress.lastName}`,
//     html: `
//       <h2>New Order Received!</h2>
//       <p><strong>Customer:</strong> ${order.billingAddress.firstName} ${order.billingAddress.lastName}</p>
//       <p><strong>Email:</strong> ${order.email}</p>
//       <p><strong>Phone:</strong> ${order.phone}</p>
//       <p><strong>Address:</strong> ${order.billingAddress.address1}, ${order.billingAddress.city}, ${order.billingAddress.state} ${order.billingAddress.postcode}</p>
//       <table style="width:100%;border-collapse:collapse">
//         <thead>
//           <tr style="background:#f5f5f5">
//             <th style="padding:8px;text-align:left">Item</th>
//             <th style="padding:8px;text-align:left">Qty</th>
//             <th style="padding:8px;text-align:left">Price</th>
//           </tr>
//         </thead>
//         <tbody>${itemsHtml}</tbody>
//       </table>
//       <h3>Total: £${order.total.toFixed(2)}</h3>
//     `,
//   });
// };
import dotenv from "dotenv";
dotenv.config(); // ✅ MUST be first line before anything else

import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendOrderEmails = async (order) => {
  const itemsHtml = order.items.map(item => `
    <tr>
      <td style="padding:8px;border-bottom:1px solid #eee">${item.name}</td>
      <td style="padding:8px;border-bottom:1px solid #eee">x${item.quantity}</td>
      <td style="padding:8px;border-bottom:1px solid #eee">£${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `).join("");

  // Email to CUSTOMER
  await sgMail.send({
    to: order.email,
    from: "africanmamaput@outlook.com", // must be verified in SendGrid
    subject: "Order Confirmed – African Mama Put 🍛",
    html: `
      <h2>Thank you, ${order.billingAddress.firstName}!</h2>
      <p>Your order has been confirmed. We're preparing your African feast with love!</p>
      <table style="width:100%;border-collapse:collapse">
        <thead>
          <tr style="background:#f5f5f5">
            <th style="padding:8px;text-align:left">Item</th>
            <th style="padding:8px;text-align:left">Qty</th>
            <th style="padding:8px;text-align:left">Price</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
      </table>
      <h3>Total: £${order.total.toFixed(2)}</h3>
      <p>Delivering to: ${order.billingAddress.address1}, ${order.billingAddress.city}</p>
    `,
  });

  // Email to YOU (owner)
  await sgMail.send({
    to: "africanmamaput@outlook.com",
    from: "africanmamaput@outlook.com",
    subject: `🛒 New Order from ${order.billingAddress.firstName} ${order.billingAddress.lastName}`,
    html: `
      <h2>New Order!</h2>
      <p><strong>Customer:</strong> ${order.billingAddress.firstName} ${order.billingAddress.lastName}</p>
      <p><strong>Email:</strong> ${order.email}</p>
      <p><strong>Phone:</strong> ${order.phone}</p>
      <p><strong>Address:</strong> ${order.billingAddress.address1}, ${order.billingAddress.city}, ${order.billingAddress.state}</p>
      <table style="width:100%;border-collapse:collapse">
        <thead>
          <tr style="background:#f5f5f5">
            <th style="padding:8px;text-align:left">Item</th>
            <th style="padding:8px;text-align:left">Qty</th>
            <th style="padding:8px;text-align:left">Price</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
      </table>
      <h3>Total: £${order.total.toFixed(2)}</h3>
    `,
  });

  console.log("✅ Order emails sent successfully");
};