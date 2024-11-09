import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import { useUser } from '../../context/UserContext';
import ShoppingCart from '../../components/shopping/ShoppingCart';
import SearchBar from '../../components/searchBar/SearchBar';
import menuIcon from '../../../../assets/client/icons/navBar/menuIcon.png';
import cancelIcon from '../../../../assets/client/icons/navBar/cancel.png';
import ShopIcon from '../../../../assets/client/icons/navBar/ShopIcon.png';
import searchIcon from '../../../../assets/client/icons/navBar/searchIcon.png';
import './NavBar.css';

const NavBar = () => {
    const { totalItems } = useContext(CartContext);
    const { logout } = useUser();
    const navigate = useNavigate();
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [navbarHeight, setNavbarHeight] = useState(0);
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const location = useLocation();

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

    const handleNavigation = (e) => {
        // Primero cerramos el menú
        if (isMenuOpen) {
            toggleMenu();
        }
        // Hacemos scroll al top
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const toggleSearch = () => {
        if (!isSearchVisible) {
            setIsCartOpen(false);
            setIsMenuOpen(false);
        }
        setIsSearchVisible(!isSearchVisible);
    };

    const handleHomeClick = (e) => {
        // Si ya estamos en la página home, prevenimos la navegación por defecto
        // y solo realizamos el scroll
        if (location.pathname === '/client/home') {
            e.preventDefault();
            window.scrollTo({ 
                top: 0, 
                behavior: 'smooth' 
            });
        }
        
        // Si el menú está abierto, lo cerramos
        if (isMenuOpen) {
            toggleMenu();
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            setIsMenuOpen(false);
            navigate('/client/login');
        } catch (error) {
            console.error("Error durante el cierre de sesión:", error);
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
                <div className="menu-overlay" style={{ top: `${navbarHeight}px` }}>
                    <div className="menu-modal">
                        <button onClick={toggleMenu} className="close-menu-button">
                            <span className="close-text">CERRAR</span>
                            <img src={cancelIcon} alt="close Icon" className="close-menu" />
                        </button>
                        <ul>
                        <li><Link to="/client/user-profile" onClick={handleNavigation}>PERFIL</Link></li>
                        <li><Link to="/client/home" onClick={handleHomeClick}>HOME</Link></li>
                        <li><Link to="/client/about-us" onClick={handleNavigation}>NOSOTROS</Link></li>
                        <li>
                            <a href="#" onClick={handleLogout} className="menu-link">
                            <span>CERRAR SESION</span>
                            </a>
                        </li>
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