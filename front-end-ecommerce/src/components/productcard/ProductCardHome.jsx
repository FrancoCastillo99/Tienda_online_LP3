import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';

function ProductCardHome() {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/productos/categoria/Papas');
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
    }, []);

    if (isLoading) {
        return <div>Cargando productos...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <section className='menu-content'>
            <div className='card'>
                <div className="articles"> 
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default ProductCardHome;