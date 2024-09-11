import React from 'react';
import ProductCard from './ProductCard/ProductCard';

// Define el componente Home que contiene una lista de ProductCards
function Home() {
    return (
        <body> {/* Contenedor principal del contenido */}
            <div class="articles"> {/* Contenedor de todos los artículos */}
                {/* Cada ProductCard representa un producto con su imagen, título, descripción y precio */}
                <ProductCard 
                    image="/PbMjzwcfYwJLRmy3k-c. chicken crispy.png" 
                    title="Combo Daves Doble" 
                    description="Hamburguesa con Doble Carne de 4Oz, Doble Queso Cheddar, Lechuga, Tomate."
                    price="8.950"
                />
                <ProductCard 
                    image="https://via.placeholder.com/150" 
                    title="Combo Baconator" 
                    description="Hamburguesa con Doble Carne de 4Oz, Bacon, Queso Cheddar, Lechuga, Tomate."
                    price="9.500"
                />
                <ProductCard 
                    image="https://via.placeholder.com/150" 
                    title="Combo Pollo Crispy" 
                    description="Pollo Crispy, Lechuga, Tomate, Queso Cheddar, Mayonesa."
                    price="7.800"
                />
                <ProductCard 
                    image="https://via.placeholder.com/150" 
                    title="Combo Veggie" 
                    description="Hamburguesa Veggie con Lechuga, Tomate, Queso Cheddar lore."
                    price="8.200"
                />
                <ProductCard 
                    image="https://via.placeholder.com/150" 
                    title="Combo Cheeseburger" 
                    description="Hamburguesa con Carne de 4Oz, Queso Cheddar, Pepinillos, Salsa."
                    price="6.950"
                />
                <ProductCard 
                    image="https://via.placeholder.com/150" 
                    title="Combo Nuggets" 
                    description="10 Nuggets de Pollo con Papas Fritas y Salsa a Elección."
                    price="5.900"
                />
            </div>
        </body>
    );
}

export default Home; // Exporta el componente Home para que pueda ser usado en otras partes del proyecto
