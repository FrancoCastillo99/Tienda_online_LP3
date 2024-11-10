// Boton.jsx
import React from 'react';
import "./Boton.css"

const Boton = ({ tipo = "button", onClick = () => {}, nameClass, texto, change, img}) => {
    return (
        change ? 
        <button
        type={tipo}
        onClick={onClick}
        className={nameClass}
        >
            <img src={img} alt="filtro" />
        </button> :
        <button
        type={tipo}
        onClick={onClick}
        className={nameClass}
        >
        {texto}
        </button>
    );
};

export default Boton;
