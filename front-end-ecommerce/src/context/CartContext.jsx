import { createContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const savedCartItems = localStorage.getItem('cartItems');
    return savedCartItems ? JSON.parse(savedCartItems) : [];
  });

  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const newTotal = cartItems.reduce((total, item) => total + item.cantidad, 0);
    setTotalItems(newTotal);
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Configuración básica del toast
  const toastConfig = {
    duration: 1500,
    position: 'bottom-right',
  };

  const addItemToCart = (product) => {
    const itemExists = cartItems.find(item => item.nombre === product.nombre);
    
    if (itemExists) {
      setCartItems(prevItems => 
        prevItems.map(item => 
          item.nombre === product.nombre 
            ? { ...item, cantidad: item.cantidad + 1 } 
            : item
        )
      );
    } else {
      setCartItems(prevItems => [...prevItems, { ...product, cantidad: 1 }]);
    }

    // Mostrar toast después de actualizar el estado
    toast.success(
      itemExists 
        ? `Se agregó otro ${product.nombre}` 
        : `${product.nombre} agregado al carrito`,
      toastConfig
    );
  };

  const removeItem = (nombre) => {
    // Encontrar el item antes de eliminarlo
    const itemToRemove = cartItems.find(item => item.nombre === nombre);
    
    if (itemToRemove) {
      setCartItems(prevItems => prevItems.filter(item => item.nombre !== nombre));
      toast.error(`${itemToRemove.nombre} eliminado del carrito`, toastConfig);
    }
  };

  const updateQuantity = (nombre, newQuantity) => {
    if (newQuantity < 0) return;
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.nombre === nombre ? { ...item, cantidad: newQuantity } : item
      )
    );
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addItemToCart, 
      removeItem, 
      updateQuantity,
      totalItems 
    }}>
      {children}
    </CartContext.Provider>
  );
}