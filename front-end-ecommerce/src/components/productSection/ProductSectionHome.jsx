import React, { useState } from 'react';
import './ProductSection.css';
import ProductCard from '../product/ProductCard';

export default function MenuInteractivo() {
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('HAMBURGUESAS');
    const [animating, setAnimating] = useState(false);

    const categorias = ['HAMBURGUESAS', 'PAPAS FRITAS', 'BEBIDAS'];

    // Mapeo de categorías del menú a categorías de la API
    const categoriaToApi = {
        'HAMBURGUESAS': 'Hamburguesa',
        'PAPAS FRITAS': 'Papas',
        'BEBIDAS': 'Bebida'
    };

    const handleCategoriaClick = (categoria) => {
        if (categoria !== categoriaSeleccionada) {
            setAnimating(true);
            setTimeout(() => {
                setCategoriaSeleccionada(categoria);
                setAnimating(false);
            }, 300);
        }
    };

    return (
        <section className='menu-content'>
            <div className="contenedor">
                <h1 className="titulo">MENÚ</h1>
                <div className="barra">
                    {categorias.map((categoria) => (
                        <div key={categoria} className="categoria-container">
                            <button
                                onClick={() => handleCategoriaClick(categoria)}
                                className={`boton ${
                                    categoria === categoriaSeleccionada ? 'boton-seleccionado' : 'boton-no-seleccionado'
                                }`}
                            >
                                {categoria}
                            </button>
                            {categoria === categoriaSeleccionada && (
                                <div className="indicador-container">
                                    <div className="indicador"></div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <div className={`contenido-animado ${animating ? 'fade' : ''}`}>
                    <div className="contenido">
                        <ProductCard categoria={categoriaToApi[categoriaSeleccionada]} />
                    </div>
                </div>
            </div>
        </section>    
    );
}