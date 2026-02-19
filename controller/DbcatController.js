
import DbCategory from "../models/DbbookCatModel.js";
import DbProduct from "../models/DbproductModel.js";

export const createCategory = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

   
    const { name, parent } = req.body;
const icon = req.body.icon || null;

    let image = null;

    if (req.file) {
      image = req.file.location || req.file.filename; // S3 gives `.location`, local gives `.filename`
    }

    const newCategory = new DbCategory({
      name,
      parent: parent || null,
      icon,
      image,
    });

    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (err) {
    console.error("Category creation error:", err);
    res.status(500).json({ error: "Failed to create category" });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    // 1️⃣ Fetch everything in parallel
    const [categories, products] = await Promise.all([
      DbCategory.find().lean(),
      DbProduct.find().lean(),
    ]);

    // 2️⃣ Build category map
    const categoryMap = {};
    categories.forEach((cat) => {
      categoryMap[cat._id] = {
        ...cat,
        children: [],
      };
    });

    // 3️⃣ Attach products to their category
    products.forEach((product) => {
      const categoryId = product.category?.toString();
      if (categoryMap[categoryId]) {
        categoryMap[categoryId].children.push(product);
      }
    });

    // 4️⃣ Build category tree
    const tree = [];

    categories.forEach((cat) => {
      if (cat.parent) {
        const parentId = cat.parent.toString();
        if (categoryMap[parentId]) {
          categoryMap[parentId].children.push(categoryMap[cat._id]);
        }
      } else {
        tree.push(categoryMap[cat._id]);
      }
    });

    res.status(200).json(tree);
  } catch (error) {
    console.error("❌ getAllCategories failed:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCategory = await DbCategory.findByIdAndDelete(id);
    if (!deletedCategory) return res.status(404).json({ error: "Category not found" });

    // Optional: Delete all subcategories and products if you want cascading deletion
    await DbCategory.deleteMany({ parent: id });
    await DbProduct.deleteMany({ category: id });

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (err) {
    console.error("Category deletion error:", err);
    res.status(500).json({ error: "Failed to delete category" });
  }
};


// UPDATE CATEGORY
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, parent, icon } = req.body;
    const updateData = { name, parent: parent || null, icon };

    if (req.file) {
      updateData.image = req.file.location || req.file.filename;
    }

    const updatedCategory = await DbCategory.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedCategory) return res.status(404).json({ error: "Category not found" });

    res.status(200).json(updatedCategory);
  } catch (err) {
    console.error("Category update error:", err);
    res.status(500).json({ error: "Failed to update category" });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await DbCategory.findById(id).lean();
    if (!category) return res.status(404).json({ error: "Category not found" });

    res.status(200).json(category);
  } catch (err) {
    console.error("Failed to fetch category:", err);
    res.status(500).json({ error: "Failed to fetch category" });
  }
};
export const getCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const category = await DbCategory.findOne({ slug }).lean();

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.status(200).json(category);
  } catch (err) {
    console.error("Failed to fetch category by slug:", err);
    res.status(500).json({ error: "Failed to fetch category" });
  }
};
