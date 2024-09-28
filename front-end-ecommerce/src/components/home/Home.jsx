// Home.jsx

import React, { useState, useEffect } from 'react';
import ProductCardHome from '../productcard/ProductCardHome';
import ShoppingCart from '../shopping/ShoppingCart';
import SliderSectionHome from '../sliderSection/SliderSectionHome'; // Importa tu componente Slider
import './Home.css';

export default function Home() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    if (isCartOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [isCartOpen]);

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  return (
    <main className="home-container">
      <header className="header">
        <button onClick={toggleCart} className="cart-button" aria-label="Abrir carrito">
          🛒 Carrito
        </button>
      </header>

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

      <section className="banner">
        <div className="content-banner">
          <h1>BUEN SABOR</h1>
          <p>LO MEJOR PARA VOS</p>
        </div>
      </section>

      {/* Slider Section */}
      <SliderSectionHome />
  
      <section className="menu-content">
        <ProductCardHome className="card" />
      </section>
    </main>
  );
}
