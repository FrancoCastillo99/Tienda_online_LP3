import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../../navBar/NavBar';
import './UserProfile.css';

const UserProfile = () => {
    const defaultUser = {
        name: "PEDRO ALVAREZ",
        birthday: "22/11",
        ordersCount: 21,
        favoriteOrder: "SMASH",
        lastOrderDate: "22-4-2022"
    };

    const [user, setUser] = useState(defaultUser);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("userProfile"));
        if (storedUser) {
            setUser({
                name: `${storedUser.firstName.toUpperCase()} ${storedUser.lastName.toUpperCase()}`,
                birthday: storedUser.birthDate,
                ordersCount: defaultUser.ordersCount,
                favoriteOrder: defaultUser.favoriteOrder,
                lastOrderDate: defaultUser.lastOrderDate,
            });
        }
    }, []);

    return (
        <div className="user-profile-container">
            <NavBar/>
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
                    <p className="profile-stat-text">MAS PEDIDO</p>
                </div>
                <div className="profile-stat-separator"></div>
                <div className="profile-stat-item">
                    <h3 className="profile-stat-count">{user.lastOrderDate}</h3>
                    <p className="profile-stat-text">FECHA DE ULTIMO PEDIDO</p>
                </div>
            </div>
            <div className="profile-actions-container">
                <Link to="/edit-profile" className="profile-edit-button">EDITAR PERFIL</Link>
                <button className="profile-settings-button">AJUSTES</button>
            </div>
        </div>
    );
};

export default UserProfile;
