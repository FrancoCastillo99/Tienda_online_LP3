import { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const savedCartItems = localStorage.getItem('cartItems');
    return savedCartItems ? JSON.parse(savedCartItems) : [];
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addItemToCart = (product) => {
    setCartItems((prevItems) => {
      const itemExists = prevItems.find(item => item.titulo === product.titulo); // Cambiado a titulo
      if (itemExists) {
        return prevItems.map(item => 
          item.titulo === product.titulo ? { ...item, cantidad: item.cantidad + 1 } : item // Cambiado a cantidad
        );
      }
      return [...prevItems, { ...product, cantidad: 1 }]; // Cambiado a cantidad
    });
  };

  const removeItem = (titulo) => { // Cambiado a titulo
    setCartItems((prevItems) => prevItems.filter(item => item.titulo !== titulo)); // Cambiado a titulo
  };

  const updateQuantity = (titulo, newQuantity) => { // Cambiado a titulo
    if (newQuantity < 0) return; // Evitar cantidades negativas
    setCartItems((prevItems) =>
      prevItems.map(item =>
        item.titulo === titulo ? { ...item, cantidad: newQuantity } : item // Cambiado a cantidad
      )
    );
  };

  return (
    <CartContext.Provider value={{ cartItems, addItemToCart, removeItem, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
}
