import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [note, setNote] = useState(() => {
    try {
      return localStorage.getItem("cartNote") || "";
    } catch {
      return "";
    }
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("cartNote", note);
  }, [note]);

  const addToCart = (item) => {
    // check if same product/color/size exists
    const existing = cart.find(
      (x) =>
        x.productId === item.productId &&
        x.variantColor === item.variantColor &&
        x.size === item.size
    );

    if (existing) {
      setCart((prev) =>
        prev.map((x) =>
          x === existing ? { ...x, qty: x.qty + 1 } : x
        )
      );
    } else {
      setCart((prev) => [...prev, { ...item, qty: 1 }]);
    }
  };

  const updateQty = (item, qty) => {
    if (qty < 1) return;
    setCart((prev) =>
      prev.map((x) =>
        x === item ? { ...x, qty } : x
      )
    );
  };

  const removeFromCart = (item) => {
    setCart((prev) => prev.filter((x) => x !== item));
  };

  const value = { cart, addToCart, updateQty, removeFromCart, note, setNote };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}
