import React, { useState, useEffect, useContext } from 'react'; // Añadido useContext
import { Link } from 'react-router-dom';
import { CartContext } from '../../context/CartContext'; // Ajusta la ruta según tu estructura
import ShoppingCart from '../shopping/ShoppingCart';
import menuIcon from '../../assets/images/navBar/menuIcon.png';
import cancelIcon from '../../assets/images/navBar/cancel.png';
import ShopIcon from '../../assets/images/navBar/ShopIcon.png';
import './NavBar.css';

const NavBar = () => {
    const { totalItems } = useContext(CartContext); // Obtenemos totalItems del contexto
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [navbarHeight, setNavbarHeight] = useState(0);

    useEffect(() => {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            setNavbarHeight(navbar.offsetHeight);
        }

        const handleResize = () => {
            const navbar = document.querySelector('.navbar');
            if (navbar) {
                setNavbarHeight(navbar.offsetHeight);
            }
        };

        window.addEventListener('resize', handleResize);

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
        // Añadir/remover la clase no-scroll al body
        if (!isCartOpen) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleHomeClick = () => {
        if (location.pathname === '/home') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <>
            <nav className="navbar">
                <div className="navbar-content">
                    <div className="navbar-section left">
                        <Link to="/home" className="home-text" onClick={handleHomeClick}>HOME</Link>
                    </div>
                    <div className="navbar-section center">
                        <button onClick={toggleMenu} className="menu-button">
                            <span className="menu-text">MENU</span>
                            <img src={menuIcon} alt="Menu Icon" className="menu-icon" />
                        </button>
                    </div>
                    <div className="navbar-section right">
                        <button onClick={toggleCart} className="cart-button">
                            <div className="cart-icon-container">
                                <img src={ShopIcon} alt="Carrito" className="shop-icon" />
                                {totalItems > 0 && (
                                    <span className="cart-items-count">{totalItems}</span>
                                )}
                            </div>
                        </button>
                    </div>
                </div>
            </nav>

            {/* El resto del código permanece igual */}
            {isMenuOpen && (
                <div 
                    className="menu-overlay"
                    style={{ top: `${navbarHeight}px` }}
                >
                    <div className="menu-modal">
                        <button onClick={toggleMenu} className="close-menu-button">
                            <span className="close-text">CERRAR</span>
                            <img src={cancelIcon} alt="close Icon" className="close-menu" />
                        </button>
                        <ul>
                            <li><Link to="/profile" onClick={toggleMenu}>PERFIL</Link></li>
                            <li><Link to="/Home" onClick={toggleMenu}>HOME</Link></li>
                            <li><Link to="/Menu" onClick={toggleMenu}>MENU</Link></li>
                            <li><Link to="/Menu" onClick={toggleMenu}>CARRITO</Link></li>
                            <li><Link to="/Nosotros" onClick={toggleMenu}>NOSTROS</Link></li>
                        </ul>
                    </div>
                </div>
            )}

            {isCartOpen && (
                <ShoppingCart onClose={toggleCart} />
            )}
        </>
    );
};

export default NavBar;