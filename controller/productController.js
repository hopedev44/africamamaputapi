import Product from "../models/productModel.js"; // Replace with your actual model
import Category from "../models/bookCatModel.js"

// export const createProduct = async (req, res) => {
//   try {
//     const {
//       name,
//       category,
//       description,
//       price,
//       discountPrice,
//       quantityAvailable,
//       color,
//       size,
//       material,
//       type,
//       tag,
//       decorationMethods,
//       weight,
//       minimumQuantity,
//       brand,
//       features,
//       closureType,
//       reviews = [],
//     } = req.body;

//     // Handle image uploads (from AWS S3 or Multer-S3)
//     const imageUrls = req.files?.images
//       ? req.files.images.map((file) => file.location)
//       : [];

//     const newProduct = await Product.create({
//       name,
//       category,
//       description,
//       price,
//       discountPrice,
//       quantityAvailable,
//       color,
//       size,
//       material,
//       type,
//       tag,
//       decorationMethods,
//       weight,
//       minimumQuantity,
//       brand,
//       features,
//       closureType,
//       images: imageUrls,
//       reviews,
//       productDate: Date.now(),
//     });

//     res.status(201).json(newProduct);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      category, // category id is expected here (Trucker Hat _id)
      description,
      price,
      discountPrice,
      quantityAvailable,
      color,
      size,
      material,
      type,
      tag,
      decorationMethods,
      weight,
      minimumQuantity,
      brand,
      features,
      closureType,
      reviews = [],
       isBestSeller = false,   // 👈
  isTrending = false,     // 👈
  isFeatured = false, 


    } = req.body;
