import React, { useState, useEffect, useRef } from 'react';
import SearchProductCard from './SearchProduct';
import './SearchBar.css';

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [isSearchResultsVisible, setIsSearchResultsVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const searchRef = useRef(null);

    useEffect(() => {
        if (selectedProduct) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [selectedProduct]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/productos');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        if (searchTerm) {
            const filtered = products.filter(product => 
                product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.precio.toString().includes(searchTerm)
            );
            setFilteredProducts(filtered);
            setIsSearchResultsVisible(true);
        } else {
            setFilteredProducts([]);
            setIsSearchResultsVisible(false);
        }
    }, [searchTerm, products]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsSearchResultsVisible(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleProductClick = (product) => {
        setSelectedProduct(product);
        setSearchTerm('');
        setIsSearchResultsVisible(false);
    };

    const handleCloseModal = () => {
        setSelectedProduct(null);
    };

    return (
        <>
            <div className="search-wrapper">
                <div className="search-container" ref={searchRef}>
                    <div className="search-input-container">
                        <input
                            type="text"
                            placeholder="¿Qué estás buscando?"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                        {searchTerm && (
                            <button 
                                className="clear-search"
                                onClick={() => setSearchTerm('')}
                            >
                                ×
                            </button>
                        )}
                    </div>
                    
                    {isSearchResultsVisible && filteredProducts.length > 0 && (
                        <div className="search-results">
                            {filteredProducts.map((product) => (
                                <div 
                                    key={product.id} 
                                    className="search-result-item"
                                    onClick={() => handleProductClick(product)}
                                >
                                    <img 
                                        src={product.imagenUrl} 
                                        alt={product.nombre}
                                        className="search-result-image"
                                    />
                                    <div className="search-result-info">
                                        <span className="search-result-name">{product.nombre}</span>
                                        <span className="search-result-price">${product.precio.toFixed(2)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {selectedProduct && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content-product" onClick={e => e.stopPropagation()}>
                        <SearchProductCard 
                            product={selectedProduct} 
                            onClose={handleCloseModal}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default SearchBar;