import React from 'react';
import ProductCard from './ProductCard';

// Importa las imágenes desde la carpeta assets
import comboPolloCrispyImage from '../assets/images/cards/ComboPolloCrispyCard.png';

// Define el componente Home que contiene una lista de ProductCards
function ProductCardHome() {
    const products = [
        {
            id: 1,
            image: "https://via.placeholder.com/150",
            title: "Combo Daves Doble",
            description: "Hamburguesa con Doble Carne de 4Oz, Doble Queso Cheddar, Lechuga, Tomate.",
            price: "8.950"
        },
        {
            id: 2,
            image: "https://via.placeholder.com/150",
            title: "Combo Baconator",
            description: "Hamburguesa con Doble Carne de 4Oz, Bacon, Queso Cheddar, Lechuga, Tomate.",
            price: "9.500"
        },
        {
            id: 3,
            image: comboPolloCrispyImage,
            title: "Combo Pollo Crispy",
            description: "Pollo Crispy, Lechuga, Tomate, Queso Cheddar, Mayonesa.",
            price: "7.800"
        },
        {
            id: 4,
            image: "https://via.placeholder.com/150",
            title: "Combo Veggie",
            description: "Hamburguesa Veggie con Lechuga, Tomate, Queso Cheddar.",
            price: "8.200"
        },
        {
            id: 5,
            image: "https://via.placeholder.com/150",
            title: "Combo Cheeseburger",
            description: "Hamburguesa con Carne de 4Oz, Queso Cheddar, Pepinillos, Salsa.",
            price: "6.950"
        },
        {
            id: 6,
            image: "https://via.placeholder.com/150",
            title: "Combo Nuggets",
            description: "10 Nuggets de Pollo con Papas Fritas y Salsa a Elección.",
            price: "5.900"
        }
    ];

    return (
        <div className="articles"> {/* Contenedor de todos los artículos */}
            {products.map((product, index) => (
                <ProductCard key={index} product={product} />
            ))}
        </div>
    );
}

export default ProductCardHome;