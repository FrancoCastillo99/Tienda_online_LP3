import React, { useContext, useEffect, useState } from 'react';
import { CartContext } from '../shoppingCart/CartContext';
import './ProductCard.css';

function ProductCard({ categoria }) {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { addItemToCart } = useContext(CartContext);

    useEffect(() => {
        const fetchProducts = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/productos/categoria/${categoria}`);
            if (!response.ok) {
            throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            setError("Error al cargar los productos");
            console.error("Error buscando productos: ", error);
        } finally {
            setIsLoading(false);
        }
        }
        
        fetchProducts();
    }, [categoria]);

    if (isLoading) {
        return <div>Cargando productos...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className='card'>
            <div className="articles">
                {products.map((product) => (
                <article key={product.id}>
                    <figure>
                        <img 
                            src={product.imagenUrl} 
                            alt={product.nombre} 
                            onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/placeholder.png';
                            }}
                        />
                    </figure>
                    <div className="article-preview">
                        <h2>{product.nombre}</h2>
                        <p>{product.descripcion}</p>
                        {product.stock === 0 && (
                            <p className="out-of-stock-message">Producto agotado</p>
                        )}
                        <div className="article-buy">
                            <div className="article-price">${product.precio.toFixed(2)}</div>
                            <button 
                                className={`article-btn ${product.stock === 0 ? 'disabled' : ''}`}
                                onClick={() => addItemToCart(product)}
                                disabled={product.stock === 0}
                            >
                                {product.stock === 0 ? 'Sin stock' : '🛒 Agregar'}
                            </button>
                        </div>
                    </div>
                </article>
                ))}
            </div>
        </div>
    );
}

export default ProductCard;