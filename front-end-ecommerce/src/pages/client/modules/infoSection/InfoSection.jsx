// InfoSection.jsx
import React from 'react';
import './InfoSection.css';
import background1 from '../../../../assets/client/images/info/background1.png';
import background2 from '../../../../assets/client/images/info/background2.png';
import background3 from '../../../../assets/client/images/info/background3.png';

const InfoSection = () => {
    return (
        <div className="container-info">
        {/* Parte 1 */}
        <section className="section-info">
            <div className="image-container-info">
            <img 
                src={background1} 
                alt="Background 1" 
                className="background-image-info"
            />
            <div className="overlay-info"></div>
            </div>
            <div className="content-wrapper-info">
            <div className="text-wrapper-info text-right-info">
                <h2 className="title-info title-light-info">
                Quienes Somos
                </h2>
                <p className="paragraph-info paragraph-light-info">
                En Buen Sabor OFRECEMOS comida rica y un lugar agradable para disfrutar. Desde el principio, nos hemos enfocado en hacer que cada visita sea especial y que te sientas a gusto. Vení y descubrí lo que hacemos con cada comida.
                </p>
            </div>
            </div>
        </section>

        {/* Parte 2 */}
        <section className="section-info">
            <div className="image-container-info">
            <img 
                src={background2} 
                alt="Background 2" 
                className="background-image-info"
            />
            <div className="overlay-info"></div>
            </div>
            <div className="content-wrapper-info">
            <div className="text-wrapper-info text-left-info">
                <h2 className="title-info title-dark-info">
                Que Hacemos
                </h2>
                <p className="paragraph-info paragraph-dark-info">
                Hacemos hamburguesas para sacarte una sonrisa. Ingredientes frescos, buen sabor y muchas ganas de que lO disfrutes. Simple y sin vueltas.
                </p>
            </div>
            </div>
        </section>

        {/* Parte 3 */}
        <section className="section-info">
            <div className="image-container-info">
            <img 
                src={background3} 
                alt="Background 3" 
                className="background-image-info"
            />
            <div className="overlay-info"></div>
            </div>
            <div className="content-wrapper-info">
            <div className="text-wrapper-info text-right-info">
                <h2 className="title-info title-light-info">
                Un Lugar Para Vos
                </h2>
                <p className="paragraph-info paragraph-light-info">
                Nuestro local es ideal para relajarte y disfrutar. No venís solo a comer, venís a pasar un buen rato, con amigos, familia o solo, PERO SIEMPRE acompañado de una buena hamburguesa.
                </p>
            </div>
            </div>
        </section>
        </div>
    );
};

export default InfoSection;