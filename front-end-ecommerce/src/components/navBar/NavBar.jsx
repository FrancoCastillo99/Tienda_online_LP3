import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ShoppingCart from '../shopping/ShoppingCart';
import menuIcon from '../../assets/images/navBar/menuIcon.png';
import ShopIcon from '../../assets/images/navBar/ShopIcon.png';
import './NavBar.css';

const NavBar = () => {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [navbarHeight, setNavbarHeight] = useState(0);

    useEffect(() => {
        // Obtener la altura del navbar cuando el componente se monta
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            setNavbarHeight(navbar.offsetHeight);
        }

        // Actualizar la altura si cambia el tamaño de la ventana
        const handleResize = () => {
            const navbar = document.querySelector('.navbar');
            if (navbar) {
                setNavbarHeight(navbar.offsetHeight);
            }
        };

        window.addEventListener('resize', handleResize);

        // Gestionar el scroll
        if (isCartOpen) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }

        return () => {
            document.body.classList.remove('no-scroll');
            window.removeEventListener('resize', handleResize);
        };
    }, [isCartOpen, isMenuOpen]);

    const toggleCart = () => {
        setIsCartOpen(!isCartOpen);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <>
            <nav className="navbar">
                <div className="navbar-content">
                    <div className="navbar-section left">
                        <Link to="/home" className="home-text">HOME</Link>
                    </div>
                    <div className="navbar-section center">
                        <button onClick={toggleMenu} className="menu-button">
                            <span className="menu-text">MENU</span>
                            <img src={menuIcon} alt="Menu Icon" className="menu-icon" />
                        </button>
                    </div>
                    <div className="navbar-section right">
                        <button onClick={toggleCart} className="cart-button">
                            <img src={ShopIcon} alt="Carrito" className="shop-icon" />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Menú lateral */}
            {isMenuOpen && (
                <div 
                    className="menu-overlay"
                    style={{ top: `${navbarHeight}px` }}
                >
                    <div className="menu-modal">
                        <button onClick={toggleMenu} className="close-menu-button">Cerrar &times;</button>
                        <ul>
                            <li><Link to="/" onClick={toggleMenu}>Perfil</Link></li>
                            <li><Link to="/productos" onClick={toggleMenu}>Home</Link></li>
                            <li><Link to="/contacto" onClick={toggleMenu}>Menu</Link></li>
                            <li><Link to="/contacto" onClick={toggleMenu}>Nosotros</Link></li>
                        </ul>
                    </div>
                </div>
            )}

            {/* Carrito de compras */}
            {isCartOpen && (
                <div className="cart-overlay">
                    <div className="cart-modal">
                        <button onClick={toggleCart} className="close-cart-button">&times;</button>
                        <ShoppingCart />
                    </div>
                </div>
            )}
        </>
    );
};

export default NavBar;