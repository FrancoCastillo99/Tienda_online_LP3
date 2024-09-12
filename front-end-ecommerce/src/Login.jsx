import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import './Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Simulación de autenticación (esto se reemplaza por una API real)
    if (username === 'admin' && password === '1234') {
      // Limpiar el error si lo había
      setError('');
      
      // Redirigir al usuario a la página principal
      navigate('/home');
    } else {
      // Mostrar un mensaje de error si las credenciales no son válidas
      setError('Usuario o contraseña incorrectos.');
    }
  };

  return (
    <div className="login-container">
      <div className="image-section">
        <div className="overlay"></div>
        <div className="logo-text">Buen Sabor</div>
      </div>
      <div className="form-section">
        <div className="form">
          <h1 className="restaurant-name">Buen Sabor</h1>
          <h2 className="title">Bienvenido</h2>

          <div>
             <p className="subtitle">No tienes una cuenta? 
             <a className='registration-link' href="/register"> Regístrate gratis</a></p>
          </div>

          <form onSubmit={handleLogin}>
            <input
              className="input"
              type="text"
              placeholder="Usuario o Email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              className="input"
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button className="button" type="submit">Ingresar</button>
            {error && <p style={{ color: 'red', textAlign: 'center', marginTop: '1rem' }}>{error}</p>}
          </form>
          
          <p className="or-text">OR</p>

          <button className="google-button">
            <FontAwesomeIcon icon={faGoogle} className="google-icon" />
            Ingresa con Google
          </button>

        </div>
      </div>
    </div>
  );
}

export default Login;