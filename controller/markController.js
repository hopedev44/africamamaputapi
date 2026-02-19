import Mark from "../models/markModel.js";
export const createMark = async (req, res) => {
  const newMark = new Mark(req.body);
  try {
    const savedMark = await newMark.save();
    res.status(200).json(savedMark);
  } catch (err) {
    res.status(500).json(err);
  }
};

//GET CATEGORY
export const getMark = async (req, res) => {
  try {
    const clas = await Mark.find({
      classname: req.params.classname,
      term: req.params.term,
      subject: req.params.subject,
    });
    res.status(200).json(clas);
  } catch (err) {
    res.status(500).json(err);
  }
};
export const getsingleMark = async (req, res, next) => {
  try {
    const classes = await Mark.findById(req.params.id);
    res.status(200).json(classes);
  } catch (err) {
    next(err);
  }
};
export const deleteMark = async (req, res, next) => {
  try {
    await Mark.findByIdAndDelete(req.params.id);
    res.status(200).json("Mark has been deleted.");
  } catch (err) {
    next(err);
  }
};