const parsedDecorationMethods = Array.isArray(decorationMethods)
  ? decorationMethods.map((method) =>
      typeof method === "string"
        ? { name: method } // fallback if frontend sends only string
        : method // already an object { name, note }
    )
  : decorationMethods
  ? [
      typeof decorationMethods === "string"
        ? { name: decorationMethods }
        : decorationMethods,
    ]
  : [];


  if (req.body.decorationMethods) {
  req.body.decorationMethods = req.body.decorationMethods.filter(
    (m) => m.name && m.name.trim() !== ""
  );
}


    // Handle image uploads (AWS S3 or Multer-S3)
    const imageUrls = req.files?.images
      ? req.files.images.map((file) => file.location)
      : [];

    // Create product
    const newProduct = await Product.create({
      name,
      category,
      description,
      price,
      discountPrice,
      quantityAvailable,
      color,
      size,
      material,
      type,
      tag,
       decorationMethods: parsedDecorationMethods,
      weight,
      minimumQuantity,
      brand,
      features,
      closureType,
      images: imageUrls,
      reviews,
      productDate: Date.now(),
       isBestSeller,
  isTrending,
  isFeatured,
    });

    // Fetch category, parent, and grandparent
    let categoryData = await Category.findById(category).lean();
    let parentCategory = null;
    let grandParentCategory = null;

    if (categoryData?.parent) {
      parentCategory = await Category.findById(categoryData.parent).lean();

      if (parentCategory?.parent) {
        grandParentCategory = await Category.findById(
          parentCategory.parent
        ).lean();
      }
    }

    res.status(201).json({
      ...newProduct.toObject(),
      category: categoryData,
      parentCategory,
      grandParentCategory,
    });
  } catch (err) {
    console.error("❌ Backend error creating product:", err); // <--- add this
    res.status(500).json({ message: err.message });
  }
};
export const getProducts = async (req, res) => {
  try {
  const products = await Product.find()
      .populate("category") // keep category for hierarchy
      .populate("brand", "name image description") // ✅ add brand population
      .lean();

    const enrichedProducts = await Promise.all(
      products.map(async (product) => {
        let parentCategory = null;
        let grandParentCategory = null;

        if (product.category?.parent) {
          parentCategory = await Category.findById(product.category.parent).lean();

          if (parentCategory?.parent) {
            grandParentCategory = await Category.findById(parentCategory.parent).lean();
          }
        }

        return {
          ...product,
          parentCategory,
          grandParentCategory,
        };
      })
    );

    res.json(enrichedProducts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// export const getProducts = async (req, res) => {
//   try {
//     const products = await Product.find().populate("category");
//     res.json(products);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };



// export const getProductById = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id).populate("category");
//     if (!product) return res.status(404).json({ message: "Not found" });
//     res.json(product);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// export const getProductById = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id)
//       .populate({
//         path: "category",
//         populate: { path: "parent", populate: { path: "parent" } }, // populate parent and grandparent
//       });

//     if (!product) return res.status(404).json({ message: "Not found" });

//     res.json(product);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate({
        path: "category",
        populate: { path: "parent", populate: { path: "parent" } },
      })
      .populate("brand", "name image description"); // ✅ include brand

    if (!product) return res.status(404).json({ message: "Not found" });

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// export const updateProduct = async (req, res) => {
//   try {
//     const updates = req.body;
//     const updated = await Product.findByIdAndUpdate(req.params.id, updates, {
//       new: true,
//     });
//     res.json(updated);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
export const updateProduct = async (req, res) => {
  try {
    const updates = { ...req.body };

    let newImages = [];
    if (req.files && req.files['images']) {
      // Always ensure it's an array
      const uploadedFiles = Array.isArray(req.files['images'])
        ? req.files['images']
        : [req.files['images']];

      newImages = uploadedFiles.map((file) => file.location || file.path);
    }

    if (newImages.length > 0) {
      updates.images = [
        ...(req.body.existingImages ? JSON.parse(req.body.existingImages) : []),
        ...newImages,
      ];
    }

    const updated = await DbProduct.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });

    res.json(updated);
  } catch (err) {
    console.error("❌ Error updating product:", err);
    res.status(500).json({ message: err.message });
  }
};
export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    // Fetch all products where product.category = this categoryId
    const products = await Product.find({ category: categoryId })
      .populate("category") // include category info
      .populate("brand", "name image") // include brand if needed
      .lean();

    // Enrich with parent and grandparent category
    const enrichedProducts = await Promise.all(
      products.map(async (product) => {
        let parentCategory = null;
        let grandParentCategory = null;

        if (product.category?.parent) {
          parentCategory = await Category.findById(product.category.parent).lean();
          if (parentCategory?.parent) {
            grandParentCategory = await Category.findById(parentCategory.parent).lean();
          }
        }

        return {
          ...product,
          parentCategory,
          grandParentCategory,
        };
      })
    );

    res.json(enrichedProducts);
  } catch (err) {
    console.error("❌ Error fetching products by category:", err);
    res.status(500).json({ message: err.message });
  }
};


const enrichProducts = async (products) => {
  return await Promise.all(
    products.map(async (product) => {
      let parentCategory = null;
      let grandParentCategory = null;

      if (product.category?.parent) {
        parentCategory = await DbCategory.findById(product.category.parent).lean();

        if (parentCategory?.parent) {
          grandParentCategory = await DbCategory.findById(parentCategory.parent).lean();
        }
      }

      return {
        ...product,
        parentCategory,
        grandParentCategory,
      };
    })
  );
};

// ✅ Best Sellers
export const getBestSellers = async (req, res) => {
  try {
    const products = await Product.find({ isBestSeller: true })
      .populate("category")
      .populate("brand", "name image description")
      .lean();

    const enriched = await enrichProducts(products);
    res.json(enriched);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Trending
export const getTrendingProducts = async (req, res) => {
  try {
    const products = await Product.find({ isTrending: true })
      .populate("category")
      .populate("brand", "name image description")
      .lean();

    const enriched = await enrichProducts(products);
    res.json(enriched);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Featured
export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true })
      .populate("category")
      .populate("brand", "name image description")
      .lean();

    const enriched = await enrichProducts(products);
    res.json(enriched);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};