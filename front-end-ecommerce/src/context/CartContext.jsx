import { createContext, useState } from 'react';

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  const addItemToCart = (product) => {
    setCartItems((prevItems) => {
      const itemExists = prevItems.find(item => item.title === product.title);
      if (itemExists) {
        return prevItems.map(item => 
          item.title === product.title ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const removeItem = (title) => {
    setCartItems((prevItems) => prevItems.filter(item => item.title !== title));
  };

  const updateQuantity = (title, newQuantity) => {
    setCartItems((prevItems) =>
      prevItems.map(item =>
        item.title === title ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  return (
    <CartContext.Provider value={{ cartItems, addItemToCart, removeItem, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
}
