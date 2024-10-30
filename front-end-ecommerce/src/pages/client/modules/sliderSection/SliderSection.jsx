import React, { useState } from 'react';
import './SliderSection.css';

import s1 from '../../../../assets/client/images/slider/HamburguesaOne.png';
import s2 from '../../../../assets/client/images/slider/HamburguesaTwo.png';
import s3 from '../../../../assets/client/images/slider/HamburguesaThree.png';
import s4 from '../../../../assets/client/images/slider/HamburguesaFour.png';

export default function SliderSectionHome() {
    const [currentSlide, setCurrentSlide] = useState(0);
    
    const sections = [
        {
            id: 1,
            title: 'smashic',
            image: s1,
            subtitle: '#1',
            paragraph1: 'ingredientes',
            paragraph2: 'Jamon, cebolla, cheddar, triple carne',
        },
        {
            id: 2,
            title: 'smash bros',
            image: s2,
            subtitle: '#2',
            paragraph1: 'ingredientes',
            paragraph2: 'Jamon, cebolla, cheddar, triple carne',
        },
        {
            id: 3,
            title: 's-smash',
            image: s3,
            subtitle: '#3',
            paragraph1: 'ingredientes',
            paragraph2: 'Jamon, cebolla, cheddar, triple carne',
        },
        {
            id: 4,
            title: 'smashes',
            image: s4,
            subtitle: '#4',
            paragraph1: 'ingredientes',
            paragraph2: 'Jamon, cebolla, cheddar, triple carne',
        },
    ];

    const handleNextSlide = () => {
        setCurrentSlide((prev) => (prev === sections.length - 1 ? 0 : prev + 1));
    };

    const handlePrevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? sections.length - 1 : prev - 1));
    };

    const SliderSection = ({ content }) => {
        return (
            <div className="slider-section">
                <div className="center-container">
                    <div className="title-image-container">
                        <h1 className="section-title">{content.title}</h1>
                        <img 
                            src={content.image} 
                            alt={content.title} 
                            className="section-image" 
                        />
                    </div>
                </div>

                <div className="bottom-container">
                    <div className="subheader-container">
                        <h2>{content.subtitle}</h2>
                    </div>

                    <div className="paragraphs-container">
                        <p>{content.paragraph1}</p>
                        <p>{content.paragraph2}</p>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <section className="slider-container">
            <article
                className="slider-wrapper"
                style={{ transform: `translateX(-${currentSlide * 100}vw)` }}
            >
                {sections.map((section) => (
                    <SliderSection key={section.id} content={section} />
                ))}
            </article>

            <div className="arrows-container">
                <button 
                    className="slider-arrow slider-arrow-left" 
                    onClick={handlePrevSlide}
                    aria-label="Previous slide"
                >
                </button>
                <button 
                    className="slider-arrow slider-arrow-right" 
                    onClick={handleNextSlide}
                    aria-label="Next slide"
                >
                </button>
            </div>
        </section>
    );
}