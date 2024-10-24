import { createContext, useState, useEffect, useCallback } from 'react';
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

  // Usando useCallback para memorizar las funciones
  const addItemToCart = useCallback((product) => {
    setCartItems((prevItems) => {
      const itemExists = prevItems.find(item => item.nombre === product.nombre);
      
      // Creamos el nuevo estado antes de mostrar la notificación
      let newItems;
      if (itemExists) {
        newItems = prevItems.map(item => 
          item.nombre === product.nombre ? { ...item, cantidad: item.cantidad + 1 } : item
        );
        // Notificación después de confirmar que el item existe
        toast.success(`Se agregó otro ${product.nombre} al carrito`, {
          id: `add-${product.nombre}-${Date.now()}`, // ID único
          duration: 2000,
          position: 'bottom-right',
          style: {
            background: '#333',
            color: '#fff',
            padding: '16px',
          },
          icon: '🛍️',
        });
      } else {
        newItems = [...prevItems, { ...product, cantidad: 1 }];
        // Notificación para nuevo producto
        toast.success(`${product.nombre} agregado al carrito`, {
          id: `new-${product.nombre}-${Date.now()}`, // ID único
          duration: 2000,
          position: 'bottom-right',
          style: {
            background: '#333',
            color: '#fff',
            padding: '16px',
          },
          icon: '🛍️',
        });
      }
      
      return newItems;
    });
  }, []); // Sin dependencias ya que no usa valores externos

  const removeItem = useCallback((nombre) => {
    setCartItems((prevItems) => {
      const itemToRemove = prevItems.find(item => item.nombre === nombre);
      if (itemToRemove) {
        // Notificación con ID único
        toast.error(`${itemToRemove.nombre} eliminado del carrito`, {
          id: `remove-${nombre}-${Date.now()}`,
          duration: 2000,
          position: 'bottom-right',
          style: {
            background: '#333',
            color: '#fff',
            padding: '16px',
          },
          icon: '🗑️',
        });
      }
      return prevItems.filter(item => item.nombre !== nombre);
    });
  }, []); // Sin dependencias

  const updateQuantity = useCallback((nombre, newQuantity) => {
    if (newQuantity < 0) return;
    setCartItems((prevItems) =>
      prevItems.map(item =>
        item.nombre === nombre ? { ...item, cantidad: newQuantity } : item
      )
    );
  }, []);

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