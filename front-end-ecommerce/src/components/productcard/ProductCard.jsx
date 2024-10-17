import React, { useContext } from 'react';
import { CartContext } from '../../context/CartContext';
import './ProductCard.css';

function ProductCard({ product, isLoading }) {
  const { addItemToCart } = useContext(CartContext);

  if (isLoading) {
    return <article className="loading">Cargando...</article>;
  }

  if (!product) {
    return null;
  }

  return (
    <article>
      <figure>
        <img 
          src={product.imagenUrl} 
          alt={product.nombre} 
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/placeholder.png'; // Asegúrate de tener una imagen de placeholder
          }}
        />
      </figure>
      <div className="article-preview">
        <h2>{product.nombre}</h2>
        <p>{product.descripcion}</p>
        <div className="article-buy">
          <div className="article-price">${product.precio.toFixed(2)}</div>
          <button className="article-btn" onClick={() => addItemToCart(product)}>
            🛒 Agregar
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;