import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext.jsx';
import './ProductCard.css';

function ProductCard({ product }) {
  const { addItemToCart } = useContext(CartContext);

  return (
    <article>
      <figure>
        <img src={product.image} alt={product.title} />
      </figure>
      <div className="article-preview">
        <h2>{product.title}</h2>
        <p>{product.description}</p>
      </div>
      <div className="article-buy">
        <div className="article-price">${product.price}</div>
        <button className="article-btn" onClick={() => addItemToCart(product)}>🛒 Agregar</button>
      </div>
    </article>
  );
}

export default ProductCard;
