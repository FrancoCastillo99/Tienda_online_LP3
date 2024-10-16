// SliderSectionHome.jsx

import React, { useState } from 'react';
import SliderSection from './sliderSelection';

import s1 from '../../assets/images/slider/hamburguesaOne.png';
import s2 from '../../assets/images/slider/hamburguesaTwo.png';
import s3 from '../../assets/images/slider/hamburguesaThree.png';
import s4 from '../../assets/images/slider/hamburguesaFour.png';

export default function SliderSectionHome() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const sections = [
        {
            id: 1,
            title: 'smashic',
            image: s1,
            subtitle: '#1',
            paragraph1: 'ingredientes',
            paragraph2: 'Jamon,  cebolla , cheddar, triple carne',
        },
        {
            id: 2,
            title: 'smash bros',
            image: s2,
            subtitle: '#2',
            paragraph1: 'ingredientes',
            paragraph2: 'Jamon,  cebolla , cheddar, triple carne',
        },
        {
            id: 3,
            title: 's-smash',
            image: s3,
            subtitle: '#3',
            paragraph1: 'ingredientes',
            paragraph2: 'Jamon,  cebolla , cheddar, triple carne',
        },
        {
            id: 4,
            title: 'smashes',
            image: s4,
            subtitle: '#4',
            paragraph1: 'ingredientes',
            paragraph2: 'Jamon,  cebolla , cheddar, triple carne',
        },
    ];

    const handleNextSlide = () => {
        setCurrentSlide((prev) => (prev === sections.length - 1 ? 0 : prev + 1));
    };

    const handlePrevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? sections.length - 1 : prev - 1));
    };

    return (
        <section className="slider-container">
            <article
                className="slider-wrapper"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
                {sections.map((section) => (
                    <SliderSection key={section.id} content={section} />
                ))}
            </article>

            <button className="slider-arrow slider-arrow-left" onClick={handlePrevSlide}>
            </button>
            <button className="slider-arrow slider-arrow-right" onClick={handleNextSlide}>
            </button>
        </section>
    );
}
