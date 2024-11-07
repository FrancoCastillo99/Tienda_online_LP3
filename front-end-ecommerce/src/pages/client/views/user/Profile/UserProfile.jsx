import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../../../context/UserContext';
import NavBar from '../../../modules/navBar/NavBar';
import './UserProfile.css';

const UserProfile = () => {
    const { userData, loading } = useUser(); // Obtiene datos del usuario desde el contexto

    const [user, setUser] = useState({
        name: "",
        birthday: "",
        ordersCount: 0,
        favoriteOrder: "",
        lastOrderDate: ""
    });

    useEffect(() => {
        if (!loading && userData) {
            // Asignar los datos reales del usuario de Firestore
            setUser({
                name: userData.username || "Usuario",
                birthday: userData.birthDate || "Fecha no registrada",
                ordersCount: userData.ordersCount || 0,
                favoriteOrder: userData.favoriteOrder || "N/A",
                lastOrderDate: userData.lastOrderDate || "Fecha no disponible"
            });
        }
    }, [loading, userData]);

    if (loading) {
        return <p>Cargando datos del usuario...</p>;
    }

    return (
        <div className="user-profile-container">
            <NavBar />
            <div className="profile-content-container">
                <div className="profile-avatar-container">
                    <span className="profile-avatar-placeholder">👤</span>
                </div>
                <h2 className="profile-name">{user.name}</h2>
                <p className="profile-birthday">CUMPLEAÑOS: {user.birthday}</p>
            </div>
            <div className="profile-stats-container">
                <div className="profile-stat-item">
                    <h3 className="profile-stat-count">{user.ordersCount}</h3>
                    <p className="profile-stat-text">PEDIDOS REALIZADOS</p>
                </div>
                <div className="profile-stat-separator"></div>
                <div className="profile-stat-item">
                    <h3 className="profile-stat-count">{user.favoriteOrder}</h3>
                    <p className="profile-stat-text">MÁS PEDIDO</p>
                </div>
                <div className="profile-stat-separator"></div>
                <div className="profile-stat-item">
                    <h3 className="profile-stat-count">{user.lastOrderDate}</h3>
                    <p className="profile-stat-text">FECHA DE ÚLTIMO PEDIDO</p>
                </div>
            </div>
            <div className="profile-actions-container">
                <Link to="/client/edit-profile" className="profile-edit-button">EDITAR PERFIL</Link>
                <button className="profile-settings-button">AJUSTES</button>
            </div>
        </div>
    );
};

export default UserProfile;
