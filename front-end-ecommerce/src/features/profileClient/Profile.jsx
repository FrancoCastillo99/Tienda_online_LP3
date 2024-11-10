import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import NavBar from '../client/navBar/NavBar';
import './Profile.css';

const UserProfile = () => {
    const { userData, user, isLoading: userLoading } = useUser();
    const [userOrders, setUserOrders] = useState([]);
    const [isLoadingOrders, setIsLoadingOrders] = useState(true);
    const [isTableOpen, setIsTableOpen] = useState(false);
    const [profileStats, setProfileStats] = useState({
        name: "Usuario",
        ordersCount: 0,
        favoriteOrder: "N/A",
        lastOrderDate: "Sin pedidos",
        totalSpent: "0.00"
    });
    const [error, setError] = useState(null);
    const API_URL = 'http://localhost:8080/api/pedidos';

    // Efecto para actualizar el nombre cuando userData cambie
    useEffect(() => {
        if (userData) {
            const fullName = getFormattedName(userData);
            setProfileStats(prev => ({
                ...prev,
                name: fullName
            }));
        }
    }, [userData]);

    // Función auxiliar para formatear el nombre
    const getFormattedName = (userData) => {
        if (userData.firstName || userData.lastName) {
            return `${userData.firstName || ''} ${userData.lastName || ''}`.trim();
        }
        return userData?.email?.split('@')[0] || "Usuario";
    };

    useEffect(() => {
        const fetchUserOrders = async () => {
            if (user?.uid) {
                try {
                    setIsLoadingOrders(true);
                    const response = await axios.get(`${API_URL}/usuario/${user.uid}/completo`);
                    
                    const sortedOrders = response.data.sort((a, b) => 
                        new Date(b.fechaPedido) - new Date(a.fechaPedido)
                    );
                    setUserOrders(sortedOrders);
                    
                    if (sortedOrders.length > 0) {
                        updateProfileStats(sortedOrders);
                    }
                    
                    setError(null);
                } catch (err) {
                    console.error('Error detallado:', err);
                    setError('Error al cargar los pedidos');
                    setUserOrders([]);
                } finally {
                    setIsLoadingOrders(false);
                }
            }
        };

        if (!userLoading && user?.uid) {
            fetchUserOrders();
        }
    }, [user, userLoading]);

    const updateProfileStats = (orders) => {
        const productFrequency = {};
        let totalAmount = 0;

        orders.forEach(order => {
            totalAmount += order.total || 0;
            order.productos.forEach(producto => {
                const key = producto.productoId;
                productFrequency[key] = (productFrequency[key] || 0) + producto.cantidad;
            });
        });

        const favoriteOrder = Object.entries(productFrequency)
            .reduce((max, [product, count]) => 
                count > max[1] ? [product, count] : max, ["", 0]
            )[0];

        // Mantener el nombre actual y actualizar solo las estadísticas de pedidos
        setProfileStats(prev => ({
            ...prev,
            ordersCount: orders.length,
            favoriteOrder: favoriteOrder || "N/A",
            lastOrderDate: orders.length > 0 ? new Date(orders[0].fechaPedido).toLocaleDateString() : "Sin pedidos",
            totalSpent: totalAmount.toFixed(2)
        }));
    };

    const toggleTable = () => {
        setIsTableOpen(!isTableOpen);
    };

    const renderTable = () => {
        if (!userOrders.length) {
            return (
                <div className="no-orders-message">
                    <p>No hay pedidos registrados</p>
                </div>
            );
        }

        return (
            <div className={`container-tabla-wrapper ${isTableOpen ? 'open' : ''}`}>
                <div className="container-tabla">
                    <table className="tabla-pedidos">
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Producto</th>
                                <th>Cantidad</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userOrders.map((pedido) => (
                                pedido.productos.map((producto, productoIndex) => (
                                    <tr key={`${pedido.id}-${productoIndex}`}>
                                        {productoIndex === 0 ? (
                                            <>
                                                <td className="fecha-pedido" rowSpan={pedido.productos.length}>
                                                    {new Date(pedido.fechaPedido).toLocaleString()}
                                                </td>
                                                <td className="productos-pedido">
                                                    {producto.productoId}
                                                </td>
                                                <td className="cantidad-pedido">
                                                    {producto.cantidad}
                                                </td>
                                                <td className="total-pedido" rowSpan={pedido.productos.length}>
                                                    ${pedido.total?.toFixed(2) || '0.00'}
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td className="productos-pedido">
                                                    {producto.productoId}
                                                </td>
                                                <td className="cantidad-pedido">
                                                    {producto.cantidad}
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    if (userLoading || isLoadingOrders) {
        return (
            <div className="user-profile-container">
                <NavBar />
                <div className="loading-container">Cargando datos...</div>
            </div>
        );
    }

    return (
        <div className="user-profile-container">
            <NavBar />
            
            <div className="profile-content-container">
                <div className="profile-avatar-container">
                    <span className="profile-avatar-placeholder">
                        {profileStats.name.charAt(0).toUpperCase()}
                    </span>
                </div>
                <h2 className="profile-name">{profileStats.name}</h2>
            </div>

            <div className="profile-stats-container">
                <div className="profile-stat-item">
                    <h3 className="profile-stat-count">{profileStats.ordersCount}</h3>
                    <p className="profile-stat-text">PEDIDOS REALIZADOS</p>
                </div>
                <div className="profile-stat-item">
                    <h3 className="profile-stat-count">{profileStats.favoriteOrder}</h3>
                    <p className="profile-stat-text">MÁS PEDIDO</p>
                </div>
                <div className="profile-stat-item">
                    <h3 className="profile-stat-count">${profileStats.totalSpent}</h3>
                    <p className="profile-stat-text">TOTAL GASTADO</p>
                </div>
            </div>

            {error && (
                <div className="error-container">
                    <p className="error-message">{error}</p>
                </div>
            )}

            <div className="container-pedidos">
                <div className="orders-header" onClick={toggleTable}>
                    <h3>Historial de Pedidos</h3>
                    <button 
                        className={`toggle-button ${isTableOpen ? 'open' : ''}`}
                        aria-label={isTableOpen ? 'Cerrar historial' : 'Abrir historial'}
                    >
                        ▼
                    </button>
                </div>
                {renderTable()}
            </div>

            <div className="profile-actions-container">
                <Link to="/client/edit-profile" className="profile-edit-button">
                    EDITAR PERFIL
                </Link>
                <Link to="/client/home" className="profile-settings-button">
                    SALIR
                </Link>
            </div>
        </div>
    );
};

export default UserProfile;