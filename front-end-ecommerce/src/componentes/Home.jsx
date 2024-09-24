import React, { useState } from 'react';
import ProductCardHome from './ProductCardHome';
import ShoppingCart from './ShoppingCart';
import './Home.css';

export default function Home() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  return (
    <div className="home-container">
      <header className="header">
        <h1>Mi Tienda</h1>
        <button onClick={toggleCart} className="cart-button" aria-label="Abrir carrito">
          🛒 Carrito
        </button>
      </header>

      <main className="main-content">
        <ProductCardHome />
      </main>

      {isCartOpen && (
        <div className="cart-overlay">
          <div className="cart-modal">
            <button onClick={toggleCart} className="close-cart-button">
              &times;
            </button>
            <ShoppingCart />
          </div>
        </div>
      )}
    </div>
  );
}