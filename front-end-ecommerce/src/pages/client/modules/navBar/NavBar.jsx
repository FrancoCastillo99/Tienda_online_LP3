import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom'; // Añadido useLocation
import { CartContext } from '../../context/CartContext';
import ShoppingCart from '../../components/shopping/ShoppingCart';
import SearchBar from '../../components/searchBar/SearchBar';
import menuIcon from '../../../../assets/client/icons/navBar/menuIcon.png';
import cancelIcon from '../../../../assets/client/icons/navBar/cancel.png';
import ShopIcon from '../../../../assets/client/icons/navBar/ShopIcon.png';
import searchIcon from '../../../../assets/client/icons/navBar/searchIcon.png';
import './NavBar.css';

const NavBar = () => {
    const { totalItems } = useContext(CartContext);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [navbarHeight, setNavbarHeight] = useState(0);
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const location = useLocation(); // Hook para obtener la ubicación actual

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
        if (!isCartOpen) {
            setIsMenuOpen(false);
            setIsSearchVisible(false);
        }
        setIsCartOpen(!isCartOpen);
        if (!isCartOpen) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }
    };

    const toggleMenu = () => {
        if (!isMenuOpen) {
            setIsCartOpen(false);
            setIsSearchVisible(false);
        }
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleSearch = () => {
        if (!isSearchVisible) {
            setIsCartOpen(false);
            setIsMenuOpen(false);
        }
        setIsSearchVisible(!isSearchVisible);
    };

    const handleHomeClick = () => {
        if (location.pathname === '/home') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        // Si el menú está abierto, lo cerramos
        if (isMenuOpen) {
            toggleMenu();
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
                            <img src={menuIcon} alt="Menu Icon" className="menu-icon" />
                            <span className="menu-text">MENU</span>
                        </button>
                    </div>
                    <div className="navbar-section right">
                        <button onClick={toggleSearch} className="search-toggle-button">
                            <img src={searchIcon} alt="Buscar" className="search-icon" />
                        </button>
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
                            <li><Link to="/home" onClick={handleHomeClick}>HOME</Link></li>
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

            {isSearchVisible && (
                <div className="search-bar-container">
                    <SearchBar />
                </div>
            )}
        </>
    );
};

export default NavBar;