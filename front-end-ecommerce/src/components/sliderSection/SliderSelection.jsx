// SliderSection.jsx
import React from 'react';
import './SliderSection.css';

export default function SliderSection({ content }) {
    return (
        <div className="slider-section">
            {/* Contenedor para el título y la imagen */}
            <div className="header-container">
                <h1 className="section-title">{content.title}</h1>
                <img src={content.image} alt={content.title} className="section-image" />
            </div>

            {/* Encapsulando el título h2 */}
            <div className="subheader-container">
                <h2>{content.subtitle}</h2>
            </div>

            {/* Encapsulando dos párrafos */}
            <div className="paragraphs-container">
                <p>{content.paragraph1}</p>
                <p>{content.paragraph2}</p>
            </div>
        </div>
    );
}

