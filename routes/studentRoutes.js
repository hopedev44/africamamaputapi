// import express from "express";
// import asyncHandler from "express-async-handler";
// import Sale from "../models/saleModel.js";
// import capitalize from "../config/capitalize.js";
// import NepaliDate from "nepali-date-converter";
// import SaleFees from "../models/saleFeesModel.js";
// import protect from "../middleware/authMiddleware.js";
// import SaleAttendance from "../models/saleAttendanceModel.js";
// import Dashboard from "../models/dashboardModel.js";
// const router = express.Router();

// router.get(
//   "/",
//   asyncHandler(async (req, res) => {
//     const sales = await Sale.find({});

//     res.json(sales);
//   })
// );
// router.get(
//   "/class/:id",
//   asyncHandler(async (req, res) => {
//     const sales = await Sale.find({ classname: req.params.id });
//     if (sales.length > 0) {
//       console.log(sales);

//       res.json(sales);
//     } else {
//       res.status(404).json({ message: "No sales found." });
//     }
//   })
// );
// // the following route is for loading attendance and sales info.
// router.get(
//   "/class/:id/attendance",
//   asyncHandler(async (req, res) => {
//     const sales = await SaleAttendance.findOne({
//       attendance_date: new NepaliDate().format("YYYY-MM-D"),
//       classname: req.params.id,
//     });
//     // console.log("sales",sales.length())
//     if (sales) {
//       console.log(sales);

//       res.json(sales);
//     } else {
//       res.status(404).json({ message: "No sales found." });
//     }
//   })
// );

// //following route is for searching the sales with the given name ,class and roll no
// router.get(
//   "/search/:name/:class/:roll_no",
//   asyncHandler(async (req, res) => {
//     console.log(req.params.name, req.params.class, req.params.roll_no);
//     const sale = await Sale.findOne({
//       sale_name: capitalize(req.params.name),
//       classname: capitalize(req.params.class),
//       roll_no: parseInt(req.params.roll_no),
//     });
//     console.log(sale);

//     if (sale) {
//       res.json(sale);
//     } else {
//       res.status(404);
//       res.json({ message: "No sale found with the given information." });
//     }
//   })
// );

// //following route is for registering the sales

// router.post(
//   "/register",
//   //the protect used here is used for getting the id of the admin who registered the sale

//   protect,
//   asyncHandler(async (req, res) => {
//     const {
//       sale_name,
//       classname,

//       address,
//       parents_name,
//       contact_no,
//       gender,

//       age,
//       email,
//       registration_fees,
//       image,
//     } = req.body;
//     // const sale_info =
//     const sale_info =
//       (await Sale.find({
//         classname: classname,
//       })) &&
//       (await Sale.findOne({ classname: classname })
//         .sort({ roll_no: -1 })
//         .limit(1));
//     if (sale_info) {
//       var roll_no = sale_info.roll_no + 1;
//     } else {
//       var roll_no = 1;
//     }
//     // (await Sale.aggregate({ "$max": '$roll_no', classname: classname }))
//     // console.log('sale_info is', sale_info)
//     console.log(req.body);
//     const registered_by = req.user.name;

//     console.log(registered_by);
//     const previous_dues = 0;
//     // const roll_no = 3
//     console.log("roll no is", roll_no);
//     const salename = capitalize(sale_name);
//     const new_sale = await Sale.create({
//       registered_by,
//       sale_name: salename,
//       email,
//       address,
//       gender,
//       classname,
//       contact_no,
//       roll_no,
//       parents_name,
//       age,
//       previous_dues,
//       registration_fees,

//       image,
//     });
//     console.log(new_sale);
//     if (new_sale) {
//       const total_sales = (await Sale.find()).length;
//       await Dashboard.findOneAndUpdate(
//         { title: "Sales" },
//         { number: total_sales }
//       );
//       console.log("done");
//       console.log("total number of sales", total_sales);
//       res.status(201).json({
//         message: "Sale registered successfully",
//       });
//       console.log("registered successfully");
//     } else {
//       res.status(400);
//       console.log(error);
//       throw new Error("Unable to register sale");
//     }
//   })
// );

