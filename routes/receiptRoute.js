import express from "express";

import {
  createReceipt,
  deleteInv,
  getAllReceipts,
  getReceiptById,
  //   getInvoiceId,
  getReceiptsBySaleId,
  getReceiptsBySalesId,
  getSaleInvoiceId,
} from "../controller/receiptController.js";

const router = express.Router();

router.post("/receipt", createReceipt);
router.get("/receipt/:id", getReceiptById);

// routes/receiptRoutes.js
router.get("/receipt/:saleId", getReceiptsBySaleId);

// router.get("/receipt/:id", getInvoiceId);
router.get("/receipt/sale/:id", getSaleInvoiceId);
// router.get("/receipt/", getAll);
router.get("/receipt", getAllReceipts);
// Define the route in your Express application
router.get("/receipts/sale/:id", getReceiptsBySalesId);

// Define the route with parameters
// Define the route with parameters

router.delete("/receipt/:id", deleteInv);

export default router;
