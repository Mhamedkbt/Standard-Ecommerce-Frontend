// src/context/CartContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const raw = localStorage.getItem("cart_v1");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("cart_v1", JSON.stringify(cartItems));
    } catch {}
  }, [cartItems]);

  // Helper: find index of item by id
  const findIndex = (id) => cartItems.findIndex((it) => String(it.id) === String(id));

  // Add item to cart
  const addItem = (product, qty = 1, callback) => {
    if (!product || !product.id) return;

    setCartItems((prev) => {
      const i = prev.findIndex((p) => String(p.id) === String(product.id));
      if (i !== -1) {
        const copy = [...prev];
        copy[i] = { ...copy[i], quantity: copy[i].quantity + qty };
        return copy;
      }

      const newItem = {
        id: product.id,
        name: product.name || "Unnamed Product",
        price: Number(product.price || 0),
        image: (product.images && product.images[0]?.url) || product.image || null,
        quantity: qty,
      };
      return [...prev, newItem];
    });

    if (callback) callback();
  };

  // Remove specific quantity of item
  const removeItem = (productId, qty = 1) => {
    setCartItems((prev) => {
      const i = findIndex(productId);
      if (i === -1) return prev;
      const copy = [...prev];
      const newQty = copy[i].quantity - qty;
      if (newQty > 0) {
        copy[i] = { ...copy[i], quantity: newQty };
        return copy;
      }
      // Remove entirely if quantity reaches 0
      copy.splice(i, 1);
      return copy;
    });
  };

  // Remove entire product from cart
  const removeProduct = (productId) => {
    setCartItems((prev) => prev.filter((p) => String(p.id) !== String(productId)));
  };

  // Clear all cart items
  const clearCart = () => setCartItems([]);

  // Total items in cart
  const totalItems = useMemo(
    () => cartItems.reduce((s, it) => s + (it.quantity || 0), 0),
    [cartItems]
  );

  // Total price of cart
  const cartTotal = useMemo(
    () => cartItems.reduce((s, it) => s + (it.price || 0) * (it.quantity || 0), 0),
    [cartItems]
  );

  // Return a fully functional context
  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalItems,
        cartTotal,
        addItem,
        removeItem,
        removeProduct,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Hook to use cart anywhere
export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
