import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../navBar/NavBarHome';
import './EditProfile.css';

const EditProfile = () => {
  const navigate = useNavigate();

  const initialData = JSON.parse(localStorage.getItem("userProfile")) || {
    firstName: "Pedro",
    lastName: "Alvarez",
    birthDate: "1990-11-22",
    email: "pedro.alvarez@example.com"
  };

  const [formData, setFormData] = useState(initialData);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("userProfile", JSON.stringify(formData));
    navigate('/profile');
  };

  const handleCancel = () => {
    navigate('/profile');
  };

  return (
    <div className="edit-profile-container">
      <NavBar/>
      <div className="content-container">
        <div className="profile-section">
          <h2 className="profile-title">Perfil</h2>
          <div className="profile-photo">
            <span className="avatar-placeholder">👤</span>
          </div>
          <h3 className="profile-name">{formData.firstName} {formData.lastName}</h3>
          <button className="profile-photo-button">Cambiar foto de perfil</button>
        </div>
        <div className="form-section">
          <form onSubmit={handleSubmit} className="profile-form">
            <h3 className="section-title-profile">INFORMACIÓN BÁSICA</h3>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="firstName">NOMBRE</label>
                <input
                  className="form-input"
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="lastName">APELLIDO</label>
                <input
                  className="form-input"
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="birthDate">FECHA DE NACIMIENTO</label>
              <input
                className="form-input"
                type="date"
                id="birthDate"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="email">EMAIL</label>
              <input
                className="form-input"
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="form-actions">
              <button type="button" className="cancel-button" onClick={handleCancel}>CANCELAR</button>
              <button type="submit" className="save-button">GUARDAR</button>
            </div>
          </form>
          <button className="delete-profile-button">Eliminar perfil</button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
