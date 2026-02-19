// noticeController.js
import Notice from "../models/noticeModel.js";

export const createNotice = async (req, res) => {
  const { date, notice, posted_by } = req.body;

  try {
    const newNotice = new Notice({
      date,
      notice,
      posted_by,
    });

    const savedNotice = await newNotice.save();

    res.status(201).json(savedNotice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create notice" });
  }
};

export const getNotice = async (req, res) => {
  const role = req.params.role;

  try {
    // Find notices based on their posted_by role
    const notices = await Notice.find({ posted_by: role }).exec();

    if (!notices) {
      return res.status(404).json({ error: "No notices found for that role" });
    }

    return res.status(200).json(notices);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to get notices" });
  }
};

export const getallNotice = async (req, res) => {
  try {
    // Find all notices
    const notices = await Notice.find({}).exec();

    if (!notices) {
      return res.status(404).json({ error: "No notices found" });
    }

    return res.status(200).json(notices);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to get notices" });
  }
};
export const deleteNotice = async (req, res) => {
  const noticeId = req.params.id;

  try {
    const deletedNotice = await Notice.findByIdAndDelete(noticeId);

    if (!deletedNotice) {
      return res.status(404).json({ error: "Notice not found" });
    }

    res
      .status(200)
      .json({ message: "Notice deleted successfully", deletedNotice });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete notice" });
  }
};

export const editNotice = async (req, res) => {
  const { id } = req.params;
  const { date, notice, posted_by } = req.body;

  try {
    const updatedNotice = await Notice.findByIdAndUpdate(
      id,
      { date, notice, posted_by },
      { new: true } // This option returns the updated document
    );

    if (!updatedNotice) {
      return res.status(404).json({ error: "Notice not found" });
    }

    res.status(200).json(updatedNotice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update notice" });
  }
};

export const getNoticebyId = async (req, res) => {
  const noticeId = req.params.id; // Assuming the ID is passed as a route parameter

  try {
    const notice = await Notice.findById(noticeId);

    if (!notice) {
      return res.status(404).json({ error: "Notice not found" });
    }

    res.status(200).json(notice);
  } catch (error) {
    console.error("Error fetching notice by ID:", error);
    res.status(500).json({ error: "Failed to fetch notice" });
  }
};
