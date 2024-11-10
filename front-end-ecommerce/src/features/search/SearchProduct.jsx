import React, { useContext } from 'react';
import { CartContext } from '../shoppingCart/CartContext';
import './SearchProduct.css';

function SearchProductCard({ product }) {
    const { addItemToCart } = useContext(CartContext);

    if (!product) {
        return <div>No se encontró el producto</div>;
    }

    return (
        <div className='search-product-card'>
            <div className="search-product-content">
                <div className="search-product-image">
                    <img 
                        src={product.imagenUrl} 
                        alt={product.nombre} 
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/placeholder.png';
                        }}
                    />
                </div>
                <div className="search-product-info">
                    <h2 className="search-product-title">{product.nombre}</h2>
                    <p className="search-product-description">{product.descripcion}</p>
                    <div className="search-product-price-section">
                        <p className="search-product-price">${product.precio.toFixed(2)}</p>
                        <button 
                            className="search-add-to-cart-button"
                            onClick={() => addItemToCart(product)}
                        >
                            🛒 Agregar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SearchProductCard;