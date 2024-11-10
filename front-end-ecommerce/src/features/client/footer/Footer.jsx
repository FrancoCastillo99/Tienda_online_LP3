// Footer.jsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faXTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <span className="footer-title">
                    LOCAL
                </span>
                
                <span className="footer-address">
                    Av. San Martín 908, M5500 Mendoza
                </span>
                
                <div className="social-icons">
                    <a href="#" className="social-icon">
                        <FontAwesomeIcon icon={faXTwitter} />
                    </a>
                    <a href="#" className="social-icon">
                        <FontAwesomeIcon icon={faFacebook} />
                    </a>
                    <a href="#" className="social-icon">
                        <FontAwesomeIcon icon={faInstagram} />
                    </a>
                </div>
                
                <span className="footer-copyright">
                    ©2024 Buen Sabor Todos los derechos reservados
                </span>
            </div>
        </footer>
    );
};

export default Footer;