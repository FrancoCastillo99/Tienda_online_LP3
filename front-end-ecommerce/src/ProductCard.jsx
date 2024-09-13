import React from 'react'; // Importa la biblioteca React
import './ProductCard.css'; // Importa los estilos CSS para el componente

// Define el componente funcional ProductCard
function ProductCard({ image, title, description, price }) {
    return (
        <article> {/* Contenedor del artículo */}
            <figure> {/* Contenedor de la imagen */}
                <img src={image} alt={title} /> {/* Imagen del producto */}
            </figure>
            <div class="article-preview"> {/* Contenedor de la previsualización del artículo */}
                <h2>{title}</h2> {/* Título del artículo */}
                <p>{description}</p> {/* Descripción del artículo */}
            </div>
            <div class="article-buy"> {/* Contenedor de la sección de compra */}
                <div class="article-price">${price}</div> {/* Precio del producto */}
                <button class="article-btn">🛒 Agregar</button> {/* Botón para agregar al carrito */}
            </div>
        </article>
    );
}

export default ProductCard; // Exporta el componente para que pueda ser usado en otras partes del proyecto