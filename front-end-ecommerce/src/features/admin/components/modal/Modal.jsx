import React from 'react'
import "./Modal.css"
import cerrarIcon from "../../../../assets/admin/icons/svgs/cerrarIcon.svg";
const Modal = ({ isOpen, onClose, titulo, children, contenedorClass,bodyClass}) => {
    if (!isOpen) return null; // No mostrar el modal si isOpen es false

    return (
        <div className="modal" onClick={onClose}>
            <div className={contenedorClass} onClick={(e) => e.stopPropagation()}>
                <div className='header-modal'>
                    <h2>{titulo}</h2>
                    <button className='close' onClick={onClose}>
                        <img src={cerrarIcon} alt="cerrar" />
                    </button>
                </div>
                <div className={bodyClass}>
                    {children} {/* Contenido del modal */}
                </div>
            </div>
        </div>
    );
};

export default Modal