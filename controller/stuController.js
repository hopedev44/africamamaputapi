import User from "../models/userModel.js";

export const getSalesByClass = async (req, res) => {
  const classname = req.params.classname; // Get the class name from the request params

  try {
    // Find sales by class name
    const sales = await User.find({ role: "sale", classname }).exec();

    if (!sales) {
      return res.status(404).json({ error: "No sales found in that class" });
    }

    return res.status(200).json(sales);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to get sales" });
  }
};
// authController.js
// ... (other imports)

export const getSaleById = async (req, res) => {
  const saleId = req.params.id;

  try {
    // Find the sale by ID
    const sale = await User.findOne({
      _id: saleId,
      role: "sale",
    }).exec();

    if (!sale) {
      return res.status(404).json({ error: "Sale not found" });
    }

    return res.status(200).json(sale);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to get sale" });
  }
};
