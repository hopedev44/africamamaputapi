import DbBrand from "../models/DbbrandModel.js";

export const createBrand = async (req, res) => {
  try {
    const { name, description } = req.body; // 🆕 include description

    const brand = new DbBrand({
      name,
      description,
      image: req.file ? req.file.location : null, // multer-s3 provides `location`
    });

    await brand.save();
    res.status(201).json({ message: "Brand created successfully", brand });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getBrands = async (req, res) => {
  try {
    const brands = await DbBrand.find();
    res.status(200).json(brands);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
