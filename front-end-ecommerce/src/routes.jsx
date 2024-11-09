import { Routes, Route, Navigate } from "react-router-dom";
import { useUser } from '../src/pages/client/context/UserContext';
import Login from "./pages/client/views/login/LoginClient";
import Home from "./pages/client/views/home/Home";
import AdminHome from "./pages/admin/views/home/AdminHome";
import Pedidos from "./pages/admin/modules/Pedidos/Pedidos";
import Menu from "./pages/admin/modules/Menu/Menu";
import Productos from "./pages/admin/modules/Productos/Productos";
import Usuarios from "./pages/admin/modules/Usuarios/Usuarios";
import Balance from "./pages/admin/modules/balance/Balance";
import UserProfile from "./pages/client/views/user/profile/UserProfile";
import EditProfile from "./pages/client/views/user/editProfile/EditProfile";
import AboutUs from "./pages/client/views/aboutUs/AboutUs";

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
        CLIENT_HOME: "/client/home",
        ADMIN_HOME: "/admin/home",
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
                        <Home />
                    </ProtectedClientRoute>
                }
            />
            
            <Route
                path="/client/user-profile"
                element={
                    <ProtectedClientRoute>
                        <UserProfile />
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