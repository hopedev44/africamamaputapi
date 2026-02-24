import DbProduct from "../models/DbproductModel.js"; // Replace with your actual model
import DbCategory from "../models/DbbookCatModel.js"

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      description,
      price,
      originalPrice,
      weight,
      unit,
      quantityAvailable,
      minimumQuantity,
      expiryInfo,
      storageInfo,
      isBestSeller,
      isTrending,
      isFeatured,
      isSpecial,
    } = req.body;

    // Arrays sent via FormData come as string or array — normalize both
    const toArray = (val) => {
      if (!val) return [];
      return Array.isArray(val) ? val : [val];
    };

    const ingredients = toArray(req.body.ingredients);
    const allergens   = toArray(req.body.allergens);
    const tag         = toArray(req.body.tag);
    const features    = toArray(req.body.features);

    const imageUrls = req.files?.images
      ? req.files.images.map((f) => f.location || f.filename)
      : [];

    const newProduct = await DbProduct.create({
      name,
      category: category || null,
      description,
      originalPrice: originalPrice ? Number(originalPrice) : null,
      price: Number(price),
      weight,
      unit,
      quantityAvailable: Number(quantityAvailable) || 0,
      minimumQuantity:   Number(minimumQuantity) || 1,
      expiryInfo,
      storageInfo,
      ingredients,
      allergens,
      tag,
      features,
      images: imageUrls,
      isBestSeller: isBestSeller === "true",
      isTrending:   isTrending === "true",
      isFeatured:   isFeatured === "true",
      isSpecial:    isSpecial === "true",
    });

    res.status(201).json(newProduct);
  } catch (err) {
    console.error("❌ Backend error creating product:", err);
    res.status(500).json({ message: err.message });
  }
};
export const getProducts = async (req, res) => {
  try {
    const products = await DbProduct.find()
      .populate("category", "name")  // only need name from category
      .lean();

    res.json(products);
  } catch (err) {
    console.error("❌ Error fetching products:", err);
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
    const product = await DbProduct.findById(req.params.id)
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
export const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const product = await DbProduct.findOne({ slug }).populate('category').lean();
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.status(200).json(product);
  } catch (err) {
    console.error("Failed to fetch product by slug:", err);
    res.status(500).json({ error: "Failed to fetch product" });
  }
};


// export const updateProduct = async (req, res) => {
//   try {
//     const updates = req.body;
//     const updated = await DbProduct.findByIdAndUpdate(req.params.id, updates, {
//       new: true,
//     });
//     res.json(updated);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };


// export const updateProduct = async (req, res) => {
//   try {
//     const updates = { ...req.body };

//     // If new images were uploaded
//     if (req.files && req.files.images) {
//       const newImages = req.files.images.map((file) => file.location);
//       // Merge old + new
//       updates.images = [
//         ...(req.body.existingImages ? JSON.parse(req.body.existingImages) : []),
//         ...newImages,
//       ];
//     }

//     const updated = await DbProduct.findByIdAndUpdate(req.params.id, updates, {
//       new: true,
//     });

//     res.json(updated);
//   } catch (err) {
//     console.error("❌ Error updating product:", err);
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
    await DbProduct.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const products = await DbProduct.find({ category: categoryId })
      .populate("category")  // ← keep this
      // .populate("brand", "name image")  ← REMOVE this line
      .lean();

    const enrichedProducts = await Promise.all(
      products.map(async (product) => {
        let parentCategory = null;
        let grandParentCategory = null;

        if (product.category?.parent) {
          parentCategory = await DbCategory.findById(product.category.parent).lean();
          if (parentCategory?.parent) {
            grandParentCategory = await DbCategory.findById(parentCategory.parent).lean();
          }
        }

        return { ...product, parentCategory, grandParentCategory };
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
    const products = await DbProduct.find({ isBestSeller: true })
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
    const products = await DbProduct.find({ isTrending: true })
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
    const products = await DbProduct.find({ isFeatured: true })
      .populate("category")
      .populate("brand", "name image description")
      .lean();

    const enriched = await enrichProducts(products);
    res.json(enriched);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const getSpecialProducts = async (req, res) => {
  try {
    const products = await DbProduct.find({ isSpecial: true })
      .populate("category")
      .populate("brand", "name image description")
      .lean();

    const enriched = await enrichProducts(products);
    res.json(enriched);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};