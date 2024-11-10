import { Routes, Route, Navigate } from "react-router-dom";
import { useUser } from '../src/features/context/UserContext';
import Login from "../src/features/login/Login";
import ClientHome from "../src/features/client/clientHome/ClientHome";
import AdminHome from "../src/features/admin/adminHome/AdminHome";
import Pedidos from "../src/features/admin/pedidos/Pedidos";
import Menu from "../src/features/admin/menu/Menu";
import Productos from "../src/features/admin/productos/Productos";
import Usuarios from "../src/features/admin/usuarios/Usuarios";
import Balance from "../src/features/admin/balance/Balance";
import Profile from "../src/features/profileClient/Profile";
import EditProfile from "../src/features/profileClient/EditProfile";
import AboutUs from "../src/features/aboutUs/AboutUs";

const LoadingScreen = () => {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#fff',
            zIndex: 9999
        }}>
            <div className="loading-spinner"></div>
        </div>
    );
};

const RoutesConfig = () => {
    const { isAuthenticated, isAdmin, isLoading } = useUser();

    // Constantes para rutas comunes
    const ROUTES = {
        LOGIN: "/client/login",
        REGISTER: "/client/register",
        CLIENT_HOME: "/client/Home",
        ADMIN_HOME: "/admin/Home",
        ABOUT_US: "/client/about-us"
    };

    // Mostrar la pantalla de carga mientras se verifica la autenticación
    if (isLoading) {
        return <LoadingScreen />;
    }

    /**
     * Protege rutas de cliente regular
     * Redirige a login si no está autenticado
     * Redirige a admin home si es administrador
     */
    const ProtectedClientRoute = ({ children }) => {
        if (!isAuthenticated) {
            return <Navigate to={ROUTES.LOGIN} replace />;
        }
        
        if (isAdmin) {
            return <Navigate to={ROUTES.ADMIN_HOME} replace />;
        }
        
        return children;
    };

    /**
     * Protege rutas de administrador
     * Redirige a login si no está autenticado
     * Redirige a home de cliente si no es admin
     */
    const ProtectedAdminRoute = ({ children }) => {
        if (!isAuthenticated) {
            return <Navigate to={ROUTES.LOGIN} replace />;
        }
        
        if (!isAdmin) {
            return <Navigate to={ROUTES.CLIENT_HOME} replace />;
        }
        
        return children;
    };

    /**
     * Maneja rutas públicas (login/register)
     * Redirige usuarios autenticados a sus respectivas home pages
     */
    const PublicRoute = ({ children }) => {
        if (isAuthenticated) {
            return <Navigate to={isAdmin ? ROUTES.ADMIN_HOME : ROUTES.CLIENT_HOME} replace />;
        }
        
        return children;
    };

    return (
        <Routes>
            {/* Rutas públicas - Login/Register usando parámetro mode */}
            <Route 
                path="/client/:mode" 
                element={
                    <PublicRoute>
                        <Login />
                    </PublicRoute>
                } 
            />
            
            {/* About Us - Accesible para todos */}
            <Route path={ROUTES.ABOUT_US} element={<AboutUs />} />

            {/* Rutas protegidas de cliente */}
            <Route
                path={ROUTES.CLIENT_HOME}
                element={
                    <ProtectedClientRoute>
                        <ClientHome />
                    </ProtectedClientRoute>
                }
            />
            
            <Route
                path="/client/profile"
                element={
                    <ProtectedClientRoute>
                        <Profile />
                    </ProtectedClientRoute>
                }
            />
            
            <Route
                path="/client/edit-profile"
                element={
                    <ProtectedClientRoute>
                        <EditProfile />
                    </ProtectedClientRoute>
                }
            />

            {/* Rutas de Administrador */}
            <Route
                path={ROUTES.ADMIN_HOME}
                element={
                    <ProtectedAdminRoute>
                        <AdminHome />
                    </ProtectedAdminRoute>
                }
            >
                {/* Subrutas del panel administrativo */}
                <Route index element={<Navigate to="pedidos" replace />} />
                <Route path="pedidos" element={<Pedidos />} />
                <Route path="menu" element={<Menu />} />
                <Route path="productos" element={<Productos />} />
                <Route path="usuarios" element={<Usuarios />} />
                <Route path="balance" element={<Balance />} />
            </Route>

            {/* Ruta por defecto - Redirige a login si no está autenticado,
                o a la home correspondiente si está autenticado */}
            <Route 
                path="*" 
                element={
                    isAuthenticated ? (
                        <Navigate to={isAdmin ? ROUTES.ADMIN_HOME : ROUTES.CLIENT_HOME} replace />
                    ) : (
                        <Navigate to={ROUTES.LOGIN} replace />
                    )
                } 
            />
        </Routes>
    );
};

export default RoutesConfig;