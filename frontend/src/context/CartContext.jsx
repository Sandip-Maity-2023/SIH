import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('krishi_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('krishi_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (produce, quantity = 10) => {
    const produceId = produce._id || produce.id;
    const price = Number(produce.expectedPricePerKg || produce.price || produce.pricePerKg || 0);
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === produceId);
      if (existing) {
        return prev.map((item) =>
          item.id === produceId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...produce, id: produceId, price, pricePerKg: price, quantity }];
    });
  };

  const updateQuantity = (produceId, quantity) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === produceId ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (produceId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== produceId));
  };

  const clearCart = () => setCartItems([]);

  const subtotal = cartItems.reduce((acc, item) => acc + Number(item.price || item.pricePerKg || 0) * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        subtotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
