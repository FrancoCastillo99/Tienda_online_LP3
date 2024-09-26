import React from 'react';
import ProductCard from './ProductCard';

// Importa las imágenes desde la carpeta assets
import s1 from '../../assets/images/cards/s1.png';
import s2 from '../../assets/images/cards/s2.png';
import s3 from '../../assets/images/cards/s3.png';
import s4 from '../../assets/images/cards/s4.png';

// Define el componente Home que contiene una lista de ProductCards
function ProductCardHome() {
    const products = [
        {
            id: 1,
            image: s1,
            title: "smashic",
            description: "Carne de res, pan de hamburguesa, queso (cheddar, americano, etc.), lechuga, tomate, cebolla, pepinillos, ketchup, mostaza, mayonesa.",
            price: "20000"
        },
        {
            id: 2,
            image: s2 ,
            title: "smashes",
            description: "Carne de res, pan de hamburguesa, queso (cheddar, americano, etc.), lechuga, tomate, cebolla, pepinillos, ketchup, mostaza, mayonesa.",
            price: "10.500"
        },
        {
            id: 3,
            image: s3 ,
            title: "Smash bros",
            description: "Carne de res, pan de hamburguesa, queso (cheddar, americano, etc.), lechuga, tomate, cebolla, pepinillos, ketchup, mostaza, mayonesa.",
            price: "10000"
        },
        {
            id: 4,
            image: s4,
            title: "S-bros",
            description: "Carne de res, pan de hamburguesa, queso (cheddar, americano, etc.), lechuga, tomate, cebolla, pepinillos, ketchup, mostaza, mayonesa.",
            price: "10000"
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