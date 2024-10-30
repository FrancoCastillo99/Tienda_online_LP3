import { useState } from 'react'; //Estados
import { useNavigate } from 'react-router-dom'; //Navegar entre paginas
import './Login.css';//Importacion de hoja de estilos
import googleIcon from '../../../../assets/admin/icons/svgs/googleIcon.svg'; //Importacion del logo de google

// Importacion de las funciones necesarias de Firebase
import { auth, googleProvider, db } from '../../../../config/firebaseConfig';
import { signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';


function Login() {
  const [isLogin, setIsLogin] = useState(true); //Verificar si es login o register
  const [showErrorAlert, setShowErrorAlert] = useState(false); //Alertas de error o de exito
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);//Alertas de error o de exito
  const [loginEmail, setLoginEmail] = useState('');  // Estado para el email del login
  const [loginPassword, setLoginPassword] = useState('');  // Estado para el password del login
  const [registerUsername, setRegisterUsername] = useState('');  // Estado para el username del registro
  const [registerEmail, setRegisterEmail] = useState('');  // Estado para el email del registro
  const [registerPassword, setRegisterPassword] = useState('');  // Estado para el password del registro
  const [error, setError] = useState(''); //Estado para cualquier error
  const navigate = useNavigate(); //Permite la navegacion entre paginas

  
  //Metodos para verificar que esta activo si el login o el register
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

  //Manejo del login
  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      const user = userCredential.user;
      // const token = await user.getIdToken(); // Obtener el token
      // localStorage.setItem('userToken', token); // Almacenar el token
      setError('');
      setShowSuccessAlert(true);
      setTimeout(() => {
        setShowSuccessAlert(false);
        navigate('/home');
      }, 1000);
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setError('Correo o contraseña incorrectos');
      setShowErrorAlert(true);
      setTimeout(() => setShowErrorAlert(false), 2000);
    }
  };

  //Manejo del Register
  const handleRegister = async (event) => {
    event.preventDefault();
    
    if (!registerUsername || !registerEmail || !registerPassword) {
      setError('Todos los campos son obligatorios');
      setShowErrorAlert(true);
      setTimeout(() => setShowErrorAlert(false), 2000)
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
      // const token = await user.getIdToken(); // Obtener el token
      // localStorage.setItem('userToken', token); // Almacenar el token
      setShowErrorAlert(false);
      setShowSuccessAlert(true);
      setTimeout(() => {
      setShowSuccessAlert(false);
      navigate('/home');
      }, 1000);
    } catch (error) {
      console.error("Error al registrarse:", error);
      if(error.code === 'auth/weak-password'){
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

  //Manejo del login con Google
  const handleGoogleLogin = async (event) => {
    event.preventDefault();

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      await setDoc(doc(db, 'usuarios', user.uid), {
        email: user.email,
        username: user.displayName || 'Sin Nombre',
        loginConGoogle: new Date(),
        rol: "user"
      });
      // const token = await user.getIdToken(); // Obtener el token
      // localStorage.setItem('userToken', token); // Almacenar el token
      setShowSuccessAlert(true);
      setTimeout(() => {
        setShowSuccessAlert(false);
        navigate('/home');
      }, 1000);
    } catch (error) {
      if(error.code === "auth/popup-closed-by-user" || error.code === "auth/cancelled-popup-request") return;
      console.error("Error al iniciar sesión con Google:", error);
      setError('Error al iniciar sesión con Google');
      setShowErrorAlert(true);
      setTimeout(() => setShowErrorAlert(false), 2000);
    }
  }
  //Manejo del register con Google
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
        setTimeout(() => setShowErrorAlert(false), 2000);
      } else {
        await setDoc(doc(db, 'usuarios', user.uid), {
          email: user.email,
          username: user.displayName || 'Sin Nombre',
          creadaConGoogle: new Date(),
          rol: "user"
        });
        // const token = await user.getIdToken(); // Obtener el token
        // localStorage.setItem('userToken', token); // Almacenar el token
        setShowSuccessAlert(true);
        setTimeout(() => {
          setShowSuccessAlert(false);
          navigate('/home');
        }, 1000);
      }
    } catch (error) {
      if(error.code === "auth/popup-closed-by-user" || error.code === "auth/cancelled-popup-request") return;
      console.error("Error al registrarse con Google:", error);
      setError('Error al registrarse con Google');
      setShowErrorAlert(true);
      setTimeout(() => setShowErrorAlert(false), 2000);
    }
  };
  
  //Resultado del login
  return (
    <div className='container'>
      {isLogin ? (
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
              <p>OR</p>
              <button className="google-button" onClick={handleGoogleLogin}>
                <img src={googleIcon} alt="googleIcon" className='google-icon' />
                Ingresar con Google
              </button>
            </form>
          </div>
        </div>
      </div>
        
      ) : (
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
              <form className="form form-register" noValidate onSubmit={handleRegister} autoComplete="on">
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
                <div>
                  <label>
                    <i className='bx bx-envelope'></i>
                    <input
                      type="email"
                      placeholder="Correo Electrónico"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
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
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      autoComplete='new-password'
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
      )}
    </div>
  );
}

export default Login;
