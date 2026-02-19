import Disbursement from "../models/disbursementModel.js";
import User from "../models/userModel.js";
import mongoose from "mongoose";

// Create a new disbursement
// export const createDisbursement = async (req, res) => {
//   const { adminId, managerId, amount, notes } = req.body;

//   try {
//     const admin = await User.findById(adminId);
//     const manager = await User.findById(managerId);

//     if (!admin || admin.role !== "admin") {
//       return res.status(400).json({ message: "Invalid admin ID." });
//     }

//     if (!manager || manager.role !== "manager") {
//       return res.status(400).json({ message: "Invalid manager ID." });
//     }

//     const disbursement = new Disbursement({
//       admin: adminId,
//       manager: managerId,
//       amount,
//       notes,
//     });

//     await disbursement.save();

//     manager.disbursements.push(disbursement._id);
//     await manager.save();

//     res
//       .status(201)
//       .json({ message: "Disbursement created successfully.", disbursement });
//   } catch (error) {
//     res.status(500).json({ message: "Error creating disbursement.", error });
//   }
// };
export const createDisbursement = async (req, res) => {
  try {
    const adminId = req.user._id; // Extract admin ID from the authenticated user
    const { managerId, amount, notes } = req.body;

    console.log(`Admin ID: ${adminId}`);
    console.log(`Manager ID: ${managerId}`);

    const manager = await User.findById(managerId);

    if (!manager || manager.role !== "manager") {
      return res.status(400).json({ message: "Invalid manager ID." });
    }

    const disbursement = new Disbursement({
      admin: adminId,
      manager: managerId,
      amount,
      notes,
    });
    console.log("Disbursement to be saved:", disbursement);

    await disbursement.save();

    manager.disbursements.push(disbursement._id);
    await manager.save();

    res.status(201).json({
      message: "Disbursement created successfully.",
      disbursement,
    });
  } catch (error) {
    console.error("Error creating disbursement:", error); // Log the error
    res.status(500).json({ message: "Error creating disbursement.", error });
  }
};

// export const createDisbursementtoSales = async (req, res) => {
//   try {
//     const managerId = req.user._id; // Extract admin ID from the authenticated user
//     const { salesId, amount, notes } = req.body;

//     console.log(`Manager ID: ${managerId}`);
//     console.log(`Sales ID: ${salesId}`);

//     const sales = await User.findById(salesId);

//     if (!sales || sales.role !== "sales") {
//       return res.status(400).json({ message: "Invalid sales ID." });
//     }

//     const disbursement = new Disbursement({
//       manager: managerId,
//       sales: salesId,
//       amount,
//       notes,
//     });

//     await disbursement.save();

//     sales.disbursements.push(disbursement._id);
//     await sales.save();

//     res.status(201).json({
//       message: "Disbursement created successfully.",
//       disbursement,
//     });
//   } catch (error) {
//     console.error("Error creating disbursement:", error); // Log the error
//     res.status(500).json({ message: "Error creating disbursement.", error });
//   }
// };
// export const createDisbursementtoSales = async (req, res) => {
//   try {
//     const managerId = req.user._id; // Extract manager ID from the authenticated user
//     const { salesId, amount, notes } = req.body;

//     console.log(`Manager ID: ${managerId}`);
//     console.log(`Sales ID: ${salesId}`);

//     // Verify the salesperson exists and has the 'sales' role
//     const sales = await User.findById(salesId);

//     if (!sales || sales.role !== "sales") {
//       return res.status(400).json({ message: "Invalid sales ID." });
//     }

//     // Create the disbursement
//     const disbursement = new Disbursement({
//       manager: managerId,
//       salesperson: salesId, // Note that I'm using 'salesperson' to match your model
//       amount,
//       notes,
//     });

//     await disbursement.save();

//     // Update the salesperson's disbursements list
//     sales.disbursements.push(disbursement._id);
//     await sales.save();

