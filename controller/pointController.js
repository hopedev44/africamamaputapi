import Point from "../models/pointModel.js";

export const createPoint = async (req, res) => {
  try {
    // Fetch the latest point to determine the next pointId
    const latestPoint = await Point.findOne({}, {}, { sort: { pointId: -1 } });
    const nextPointId = (latestPoint && latestPoint.pointId + 1) || 1;

    // Create a new Point with the correct fields from the request body
    const newPoint = new Point({
      pointId: nextPointId,
      pointname: req.body.pointname, // Use req.body.pointname
      address: req.body.address, // Use req.body.address
      sales: [], // Initialize an empty array for sales
    });

    // Save the new Point and respond with the saved document
    const savedPoint = await newPoint.save();
    res.status(200).json(savedPoint);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const updatePoint = async (req, res) => {
  try {
    const updatedPoint = await Point.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedPoint);
  } catch (err) {
    res.status(500).json(err);
  }
};

//GET CATEGORY
// export const getClass = async (req, res) => {
//   try {
//     const clas = await Class.find();
//     res.status(200).json(clas);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// };
export const getPoint = async (req, res) => {
  try {
    const points = await Point.find().populate("sales");
    res.status(200).json(points);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const getsinglePoint = async (req, res, next) => {
  try {
    const points = await Point.findById(req.params.id).populate("sales");
    const totalSales = points.sales.length;

    res.status(200).json({ ...points.toObject(), totalSales });
  } catch (err) {
    next(err);
  }
};

export const deletePoint = async (req, res, next) => {
  try {
    await Point.findByIdAndDelete(req.params.id);
    res.status(200).json("Point has been deleted.");
  } catch (err) {
    next(err);
  }
};
