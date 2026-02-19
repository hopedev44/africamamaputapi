import DbCart from "../models/DbcartModel.js";
import { v4 as uuidv4 } from "uuid";

// -----------------------------------------------
// CREATE GUEST CART
// -----------------------------------------------
export const initCart = async (req, res) => {
  try {
    const cartId = uuidv4();
    await DbCart.create({ cartId, items: [], userId: null });

    res.json({ cartId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -----------------------------------------------
// GET CART BY CART ID
// -----------------------------------------------
export const getCartByCartId = async (req, res) => {
  try {
    const { cartId } = req.query;

    if (!cartId) return res.json({ items: [] });

    const cart = await DbCart.findOne({ cartId });

    res.json(cart || { cartId, items: [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -----------------------------------------------
// GET CART BY USER
// -----------------------------------------------
// export const getCartByUser = async (req, res) => {
//   try {
//     const { userId } = req.query;

//     if (!userId)
//       return res.status(400).json({ message: "userId required" });

//     let cart = await DbCart.findOne({ userId });

//     if (!cart) return res.json(null); // user has no cart yet

//     res.json(cart);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
export const getCartByUser = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: "userId required" });
    }

    const cart = await DbCart.findOne({ userId });
    res.json(cart || { items: [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -----------------------------------------------
// SAVE / MERGE CART ITEMS
// -----------------------------------------------


// export const saveCart = async (req, res) => {
//   try {
//     const { cartId, userId, items } = req.body;
//     if (!cartId) return res.status(400).json({ message: "cartId required" });

//     let cart = await DbCart.findOne({ cartId });

//     if (!cart) {
//       cart = new DbCart({ cartId, userId: userId || null, items });
//       await cart.save();
//       return res.json({ success: true, message: "Cart created", cart });
//     }

// const cleanedItems = items.filter(i => i.product && i.product._id && i.product.name);

// cleanedItems.forEach((newItem) => {
//   const existing = cart.items.find(
//     (i) => i.product._id.toString() === newItem.product._id.toString() &&
//            i.color === (newItem.color || "")
//   );

//   if (existing) {
//     existing.quantity = newItem.quantity; // or += if you want cumulative
//     existing.product = {
//       _id: existing.product._id,
//       name: newItem.product.name || existing.product.name,
//       price: newItem.product.price ?? existing.product.price,
//       discountPrice: newItem.product.discountPrice ?? existing.product.discountPrice,
//       image: newItem.product.image || existing.product.image,
//     };
//   } else {
//     cart.items.push({
//       product: {
//         _id: newItem.product._id,
//         name: newItem.product.name || "",
//         price: newItem.product.price ?? 0,
//         discountPrice: newItem.product.discountPrice ?? 0,
//         image: newItem.product.image || "",
//       },
//       quantity: newItem.quantity,
//       color: newItem.color || "",
//     });
//   }
// });

//     cart.userId = userId || cart.userId;
//     await cart.save();
//     return res.json({ success: true, message: "Cart updated", cart });

//   } catch (err) {
//     console.error("SAVE CART ERROR:", err);
//     return res.status(500).json({ success: false, error: err.message });
//   }
// };
export const saveCart = async (req, res) => {
  try {
    const { cartId, userId, items } = req.body;
    if (!cartId) {
      return res.status(400).json({ message: "cartId required" });
    }

    // 🔑 FIND CART CORRECTLY
    let cart = userId
      ? await DbCart.findOne({ userId })   // logged-in user
      : await DbCart.findOne({ cartId });  // guest

    if (!cart) {
      cart = new DbCart({
        cartId,
        userId: userId || null,
        items: [],
      });
    }

    const cleanedItems = items.filter(
      (i) => i.product && i.product._id && i.product.name
    );

    cleanedItems.forEach((newItem) => {
      const existing = cart.items.find(
        (i) =>
          i.product._id.toString() === newItem.product._id.toString() &&
          i.color === (newItem.color || "")
      );

      if (existing) {
        existing.quantity = newItem.quantity;
        existing.product = {
          _id: newItem.product._id,
          name: newItem.product.name,
          price: newItem.product.price,
          discountPrice: newItem.product.discountPrice,
          image: newItem.product.image,
        };
      } else {
        cart.items.push({
          product: newItem.product,
          quantity: newItem.quantity,
          color: newItem.color || "",
        });
      }
    });

    // 🔒 LOCK CART TO USER
    if (userId) {
      cart.userId = userId;
    }

    await cart.save();

    res.json({ success: true, cart });
  } catch (err) {
    console.error("SAVE CART ERROR:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// -----------------------------------------------
// MERGE GUEST CART → USER CART AFTER LOGIN
// -----------------------------------------------
// export const assignUserToCart = async (req, res) => {
//   try {
//     const { userId, guestCartId } = req.body;

//     let userCart = await DbCart.findOne({ userId });
//     const guestCart = await DbCart.findOne({ cartId: guestCartId });

//     // If no guest cart → just return existing user cart
//     if (!guestCart) return res.json(userCart || null);

//     // If user has NO cart → convert guest cart into user cart
//     if (!userCart) {
//       guestCart.userId = userId;
//       await guestCart.save();
//       return res.json(guestCart);
//     }

//     // Merge guest → user cart
//     guestCart.items.forEach((g) => {
//       const match = userCart.items.find(
//         (i) => i.product._id === g.product._id && i.color === g.color
//       );

//       if (match) {
//         match.quantity += g.quantity;
//       } else {
//         userCart.items.push(g);
//       }
//     });

//     await userCart.save();

//     // delete old guest cart
//     await guestCart.deleteOne();

//     res.json(userCart);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
export const assignUserToCart = async (req, res) => {
  try {
    const { userId, guestCartId } = req.body;

    let userCart = await DbCart.findOne({ userId });
    const guestCart = await DbCart.findOne({ cartId: guestCartId });

    // If no guest cart → just return existing user cart
    if (!guestCart) return res.json(userCart || null);

    // If user has NO cart → convert guest cart into user cart
    if (!userCart) {
      guestCart.userId = userId;
      await guestCart.save();
      return res.json(guestCart);
    }

    // Merge guest → user cart
    guestCart.items.forEach((g) => {
      const match = userCart.items.find(
        (i) =>
          i.product._id.toString() === g.product._id.toString() && // 🔥 fixed here
          i.color === g.color
      );

      if (match) {
        match.quantity += g.quantity; // merge quantities
      } else {
        userCart.items.push(g);
      }
    });

    await userCart.save();

    // delete old guest cart
    await guestCart.deleteOne();

    res.json(userCart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
