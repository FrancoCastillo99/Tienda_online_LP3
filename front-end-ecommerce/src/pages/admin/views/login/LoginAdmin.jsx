import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './LoginAdmin.css';
import googleIcon from '../../../../assets/admin/icons/svgs/googleIcon.svg';

import { auth, googleProvider, db } from '../../../../config/firebaseConfig';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

function Login() {
  const { mode } = useParams();
  const [isLogin, setIsLogin] = useState(mode === 'login');
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setIsLogin(mode === 'login');
    // Limpiar formularios al cambiar de modo
    setLoginEmail('');
    setLoginPassword('');
    setError('');
    setShowErrorAlert(false);
    setShowSuccessAlert(false);
  }, [mode]);

  const checkAdminRole = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'usuarios', uid));
      if (userDoc.exists() && userDoc.data().rol === 'admin') {
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error checking admin role:", error);
      return false;
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      const user = userCredential.user;
      
      const isAdmin = await checkAdminRole(user.uid);
      if (!isAdmin) {
        setError('No tienes permisos de administrador');
        setShowErrorAlert(true);
        setTimeout(() => setShowErrorAlert(false), 2000);
        return;
      }

      setShowSuccessAlert(true);
      setTimeout(() => {
        setShowSuccessAlert(false);
        navigate('/admin/home');
      }, 1000);
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setError('Correo o contraseña incorrectos');
      setShowErrorAlert(true);
      setTimeout(() => setShowErrorAlert(false), 2000);
    }
  };

  const handleGoogleAuth = async (event) => {
    event.preventDefault();

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const isAdmin = await checkAdminRole(user.uid);
      if (!isAdmin) {
        setError('Esta cuenta de Google no tiene permisos de administrador');
        setShowErrorAlert(true);
        setTimeout(() => setShowErrorAlert(false), 2000);
        return;
      }

      setShowSuccessAlert(true);
      setTimeout(() => {
        setShowSuccessAlert(false);
        navigate('/admin/home');
      }, 1000);
    } catch (error) {
      if(error.code === "auth/popup-closed-by-user" || error.code === "auth/cancelled-popup-request") return;
      console.error("Error con Google:", error);
      setError('Error al iniciar sesión con Google');
      setShowErrorAlert(true);
      setTimeout(() => setShowErrorAlert(false), 2000);
    }
  };

  return (
    <div className='container-admin'>
      <div className="container-form">
        <div className="information-admin">
          <div className="info-childs">
            <h1>Buen Sabor</h1>
          </div>
        </div>
        <div className="form-information">
          <div className="form-information-childs">
            <h2>Iniciar Sesión</h2>
            <form 
              className='form form-login' 
              noValidate 
              onSubmit={handleLogin} 
              autoComplete="on"
            >
              <div>
                <label>
                  <i className='bx bx-envelope'></i>
                  <input
                    type="email"
                    placeholder="Correo Electrónico"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    autoComplete='email'
                  />
                </label>
              </div>
              <div>
                <label>
                  <i className='bx bx-lock-alt'></i>
                  <input
                    type="password"
                    placeholder="Contraseña"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    autoComplete='current-password'
                  />
                </label>
              </div>
              {showErrorAlert && <div className="alerta alerta-error">{error}</div>}
              {showSuccessAlert && (
                <div className="alerta alerta-exito">
                  Inicio de sesión exitoso. Redirigiendo...
                </div>
              )}
              <input type="submit" value="Iniciar Sesión" />
              <p>OR</p>
              <button className="google-button" onClick={handleGoogleAuth}>
                <img src={googleIcon} alt="googleIcon" className='google-icon' />
                Ingresar con Google
              </button>
              <br></br>
              <button className="google-button" onClick={() => navigate('/client/login')}>
                <i className='bx bx-user'></i>
                Ingresar como Usuario
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;