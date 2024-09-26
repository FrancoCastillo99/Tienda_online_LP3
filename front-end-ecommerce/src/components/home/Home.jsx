import React, { useState, useEffect } from 'react';
import ProductCardHome from '../productcard/ProductCardHome';
import ShoppingCart from '../shopping/ShoppingCart';
import './Home.css';

export default function Home() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Manejar el estado del scroll en el body cuando el carrito está abierto o cerrado
  useEffect(() => {
    if (isCartOpen) {
      // Añadir clase para deshabilitar el scroll
      document.body.classList.add('no-scroll');
    } else {
      // Remover clase para habilitar el scroll
      document.body.classList.remove('no-scroll');
    }

    // Limpiar el efecto cuando el componente se desmonte
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [isCartOpen]);

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const sections = [1, 2, 3, 4]; // Representa las secciones del slider

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev === sections.length - 1 ? 0 : prev + 1)); // Mueve a la siguiente sección o vuelve al inicio
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? sections.length - 1 : prev - 1)); // Mueve a la sección anterior o a la última
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
      <section className="slider-container">
        <article
          className="slider-wrapper"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {sections.map((section, index) => (
            <div key={index} className="slider-section">
              Sección {section}
            </div>
          ))}
        </article>

        {/* Flechas de navegación */}
        <button className="slider-arrow slider-arrow-left" onClick={handlePrevSlide}>
          &lt;
        </button>
        <button className="slider-arrow slider-arrow-right" onClick={handleNextSlide}>
          &gt;
        </button>
      </section>

      <section className="menu-content">
        <ProductCardHome className="card" />
      </section>
    </main>
  );
}
