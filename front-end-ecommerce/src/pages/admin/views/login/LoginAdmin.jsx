import { useState } from 'react'; // Estados
import { useNavigate } from 'react-router-dom'; // Navegar entre páginas
import './LoginAdmin.css'; // Importación de hoja de estilos
import googleIcon from '../../../../assets/admin/icons/svgs/googleIcon.svg'; // Importación del logo de Google

// Importación de las funciones necesarias de Firebase
import { auth, googleProvider, db } from '../../../../config/firebaseConfig';
import { signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

function Login() {
  const [isLogin, setIsLogin] = useState(true); // Verificar si es login o registro
  const [showErrorAlert, setShowErrorAlert] = useState(false); // Alertas de error
  const [showSuccessAlert, setShowSuccessAlert] = useState(false); // Alertas de éxito
  const [loginEmail, setLoginEmail] = useState(''); // Estado para el email del login
  const [loginPassword, setLoginPassword] = useState(''); // Estado para el password del login
  const [registerUsername, setRegisterUsername] = useState(''); // Estado para el username del registro
  const [registerEmail, setRegisterEmail] = useState(''); // Estado para el email del registro
  const [registerPassword, setRegisterPassword] = useState(''); // Estado para el password del registro
  const [error, setError] = useState(''); // Estado para cualquier error
  const navigate = useNavigate(); // Permite la navegación entre páginas

  // Métodos para verificar que está activo si el login o el registro
  const handleSignIn = () => {
    setIsLogin(true);
    setShowErrorAlert(false);
    setShowSuccessAlert(false);
  };

  const handleSignUp = () => {
    setIsLogin(false);
    setShowErrorAlert(false);
    setShowSuccessAlert(false);
  };

  // Manejo del login
  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      const user = userCredential.user;
      setError('');
      setShowSuccessAlert(true);
      setTimeout(() => {
        setShowSuccessAlert(false);
        navigate('/admin');
      }, 1000);
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setError('Correo o contraseña incorrectos');
      setShowErrorAlert(true);
      setTimeout(() => setShowErrorAlert(false), 2000);
    }
  };

  // Manejo del registro
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
        rol: "admin"
      });
      setShowErrorAlert(false);
      setShowSuccessAlert(true);
      setTimeout(() => {
        setShowSuccessAlert(false);
        navigate('/admin');
      }, 1000);
    } catch (error) {
      console.error("Error al registrarse:", error);
      if (error.code === 'auth/weak-password') {
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

  // Resultado del login
  return (
    <div className='container-admin'>
      {isLogin ? (
        <div className="container-form login">
          <div className="information-admin">
            <div className="info-childs">
              <h1>Buen Sabor</h1>
              <input type="button" value="Registrarse" id="sign-up-button" onClick={handleSignUp} />
            </div>
          </div>
          <div className="form-information">
            <div className="form-information-childs">
              <h2>Iniciar Sesión</h2>
              <form className="form form-login" noValidate onSubmit={handleLogin} autoComplete="on">
                <div>
                  <label>
                    <i className='bx bx-envelope'></i>
                    <input
                      type="email"
                      placeholder="Correo Electrónico"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      autoComplete="email"
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
                      autoComplete="current-password"
                    />
                  </label>
                </div>
                {showErrorAlert && <div className="alerta alerta-error">{error}</div>}
                {showSuccessAlert && <div className="alerta alerta-exito">Inicio de sesión exitoso. Redirigiendo...</div>}
                <input type="submit" value="Iniciar Sesión" />
              </form>
            </div>
          </div>
        </div>
      ) : (
        <div className="container-form register">
          <div className="information-admin">
            <div className="info-childs">
              <h1>Buen Sabor</h1>
              <input type="button" value="Iniciar Sesión" id="sign-in-button" onClick={handleSignIn} />
            </div>
          </div>
          <div className="form-information">
            <div className="form-information-childs">
              <h2>Registrarse</h2>
              <form className="form form-register" noValidate onSubmit={handleRegister} autoComplete="on">
                <div>
                  <label>
                    <i className='bx bx-user'></i>
                    <input
                      type="text"
                      placeholder="Nombre de Usuario"
                      value={registerUsername}
                      onChange={(e) => setRegisterUsername(e.target.value)}
                      autoComplete="off"
                    />
                  </label>
                </div>
                <div>
                  <label>
                    <i className='bx bx-envelope'></i>
                    <input
                      type="email"
                      placeholder="Correo Electrónico"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      autoComplete="email"
                    />
                  </label>
                </div>
                <div>
                  <label>
                    <i className='bx bx-lock-alt'></i>
                    <input
                      type="password"
                      placeholder="Contraseña"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      autoComplete="new-password"
                    />
                  </label>
                </div>
                {showErrorAlert && <div className="alerta alerta-error">{error}</div>}
                {showSuccessAlert && <div className="alerta alerta-exito">Registro exitoso. Redirigiendo...</div>}
                <input type="submit" value="Registrarse" />
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
