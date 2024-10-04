import React, { useContext } from 'react';
import { CartContext } from '../../context/CartContext';
import './ProductCard.css';



function ProductCard({ product, isLoading }) {
  const { addItemToCart } = useContext(CartContext);

  return (
    <article>
      <figure>
        <img src={product.imagen} alt={product.titulo} />
      </figure>
      <div className="article-preview">
        <h2>{product.titulo}</h2>
        <p>{product.descripcion}</p>
        <div className="article-buy">
          <div className="article-price">${product.precio}</div>
          <button className="article-btn" onClick={() => addItemToCart(product)}>🛒 Agregar</button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