//     // Populate the 'salesperson' field with username and email
//     const populatedDisbursement = await disbursement
//       .populate("salesperson", "username email")
//       .execPopulate();

//     res.status(201).json({
//       message: "Disbursement created successfully.",
//       disbursement: populatedDisbursement,
//     });
//   } catch (error) {
//     console.error("Error creating disbursement:", error); // Log the error
//     res.status(500).json({ message: "Error creating disbursement.", error });
//   }
// };

export const createDisbursementtoSales = async (req, res) => {
  try {
    const managerId = req.user._id; // Extract manager ID from the authenticated user
    const { salesId, amount, notes } = req.body;

    console.log(`Manager ID: ${managerId}`);
    console.log(`Sales ID: ${salesId}`);

    // Verify the salesperson exists and has the 'sales' role
    const sales = await User.findById(salesId);

    if (!sales || sales.role !== "sales") {
      return res.status(400).json({
        message: "Invalid sales ID or the user is not a salesperson.",
      });
    }

    // Create the disbursement
    const disbursement = new Disbursement({
      manager: managerId, // Correctly assigning manager ID
      salesperson: salesId, // Assigning salesperson ID
      amount,
      notes,
    });

    // Save the disbursement
    await disbursement.save();

    // Update the salesperson's disbursements list
    sales.disbursements.push(disbursement._id);
    await sales.save();

    // Populate the 'salesperson' field with username and email
    const populatedDisbursement = await disbursement.populate(
      "salesperson",
      "username email"
    );

    res.status(201).json({
      message: "Disbursement created successfully.",
      disbursement: populatedDisbursement,
    });
  } catch (error) {
    console.error("Error creating disbursement:", error);
    res.status(500).json({ message: "Error creating disbursement.", error });
  }
};
export const deleteDisbursement = async (req, res) => {
  try {
    const disbursementId = req.params.id;

    // Find the disbursement by ID
    const disbursement = await Disbursement.findById(disbursementId);

    if (!disbursement) {
      return res.status(404).json({ message: "Disbursement not found." });
    }

    // Remove the disbursement ID from the manager's disbursements array
    const manager = await User.findById(disbursement.manager);
    if (manager) {
      manager.disbursements.pull(disbursementId);
      await manager.save();
    }

    // Delete the disbursement
    await disbursement.remove();

    res.status(200).json({ message: "Disbursement deleted successfully." });
  } catch (error) {
    console.error("Error deleting disbursement:", error); // Log the error
    res.status(500).json({ message: "Error deleting disbursement.", error });
  }
};

export const getDisbursementsFromManagerToSales = async (req, res) => {
  try {
    const { managerId, salesId } = req.params;

    // Find all disbursements made by the manager to the salesperson
    const disbursements = await Disbursement.find({
      manager: managerId,
      salesperson: salesId,
    }).populate("manager salesperson", "username email");

    if (!disbursements || disbursements.length === 0) {
      return res.status(404).json({
        message: "No disbursements found for this manager to this salesperson.",
      });
    }

    res.status(200).json({
      message: "Disbursements retrieved successfully.",
      disbursements,
    });
  } catch (error) {
    console.error("Error retrieving disbursements:", error);
    res.status(500).json({ message: "Error retrieving disbursements.", error });
  }
};

// export const getAllDisbursementsByManager = async (req, res) => {
//   try {
//     const managerId = req.user._id; // The ID of the logged-in manager
//     console.log("Authenticated Manager ID:", managerId); // Debugging line

//     // Find all disbursements made by the logged-in manager
//     const disbursements = await Disbursement.find({
//       manager: mongoose.Types.ObjectId(managerId),
//     })
//       .populate({
//         path: "salesperson",
//         select: "username email",
//       })
//       .exec();

//     console.log("Disbursements:", disbursements); // Debugging line

//     if (!disbursements || disbursements.length === 0) {
//       return res.status(404).json({
//         message: "No disbursements found for this manager to any salesperson.",
//       });
//     }

