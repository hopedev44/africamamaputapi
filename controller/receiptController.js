import Receipt from "../models/receiptModel.js";

import User from "../models/userModel.js";

export const getInvoiceId = async (req, res) => {
  const invId = req.params.id;

  try {
    // Find the Invoice by ID
    const invoice = await Receipt.findOne({
      _id: invId,
    }).exec();

    if (!invoice) {
      return res.status(404).json({ error: "Invoice not found" });
    }

    return res.status(200).json(invoice);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to get invoice" });
  }
};

export const getSaleInvoiceId = async (req, res) => {
  const invId = req.params.id;

  try {
    // Find the invoices of a sale by ID and populate the sale field
    const invoice = await Receipt.find({
      sale: invId,
    })
      .populate("sale")
      .exec();

    if (!invoice) {
      return res.status(404).json({ error: "Invoice Of sale not found" });
    }

    return res.status(200).json(invoice);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to get invoice" });
  }
};

export const getAll = async (req, res) => {
  try {
    const receipts = await Receipt.find().populate("sale");
    res.status(200).json(receipts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteInv = async (req, res) => {
  const receiptId = req.params.id;
  Receipt.deleteOne({ _id: receiptId }, (err) => {
    if (err) {
      res.status(500).send("Failed to delete the receipt");
    } else {
      res.status(200).send("Receipt deleted successfully");
    }
  });
};

// controllers/receiptController.js
// controllers/receiptController.js
export const createReceipt = async (req, res) => {
  try {
    const {
      typeOfPayment,
      status,
      reason,
      saleName,
      classname,
      paid,
      amount,
      date,
    } = req.body;

    console.log("Request Body:", req.body); // Log the entire request body

    // Check if the sale with the provided name exists
    const sale = await User.findOne({ saleName, classname });

    if (!sale) {
      console.log("Sale not found:", { saleName, classname });
      return res.status(404).json({ error: "Sale not found" });
    }

    console.log("Sale found:", sale);

    // Create a receipt
    const receipt = await Receipt.create({
      typeOfPayment,
      status,
      reason,
      saleName,
      classname,
      paid,
      amount,
      date,
    });

    console.log("Receipt created:", receipt);

    // Include the sale's ID in the response
    const response = {
      receipt,
      saleId: sale._id, // Assuming the sale model has an '_id' field
    };

    return res.status(201).json(response);
  } catch (error) {
    console.error("Error creating receipt:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
export const getReceiptById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the receipt by ID
    const receipt = await Receipt.findById(id);

    if (!receipt) {
      console.log("Receipt not found for ID:", id);
      return res.status(404).json({ error: "Receipt not found" });
    }

    console.log("Receipt found:", receipt);

    return res.status(200).json(receipt);
  } catch (error) {
    console.error("Error fetching receipt by ID:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
// controllers/receiptController.js

export const getReceiptsBySalesId = async (req, res) => {
  const saleId = req.params.id;

  try {
    // Find the receipts associated with the sale ID
    const receipts = await Receipt.find({ saleId });

    if (!receipts || receipts.length === 0) {
      return res
        .status(404)
        .json({ error: "Receipts not found for the sale ID" });
    }

    return res.status(200).json(receipts);
  } catch (error) {
    console.error("Error retrieving receipts:", error);
    return res.status(500).json({ error: "Failed to get receipts" });
  }
};

// controllers/receiptController.js
// controllers/receiptController.js

// controllers/receiptController.js
export const getReceiptsBySaleId = async (req, res) => {
  try {
    const { saleId } = req.params;

    console.log("Requested saleId:", saleId);

    // Check if the sale with the provided ID exists
    const sale = await User.findById(saleId);

    if (!sale) {
      console.log("Sale not found");
      return res.status(404).json({ error: "Sale not found" });
    }

    console.log("Fetched sale:", sale);

    // Find all receipts for the sale
    const receipts = await Receipt.find({ saleName: sale.username });

    console.log("Fetched receipts:", receipts);

    return res.status(200).json(receipts);
  } catch (error) {
    console.error("Error fetching receipts:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
export const getAllReceipts = async (req, res) => {
  try {
    // Find all receipts
    const receipts = await Receipt.find();

    return res.status(200).json(receipts);
  } catch (error) {
    console.error("Error fetching all receipts:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
