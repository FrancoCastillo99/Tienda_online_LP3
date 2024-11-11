import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { getAuth, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import NavBar from '../client/navBar/NavBar';
import returnIcon from './icon/return-icon.png';
import './EditProfile.css';

const EditProfile = () => {
  const navigate = useNavigate();
  const { userData, user, updateUserData } = useUser();
  const auth = getAuth();

  const [formData, setFormData] = useState({
    username: '',
    email: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [passwordMessage, setPasswordMessage] = useState({ error: null, success: null });
  const [isGoogleUser, setIsGoogleUser] = useState(false);

  useEffect(() => {
    if (user) {
      // Verificar si es un usuario de Google
      const isGoogle = user.providerData.some(
        provider => provider.providerId === 'google.com'
      );
      setIsGoogleUser(isGoogle);
    }
  }, [user]);

  useEffect(() => {
    if (userData || user) {
      let displayName = '';
      
      // Intentar obtener el nombre del userData primero
      if (userData?.username) {
        displayName = userData.username;
      } 
      // Si no hay nombre en userData, intentar obtenerlo del usuario de Google
      else if (user?.displayName) {
        displayName = user.displayName;
      }
      // Si aún no hay nombre, usar el email como respaldo
      else if (user?.email) {
        displayName = user.email.split('@')[0];
      }

      setFormData({
        username: displayName,
        email: userData?.email || user?.email || ''
      });
    }
  }, [userData, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);
  
    try {
      const userRef = doc(db, 'usuarios', user.uid);
      await updateDoc(userRef, {
        username: formData.username.trim()
      });

      updateUserData({
        ...userData,
        username: formData.username.trim()
      });

      setSuccess('Perfil actualizado exitosamente');
      setTimeout(() => navigate('/client/profile'), 2000);
    } catch (err) {
      setError('Error al actualizar el perfil: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setPasswordMessage({ error: null, success: null });

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setPasswordMessage({ error: 'Las contraseñas no coinciden' });
      setIsLoading(false);
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(
        user.email,
        passwordData.currentPassword
      );

      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, passwordData.newPassword);

      setPasswordMessage({ success: 'Contraseña actualizada exitosamente' });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      });
    } catch (err) {
      setPasswordMessage({ error: 'Error al actualizar la contraseña: ' + err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    let displayName = '';
    if (userData?.username) {
      displayName = userData.username;
    } else if (user?.displayName) {
      displayName = user.displayName;
    } else if (user?.email) {
      displayName = user.email.split('@')[0];
    }

    setFormData({
      username: displayName,
      email: userData?.email || user?.email || ''
    });
    setError(null);
    setSuccess(null);
  };

  const handleCancelPassword = () => {
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    });
    setPasswordMessage({ error: null, success: null });
  };

  const handleBackToProfile = () => {
    navigate('/client/profile');
  };

  const handleDeleteProfile = async () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar tu perfil? Esta acción no se puede deshacer.')) {
      setIsLoading(true);
      try {
        const userRef = doc(db, 'usuarios', user.uid);
        await updateDoc(userRef, { isDeleted: true });
        await auth.currentUser.delete();
        navigate('/login');
      } catch (err) {
        setError('Error al eliminar el perfil: ' + err.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (!userData && !user) {
    return <div className="edit-profile-loading">Cargando datos del perfil...</div>;
  }

  return (
    <div className="edit-profile-container">
      <NavBar />
      
      <div className="edit-profile-content-container">
        <button 
          onClick={handleBackToProfile}
          className="back-to-profile-button"
        >
          <img 
            src={returnIcon}
            alt="Volver" 
            className="back-to-profile-icon" 
          />
        </button>

        <div className="edit-profile-avatar-container">
          <span className="edit-profile-avatar-placeholder">
            {formData.username.charAt(0).toUpperCase()}
          </span>
        </div>

        <h2 className="edit-profile-name">{formData.username}</h2>

        {error && <div className="edit-profile-alert error">{error}</div>}
        {success && <div className="edit-profile-alert success">{success}</div>}

        <form onSubmit={handleSubmit} className="edit-profile-section">
          <h3 className="edit-profile-section-title">Información Personal</h3>
          
          <div className="edit-profile-form-grid">
            <div className="edit-profile-form-group">
              <label htmlFor="username">Nombre Completo</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Nombre Completo"
              />
            </div>

            <div className="edit-profile-form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                disabled
              />
            </div>
          </div>

          <div className="edit-profile-actions">
            <button 
              type="button" 
              className="edit-profile-button secondary"
              onClick={handleCancel}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="edit-profile-button primary"
              disabled={isLoading}
            >
              {isLoading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>

        {!isGoogleUser && (
          <form onSubmit={handlePasswordSubmit} className="edit-profile-section">
            <h3 className="edit-profile-section-title">Cambiar Contraseña</h3>

            {passwordMessage.error && (
              <div className="edit-profile-alert error">{passwordMessage.error}</div>
            )}
            {passwordMessage.success && (
              <div className="edit-profile-alert success">{passwordMessage.success}</div>
            )}

            <div className="edit-profile-form-grid">
              <div className="edit-profile-form-group">
                <label htmlFor="currentPassword">Contraseña Actual</label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>

              <div className="edit-profile-form-group">
                <label htmlFor="newPassword">Nueva Contraseña</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>

              <div className="edit-profile-form-group">
                <label htmlFor="confirmNewPassword">Confirmar Nueva Contraseña</label>
                <input
                  type="password"
                  id="confirmNewPassword"
                  name="confirmNewPassword"
                  value={passwordData.confirmNewPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
            </div>

            <div className="edit-profile-actions">
              <button 
                type="button" 
                className="edit-profile-button secondary"
                onClick={handleCancelPassword}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="edit-profile-button primary"
                disabled={isLoading}
              >
                {isLoading ? 'Actualizando...' : 'Actualizar Contraseña'}
              </button>
            </div>
          </form>
        )}

        <div className="edit-profile-danger-zone">
          <button 
            className="edit-profile-button danger"
            onClick={handleDeleteProfile}
            disabled={isLoading}
          >
            Eliminar Perfil
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;