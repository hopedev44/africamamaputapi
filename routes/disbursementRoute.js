import express from "express";
import {
  createDisbursement,
  approveDisbursement,
  getDisbursementsForManager,
  getDisbursementsForSales,
  getAllDisbursementsByAdmin,
  approveDisbursementSales,
  createDisbursementtoSales,
  getAllDisbursementsByManager,
  deleteDisbursement,
  deleteDisbursementByManager,
} from "../controller/disbursementController.js";
import authenticateUser from "../middleware/authMiddleware.js";

const router = express.Router();

// Route to create a new disbursement
router.post("/disbursements", authenticateUser, createDisbursement);

router.get("/disbursements", authenticateUser, getAllDisbursementsByAdmin);
// Route to approve a disbursement
// router.put("/disbursements/approve", authenticateUser, approveDisbursement);

router.put(
  "/disbursements/:disbursementId/approve",
  authenticateUser,
  approveDisbursement
);

// Route to get disbursements for a manager
router.get("/disbursements/:managerId", getDisbursementsForManager);

// Route to get disbursements for a manager
router.get("/disbursementss/:salesId", getDisbursementsForSales);

// Route to get all disbursements made by the logged-in manager to any salesperson
router.get(
  "/disbursement/from-manager-to-sales",
  authenticateUser,
  getAllDisbursementsByManager
);

// Route for managers to disburse to salespersons
router.post("/manager/disburse", authenticateUser, createDisbursementtoSales);

// Route to get all disbursements made by the logged-in manager to any salesperson

// Route for salespersons to approve disbursement
router.put(
  "/sales-disbursements/:disbursementId/approve",
  authenticateUser,
  approveDisbursementSales
);
// Route to delete a disbursement
router.delete("/disbursement/:id", deleteDisbursement);
// In your router file
router.delete(
  "/disbursementt/:disbursementId",
  authenticateUser,
  deleteDisbursementByManager
);

export default router;
