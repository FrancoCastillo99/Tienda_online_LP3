import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Login.css';
import googleIcon from './assets/svgs/google-icon.svg';

import { auth, googleProvider, db } from '../config/firebaseConfig';
import { signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

function Login() {
  const { mode } = useParams();
  const [isLogin, setIsLogin] = useState(mode === 'login');
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setIsLogin(mode === 'login');
    // Limpiar formularios al cambiar de modo
    setLoginEmail('');
    setLoginPassword('');
    setRegisterUsername('');
    setRegisterEmail('');
    setRegisterPassword('');
    setError('');
    setShowErrorAlert(false);
    setShowSuccessAlert(false);
  }, [mode]);

  const handleSignIn = () => {
    navigate('/client/login');
  };

  const handleSignUp = () => {
    navigate('/client/register');
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      const user = userCredential.user;
      setError('');
      setShowSuccessAlert(true);
      setTimeout(() => {
        setShowSuccessAlert(false);
        navigate('/client/home');
      }, 1000);
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setError('Correo o contraseña incorrectos');
      setShowErrorAlert(true);
      setTimeout(() => setShowErrorAlert(false), 2000);
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    
    if (!registerUsername || !registerEmail || !registerPassword) {
      setError('Todos los campos son obligatorios');
      setShowErrorAlert(true);
      setTimeout(() => setShowErrorAlert(false), 2000);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, registerEmail, registerPassword);
      const user = userCredential.user;
      
      await setDoc(doc(db, 'usuarios', user.uid), {
        email: registerEmail,
        username: registerUsername,
        creada: new Date(),
        rol: "user"
      });

      setShowSuccessAlert(true);
      setTimeout(() => {
        setShowSuccessAlert(false);
        navigate('/client/home');
      }, 1000);
    } catch (error) {
      console.error("Error al registrarse:", error);
      if(error.code === 'auth/weak-password') {
        setError('La contraseña debe tener al menos 6 caracteres');
      } else if (error.code === 'auth/email-already-in-use') {
        setError('Este correo ya está registrado');
      } else if (error.code === 'auth/invalid-email') {
        setError('Correo electrónico no válido');
      } else {
        setError('Ocurrió un error inesperado. Intenta nuevamente');
      }
      setShowErrorAlert(true);
      setTimeout(() => setShowErrorAlert(false), 2000);
    }
  };

  const handleGoogleAuth = async (event) => {
    event.preventDefault();

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      if (!isLogin) {
        // Si es registro, verificar si el usuario ya existe
        const userDoc = await getDoc(doc(db, 'usuarios', user.uid));
        
        if (userDoc.exists()) {
          setError('Este usuario ya está registrado');
          setShowErrorAlert(true);
          setTimeout(() => setShowErrorAlert(false), 2000);
          return;
        }

        await setDoc(doc(db, 'usuarios', user.uid), {
          email: user.email,
          username: user.displayName || 'Sin Nombre',
          creadaConGoogle: new Date(),
          rol: "user"
        });
      }

      setShowSuccessAlert(true);
      setTimeout(() => {
        setShowSuccessAlert(false);
        navigate('/client/home');
      }, 1000);
    } catch (error) {
      if(error.code === "auth/popup-closed-by-user" || error.code === "auth/cancelled-popup-request") return;
      console.error("Error con Google:", error);
      setError(`Error al ${isLogin ? 'iniciar sesión' : 'registrarse'} con Google`);
      setShowErrorAlert(true);
      setTimeout(() => setShowErrorAlert(false), 2000);
    }
  };

  return (
    <div className='container'>
      <div className="container-form">
        <div className="information">
          <div className="info-childs">
            <h1>Buen Sabor</h1>
            <p>
              {isLogin 
                ? "Para unirte a nuestra comunidad por favor Regístrate con tus datos"
                : "Para unirte a nuestra comunidad por favor Inicia Sesión con tus datos"
              }
            </p>
            <input 
              type="button" 
              value={isLogin ? "Registrarse" : "Iniciar Sesión"} 
              onClick={isLogin ? handleSignUp : handleSignIn} 
            />
          </div>
        </div>
        <div className="form-information">
          <div className="form-information-childs">
            <h2>{isLogin ? "Iniciar Sesión" : "Regístrate"}</h2>
            <form 
              className={`form ${isLogin ? 'form-login' : 'form-register'}`} 
              noValidate 
              onSubmit={isLogin ? handleLogin : handleRegister} 
              autoComplete="on"
            >
              {!isLogin && (
                <div>
                  <label>
                    <i className='bx bx-user'></i>
                    <input
                      type="text"
                      placeholder="Nombre Usuario"
                      value={registerUsername}
                      onChange={(e) => setRegisterUsername(e.target.value)}
                      autoComplete='username'
                    />
                  </label>
                </div>
              )}
              <div>
                <label>
                  <i className='bx bx-envelope'></i>
                  <input
                    type="email"
                    placeholder="Correo Electrónico"
                    value={isLogin ? loginEmail : registerEmail}
                    onChange={(e) => isLogin ? setLoginEmail(e.target.value) : setRegisterEmail(e.target.value)}
                    autoComplete={isLogin ? 'email' : 'new-email'}
                  />
                </label>
              </div>
              <div>
                <label>
                  <i className='bx bx-lock-alt'></i>
                  <input
                    type="password"
                    placeholder="Contraseña"
                    value={isLogin ? loginPassword : registerPassword}
                    onChange={(e) => isLogin ? setLoginPassword(e.target.value) : setRegisterPassword(e.target.value)}
                    autoComplete={isLogin ? 'current-password' : 'new-password'}
                  />
                </label>
              </div>
              {showErrorAlert && <div className="alerta alerta-error">{error}</div>}
              {showSuccessAlert && (
                <div className="alerta alerta-exito">
                  {isLogin ? "Inicio de sesión exitoso" : "Te registraste correctamente"}. Redirigiendo...
                </div>
              )}
              <input type="submit" value={isLogin ? "Iniciar Sesión" : "Registrarse"} />
              <p>OR</p>
              <button className="google-button" onClick={handleGoogleAuth}>
                <img src={googleIcon} alt="googleIcon" className='google-icon' />
                {isLogin ? "Ingresar con Google" : "Registrarte con Google"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;