// //following route is for paying the fees of sales

// //following route is for attendance of sales
// router.post(
//   "/attendance/:classname",
//   protect,
//   asyncHandler(async (req, res) => {
//     // const sales = await Sale.find({})
//     const { sales } = req.body;
//     console.log(req.body);
//     const class_manager = req.user.name;
//     // console.log(req.params.classname)
//     const attendanceFound = await SaleAttendance.findOne({
//       attendance_date: new NepaliDate().format("YYYY-MM-D"),
//       classname: req.params.classname,
//     });
//     console.log(attendanceFound);
//     if (attendanceFound) {
//       await SaleAttendance.updateOne(
//         { _id: attendanceFound._id },
//         { $set: { sales: sales } }
//       );
//       console.log("done with re-attendance");
//       res.status(201).json({ message: "Attendance retaken successfully" });
//     } else {
//       const new_attendance = await SaleAttendance.create({
//         class_manager,
//         classname: req.params.classname,
//         attendance_date: new NepaliDate().format("YYYY-MM-D"),
//         sales,
//       });
//       console.log(new_attendance);
//       if (new_attendance) {
//         res.status(201).json({
//           message: "Attendance taken successfully",
//         });
//       } else {
//         res.status(400);
//         console.log(error);
//         throw new Error("Unable to take attendance");
//       }
//     }
//   })
// );

// //following route is for admit card of the sale

// //following route is for deleting the sale
// router.delete(
//   "/delete/:id",
//   asyncHandler(async (req, res) => {
//     const sale = await Sale.findById(req.params.id);
//     if (sale) {
//       await sale.remove();
//       const total_sales = (await Sale.find()).length;
//       await Dashboard.findOneAndUpdate(
//         { title: "Sales" },
//         { number: total_sales }
//       );
//       res.json({ message: "Sale removed" });
//     } else {
//       res.status(404);
//       throw new Error("sale not found");
//     }
//   })
// );

// router.post(
//   "/fees/:id",
//   protect,
//   asyncHandler(async (req, res) => {
//     const {
//       sale_name,
//       classname,
//       roll_no,
//       month_name,
//       year,
//       monthly_fees,
//       hostel_fees,
//       laboratory_fees,
//       computer_fees,
//       exam_fees,
//       miscellaneous,
//     } = req.body;
//     console.log(req.params.id);
//     console.log(req.body);
//     const sale = await Sale.findById(req.params.id);
//     // console.log('sale is ', sale)
//     if (sale) {
//       const accountant = req.user.name;
//       const fees_submitted = await SaleFees.create({
//         accountant,
//         sale_name,
//         classname,
//         roll_no,
//         month_name,
//         year,
//         monthly_fees,
//         hostel_fees,
//         laboratory_fees,
//         computer_fees,
//         exam_fees,
//         miscellaneous,
//       });
//       if (fees_submitted) {
//         const total_Fees = await SaleFees.find()
//           .select(
//             "monthly_fees hostel_fees laboratory_fees computer_fees exam_fees miscellaneous "
//           )
//           .select("-_id");
//         var total_Fees1 = 0;
//         total_Fees.map(
//           (fee) =>
//             (total_Fees1 =
//               total_Fees1 +
//               fee.monthly_fees +
//               fee.hostel_fees +
//               fee.laboratory_fees +
//               fee.computer_fees +
//               fee.exam_fees +
//               fee.miscellaneous)
//           // return total_Fees
//         );

//         // console.log('total fees are-', total_Fees)

//         // console.log('total_Fees', total_Fees)
//         await Dashboard.findOneAndUpdate(
//           { title: "Income" },
//           { number: total_Fees1 }
//         );
//         res.status(201).json({ message: "Fees Paid successfully" });
//         console.log("fees success");
//       } else {
//         res.status(400);
//         throw new Error("Error occured while paying fees");
//       }
//     } else {
//       res.status(404);
//       throw new Error("Sale not found");
//     }
//   })
// );

// //for the fees of sales

// export default router;
