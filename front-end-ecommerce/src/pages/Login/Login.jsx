import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import './Login.css';
import { useNavigate } from 'react-router-dom'; // Hook para la navegación entre rutas

// Componente Login
function Login() {
  // useState para gestionar el estado de si el usuario está registrándose o iniciando sesión
  const [isRegistering, setIsRegistering] = useState(true);

  // useState para mostrar u ocultar alertas de error y éxito
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  // Estados para manejar el nombre de usuario y contraseña en el formulario de inicio de sesión
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Estado para almacenar un mensaje de error si las credenciales no son correctas
  const [error, setError] = useState('');

  // Hook de react-router-dom para navegar a otras páginas
  const navigate = useNavigate();

  // Función para cambiar al modo de inicio de sesión
  const handleSignIn = () => {
    setIsRegistering(false); // Cambia el estado para mostrar el formulario de inicio de sesión
    setShowErrorAlert(false); // Oculta las alertas de error, si están visibles
    setShowSuccessAlert(false); // Oculta las alertas de éxito
  };
  
  // Función para cambiar al modo de registro
  const handleSignUp = () => {
    setIsRegistering(true); // Cambia el estado para mostrar el formulario de registro
    setShowErrorAlert(false); // Oculta las alertas de error
    setShowSuccessAlert(false); // Oculta las alertas de éxito
  };

  // Función para manejar el inicio de sesión
  const handleLogin = (event) => {
    event.preventDefault(); // Previene que el formulario recargue la página

    // Verifica si las credenciales son correctas (simulación)
    if (username === 'admin' && password === '1234') {
      setError(''); // Si las credenciales son correctas, se limpia el error
      setShowSuccessAlert(true); // Muestra la alerta de éxito

      // Después de 1 segundo, se oculta la alerta y se redirige al usuario a la página de inicio
      setTimeout(() => {
        setShowSuccessAlert(false);
        navigate('/home'); // Redirige al usuario a la página de inicio
      }, 1000);
    } else {
      // Si las credenciales son incorrectas, muestra un mensaje de error
      setError('Usuario o contraseña incorrectos.');
      setShowErrorAlert(true); // Muestra la alerta de error
      setTimeout(() => setShowErrorAlert(false), 3000); // Oculta la alerta después de 3 segundos
    }
  };

  // Función para manejar el registro de usuario
  const handleSubmit = (event) => {
    event.preventDefault(); // Previene que el formulario recargue la página
    const form = event.target;
    const formData = new FormData(form);

    // Verifica si algún campo del formulario está vacío
    if ([...formData.values()].some(value => !value)) {
      setShowErrorAlert(true); // Si algún campo está vacío, muestra la alerta de error
      setShowSuccessAlert(false); // Oculta la alerta de éxito
      setTimeout(() => setShowErrorAlert(false), 3000); // Oculta la alerta de error después de 3 segundos
    } else {
      // Si todos los campos están completos, se muestra la alerta de éxito
      setShowErrorAlert(false); // Oculta la alerta de error
      setShowSuccessAlert(true); // Muestra la alerta de éxito
      setTimeout(() => setShowSuccessAlert(false), 3000); // Oculta la alerta de éxito después de 3 segundos
    }
  };

  // Función para manejar el inicio de sesión con Google (no implementa la lógica real)
  const handleGoogleLogin = (event) => {
    event.preventDefault(); // Previene la recarga de la página
    console.log("Iniciar sesión con Google"); // Aquí iría la lógica para autenticarse con Google
    // No se muestra ninguna alerta porque aún no se implementa la funcionalidad
  };

  return (
    <div className='container'>
      {isRegistering ? ( // Si el usuario está registrándose, muestra el formulario de registro
        <div className="container-form register">
          <div className="information">
            <div className="info-childs">
              <h1>Buen Sabor</h1>
              <p>Para unirte a nuestra comunidad por favor Inicia Sesión con tus datos</p>
              <input type="button" value="Iniciar Sesión" id="sign-in" onClick={handleSignIn} />
            </div>
          </div>
          <div className="form-information">
            <div className="form-information-childs">
              <h2>Regístrate</h2>
              <form className="form form-register" noValidate onSubmit={handleSubmit}>
                <div>
                  <label>
                    <i className='bx bx-user'></i>
                    <input type="text" placeholder="Nombre Usuario" name="userName" />
                  </label>
                </div>
                <div>
                  <label>
                    <i className='bx bx-envelope'></i>
                    <input type="email" placeholder="Correo Electrónico" name="userEmail" />
                  </label>
                </div>
                <div>
                  <label>
                    <i className='bx bx-lock-alt'></i>
                    <input type="password" placeholder="Contraseña" name="userPassword" />
                  </label>
                </div>
                {showErrorAlert && <div className="alerta alerta-error">Todos los campos son obligatorios</div>}
                {showSuccessAlert && <div className="alerta alerta-exito">Te registraste correctamente</div>}
                <input type="submit" value="Registrarse" />
                <p>OR</p>
                <button className="google-button" onClick={handleGoogleLogin}>
                  <FontAwesomeIcon icon={faGoogle} className="google-icon" />
                  Ingresar con Google
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : ( // Si el usuario no está registrándose, muestra el formulario de inicio de sesión
        <div className="container-form login">
          <div className="information">
            <div className="info-childs">
              <h1>Buen Sabor</h1>
              <p>Para unirte a nuestra comunidad por favor Regístrate con tus datos</p>
              <input type="button" value="Registrarse" id="sign-up" onClick={handleSignUp} />
            </div>
          </div>
          <div className="form-information">
            <div className="form-information-childs">
              <h2>Iniciar Sesión</h2>
              <form className="form form-login" noValidate onSubmit={handleLogin}>
                <div>
                  <label>
                    <i className='bx bx-envelope'></i>
                    <input
                      type="email"
                      placeholder="Correo Electrónico"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)} // Actualiza el estado de username cuando el usuario escribe
                    />
                  </label>
                </div>
                <div>
                  <label>
                    <i className='bx bx-lock-alt'></i>
                    <input
                      type="password"
                      placeholder="Contraseña"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)} // Actualiza el estado de password cuando el usuario escribe
                    />
                  </label>
                </div>
                {showErrorAlert && <div className="alerta alerta-error">{error}</div>}
                {showSuccessAlert && <div className="alerta alerta-exito">Inicio de sesión exitoso. Redirigiendo...</div>}
                <input type="submit" value="Iniciar Sesión" />
                <p>OR</p>
                <button className="google-button" onClick={handleGoogleLogin}>
                  <FontAwesomeIcon icon={faGoogle} className="google-icon" />
                  Ingresar con Google
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;