//     res.status(200).json({
//       message: "Disbursements retrieved successfully.",
//       disbursements,
//     });
//   } catch (error) {
//     console.error("Error retrieving disbursements:", error);
//     res.status(500).json({ message: "Error retrieving disbursements.", error });
//   }
// };

// export const getAllDisbursementsByManager = async (req, res) => {
//   try {
//     if (!req.user || !req.user.id) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     const managerId = req.user.id;
//     console.log("Authenticated Manager ID:", managerId); // Debugging line

//     const disbursements = await Disbursement.find({
//       manager: mongoose.Types.ObjectId(managerId),
//     })
//       .populate({
//         path: "salesperson",
//         select: "username email",
//       })
//       .exec();

//     console.log("Disbursements:", disbursements); // Debugging line

//     if (!disbursements || disbursements.length === 0) {
//       return res.status(404).json({
//         message: "No disbursements found for this manager to any salesperson.",
//       });
//     }

//     res.status(200).json({
//       message: "Disbursements retrieved successfully.",
//       disbursements,
//     });
//   } catch (error) {
//     console.error("Error retrieving disbursements:", error);
//     res.status(500).json({ message: "Error retrieving disbursements.", error });
//   }
// };
// export const getAllDisbursementsByManager = async (req, res) => {
//   try {
//     if (!req.user || !req.user._id) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     const managerId = req.user._id;
//     console.log("Authenticated Manager ID:", managerId); // Debugging line

//     const disbursements = await Disbursement.find({
//       manager: mongoose.Types.ObjectId(managerId),
//       salesperson: { $exists: true, $ne: null }, // Ensure that the disbursement is to a salesperson
//     })
//       .populate({
//         path: "salesperson",
//         select: "username email",
//       })
//       .exec();

//     console.log("Disbursements:", disbursements); // Debugging line

//     if (!disbursements || disbursements.length === 0) {
//       return res.status(404).json({
//         message: "No disbursements found for this manager to any salesperson.",
//       });
//     }

//     res.status(200).json({
//       message: "Disbursements retrieved successfully.",
//       disbursements,
//     });
//   } catch (error) {
//     console.error("Error retrieving disbursements:", error);
//     res.status(500).json({ message: "Error retrieving disbursements.", error });
//   }
// };
export const getAllDisbursementsByManager = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const managerId = req.user._id;
    console.log("Authenticated Manager ID:", managerId); // Debugging line

    const disbursements = await Disbursement.find({
      manager: managerId, // Simplified to use managerId directly
      salesperson: { $exists: true, $ne: null },
    })
      .populate({
        path: "salesperson",
        select: "username email",
      })
      .exec();

    console.log("Disbursements:", disbursements); // Debugging line

    if (!disbursements || disbursements.length === 0) {
      return res.status(404).json({
        message: "No disbursements found for this manager to any salesperson.",
      });
    }

    res.status(200).json({
      message: "Disbursements retrieved successfully.",
      disbursements,
    });
  } catch (error) {
    console.error("Error retrieving disbursements:", error);
    res.status(500).json({ message: "Error retrieving disbursements.", error });
  }
};

// Get all disbursements made by the admin
export const getAllDisbursementsByAdmin = async (req, res) => {
  try {
    // Get the logged-in user's ID (assuming the admin's ID is stored in req.user._id)
    const adminId = req.user._id;

    // Fetch all disbursements where the admin field matches the logged-in admin's ID
    const disbursements = await Disbursement.find({ admin: adminId }).populate(
      "manager",
      "username"
    );

    res.status(200).json({
      success: true,
      data: disbursements,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving disbursements",
      error: error.message,
    });
  }
};

// Approve a disbursement

// export const approveDisbursement = async (req, res) => {
//   const { disbursementId } = req.body;
//   const managerId = req.user.id; // Use req.user.id

//   console.log("Received disbursementId:", disbursementId);
//   console.log("Manager ID from token:", managerId);

//   try {
//     const disbursement = await Disbursement.findById(disbursementId);

