// src/pages/Login/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import googleIcon from '../assets/svgs/googleIcon.svg';

// Importar las funciones necesarias de Firebase
import { auth, googleProvider, db } from '../config/firebaseConfig';
import { signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';


function Login() {
  const [isRegistering, setIsRegistering] = useState(true);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignIn = () => {
    setIsRegistering(false);
    setShowErrorAlert(false);
    setShowSuccessAlert(false);
  };

  const handleSignUp = () => {
    setIsRegistering(true);
    setShowErrorAlert(false);
    setShowSuccessAlert(false);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setError('');
      setShowSuccessAlert(true);
      setTimeout(() => {
        setShowSuccessAlert(false);
        navigate('/home');
      }, 1000);
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setError('Usuario o contraseña incorrectos');
      setShowErrorAlert(true);
      setTimeout(() => setShowErrorAlert(false), 2000);
    }
  };

  const handleSubmit = async (event) => {
  event.preventDefault();
  if (!username || !email || !password) {
    setError('Todos los campos son obligatorios');
    setShowErrorAlert(true);
    setTimeout(() => setShowErrorAlert(false), 2000)
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await setDoc(doc(db, 'usuarios', user.uid), {
      username,
      email,
      createdAt: new Date()
    });
    setShowErrorAlert(false);
    setShowSuccessAlert(true);
    setTimeout(() => {
      setShowSuccessAlert(false);
      navigate('/home');
    }, 1000);
  } catch (error) {
    console.error("Error al registrarse:", error);
    if (error.code === 'auth/email-already-in-use') {
      setError('Ya hay un usuario registrado con ese correo');
    } else {
      setError('No se pudo completar el registro. Inténtalo de nuevo');
    }
    setShowErrorAlert(true);
    setTimeout(() => setShowErrorAlert(false), 2000);
  }
};

  const handleGoogleLogin = async (event) => {
    event.preventDefault();
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      await setDoc(doc(db, 'usuarios', user.uid), {
        username: user.displayName || 'No Name',
        email: user.email,
        createdAt: new Date()
      });
      setShowSuccessAlert(true);
      setTimeout(() => {
        setShowSuccessAlert(false);
        navigate('/home');
      }, 1000);
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error);
      setError('Error al iniciar sesión con Google');
      setShowErrorAlert(true);
      setTimeout(() => setShowErrorAlert(false), 2000);
    }
  };


  const handleRegisterWithGoogle = async (event) => {
    event.preventDefault();
  
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
  
      // Verificar si el usuario ya existe en la base de datos
      const userDoc = await getDoc(doc(db, 'usuarios', user.uid));
  
      if (userDoc.exists()) {
        setError('Este usuario ya está registrado');
        setShowErrorAlert(true);
        setTimeout(() => setShowErrorAlert(false), 1500);
      } else {
        await setDoc(doc(db, 'usuarios', user.uid), {
          username: user.displayName || 'No Name',
          email: user.email,
          createdAt: new Date()
        });
        setShowSuccessAlert(true);
        setTimeout(() => {
          setShowSuccessAlert(false);
          navigate('/home');
        }, 1000);
      }
    } catch (error) {
      console.error("Error al registrarse con Google:", error);
      setError('Error al registrarse con Google');
      setShowErrorAlert(true);
      setTimeout(() => setShowErrorAlert(false), 1500);
    }
  };
  
  
  return (
    <div className='container'>
      {isRegistering ? (
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
                    <input
                      type="text"
                      placeholder="Nombre Usuario"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </label>
                </div>
                <div>
                  <label>
                    <i className='bx bx-envelope'></i>
                    <input
                      type="email"
                      placeholder="Correo Electrónico"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </label>
                </div>
                {showErrorAlert && <div className="alerta alerta-error">{error}</div>}
                {showSuccessAlert && <div className="alerta alerta-exito">Te registraste correctamente</div>}
                <input type="submit" value="Registrarse" />
                <p>OR</p>
                <button className="google-button" onClick={handleRegisterWithGoogle}>
                  <img src={googleIcon} alt="googleIcon" className='google-icon' />
                  Registrarte con Google
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : (
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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </label>
                </div>
                {showErrorAlert && <div className="alerta alerta-error">{error}</div>}
                {showSuccessAlert && <div className="alerta alerta-exito">Inicio de sesión exitoso. Redirigiendo...</div>}
                <input type="submit" value="Iniciar Sesión" />
                <p>OR</p>
                <button className="google-button" onClick={handleGoogleLogin}>
                  <img src={googleIcon} alt="googleIcon" className='google-icon' />
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