//     if (!disbursement) {
//       return res.status(404).json({ message: "Disbursement not found." });
//     }

//     if (disbursement.manager.toString() !== managerId) {
//       return res
//         .status(400)
//         .json({ message: "Invalid disbursement ID or manager ID." });
//     }

//     disbursement.status = "approved";
//     disbursement.approvedDate = Date.now();

//     await disbursement.save();

//     res.status(200).json({
//       message: "Disbursement approved successfully.",
//       disbursement,
//     });
//   } catch (error) {
//     console.error("Error approving disbursement:", error);
//     res.status(500).json({ message: "Error approving disbursement.", error });
//   }
// };

// Update the approveDisbursement controller to get disbursementId from req.params
export const approveDisbursement = async (req, res) => {
  const { disbursementId } = req.params; // Get disbursementId from URL params
  const managerId = req.user.id; // Use req.user.id

  console.log("Received disbursementId:", disbursementId);
  console.log("Manager ID from token:", managerId);

  try {
    const disbursement = await Disbursement.findById(disbursementId);

    if (!disbursement) {
      return res.status(404).json({ message: "Disbursement not found." });
    }

    if (disbursement.manager.toString() !== managerId) {
      return res
        .status(400)
        .json({ message: "Invalid disbursement ID or manager ID." });
    }

    disbursement.status = "approved";
    disbursement.approvedDate = Date.now();

    await disbursement.save();

    res.status(200).json({
      message: "Disbursement approved successfully.",
      disbursement,
    });
  } catch (error) {
    console.error("Error approving disbursement:", error);
    res.status(500).json({ message: "Error approving disbursement.", error });
  }
};
// export const approveDisbursementSales = async (req, res) => {
//   const { disbursementId } = req.params; // Get disbursementId from URL params
//   const salesId = req.user.id; // Use req.user.id

//   console.log("Received disbursementId:", disbursementId);
//   console.log("Sales ID from token:", salesId);

//   try {
//     const disbursement = await Disbursement.findById(disbursementId);

//     if (!disbursement) {
//       return res.status(404).json({ message: "Disbursement not found." });
//     }

//     if (disbursement.sales.toString() !== salespersonId) {
//       return res
//         .status(400)
//         .json({ message: "Invalid disbursement ID or sales ID." });
//     }

//     disbursement.status = "approved";
//     disbursement.approvedDate = Date.now();

//     await disbursement.save();

//     res.status(200).json({
//       message: "Disbursement approved successfully.",
//       disbursement,
//     });
//   } catch (error) {
//     console.error("Error approving disbursement:", error);
//     res.status(500).json({ message: "Error approving disbursement.", error });
//   }
// };
export const approveDisbursementSales = async (req, res) => {
  const { disbursementId } = req.params; // Get disbursementId from URL params
  const salesId = req.user._id; // Use req.user.id

  console.log("Received disbursementId:", disbursementId);
  console.log("Sales ID from token:", salesId);

  try {
    const disbursement = await Disbursement.findById(disbursementId);

    if (!disbursement) {
      return res.status(404).json({ message: "Disbursement not found." });
    }

    // Check if the salesperson ID matches the logged-in user
    if (disbursement.salesperson.toString() !== salesId) {
      return res
        .status(400)
        .json({ message: "Invalid disbursement ID or sales ID." });
    }

    disbursement.status = "approved";
    disbursement.approvedDate = Date.now();

    await disbursement.save();

    res.status(200).json({
      message: "Disbursement approved successfully.",
      disbursement,
    });
  } catch (error) {
    console.error("Error approving disbursement:", error);
    res.status(500).json({ message: "Error approving disbursement.", error });
  }
};

// Get disbursements for a manager
// export const getDisbursementsForManager = async (req, res) => {
//   const { managerId } = req.params;

//   try {
//     // const disbursements = await Disbursement.find({ manager: managerId });
//     const disbursements = await Disbursement.find({ manager: managerId })
//       .populate("manager", "username") // This assumes your manager schema has a 'name' field
//       .exec();

//     res.status(200).json({ disbursements });
//   } catch (error) {
//     res.status(500).json({ message: "Error retrieving disbursements.", error });
//   }
// };
export const getDisbursementsForManager = async (req, res) => {
  const { managerId } = req.params;

  try {
    // Find disbursements where the given manager is the recipient (admin to manager)
    // and there is no salesperson involved (admin to manager disbursement)
    const disbursements = await Disbursement.find({
      manager: managerId,
      salesperson: { $exists: false }, // Ensure this disbursement is not to a salesperson
      admin: { $exists: true }, // Ensure this disbursement is from an admin
    })
      .populate("manager", "username") // Populating manager details
      .exec();

    res.status(200).json({ disbursements });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving disbursements.", error });
  }
};

export const getDisbursementsForSales = async (req, res) => {
  const { salesId } = req.params;

  try {
    // Query the Disbursement model where the salesperson field matches the salesId
    const disbursements = await Disbursement.find({ salesperson: salesId })
      .populate("salesperson", "username email") // Populate salesperson details
      .exec();

    if (!disbursements || disbursements.length === 0) {
      return res
        .status(404)
        .json({ message: "No disbursements found for this salesperson." });
    }

    res.status(200).json({ disbursements });
  } catch (error) {
    console.error("Error retrieving disbursements for salesperson:", error);
    res.status(500).json({ message: "Error retrieving disbursements.", error });
  }
};

// // Manager disburses money to salesperson
// export const disburseToSalesperson = async (req, res) => {
//   try {
//     const { managerId, salespersonId, amount, notes } = req.body;

//     const disbursement = new Disbursement({
//       manager: managerId,
//       salesperson: salespersonId,
//       amount,
//       notes,
//     });

//     await disbursement.save();

//     res.status(201).json({
//       message: "Disbursement to salesperson created successfully.",
//       disbursement,
//     });
//   } catch (err) {
//     res.status(500).json({ error: "Failed to create disbursement." });
//   }
// };
// export const disburseToSalesperson = async (req, res) => {
//   try {
//     const { managerId, salespersonId, amount, notes } = req.body;

//     const disbursement = new Disbursement({
//       manager: managerId,
//       salesperson: salespersonId,
//       amount,
//       notes,
//     });

//     await disbursement.save();

//     res.status(201).json({
//       message: "Disbursement to salesperson created successfully.",
//       disbursement,
//     });
//   } catch (err) {
//     console.error("Error creating disbursement:", err); // Log the error for debugging
//     res.status(500).json({ error: "Failed to create disbursement." });
//   }
// };

// Salesperson approves the disbursement
export const approveDisbursementToSales = async (req, res) => {
  try {
    const { disbursementId, salespersonId } = req.body;

    const disbursement = await Disbursement.findById(disbursementId);

    if (!disbursement) {
      return res.status(404).json({ error: "Disbursement not found." });
    }

    if (disbursement.salesperson.toString() !== salespersonId) {
      return res.status(403).json({ error: "Unauthorized approval." });
    }

    disbursement.status = "approved";
    disbursement.approvedDate = Date.now();

    await disbursement.save();

    res.status(200).json({
      message: "Disbursement approved successfully.",
      disbursement,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to approve disbursement." });
  }
};
// In your controller file
export const deleteDisbursementByManager = async (req, res) => {
  try {
    const managerId = req.user._id; // Get the authenticated manager's ID
    const { disbursementId } = req.params; // Get the disbursement ID from the request params

    // Find the disbursement by ID and manager ID to ensure the manager owns it
    const disbursement = await Disbursement.findOneAndDelete({
      _id: disbursementId,
      manager: managerId,
    });

    if (!disbursement) {
      return res.status(404).json({
        message:
          "Disbursement not found or you do not have permission to delete it.",
      });
    }

    res.status(200).json({
      message: "Disbursement deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting disbursement:", error);
    res.status(500).json({ message: "Error deleting disbursement.", error });
  }
};
