import { Routes, Route, Navigate } from "react-router-dom";
import { useUser } from '../src/pages/client/context/UserContext';
import Login from "./pages/client/views/login/LoginClient";
import Home from "./pages/client/views/home/Home";
import LoginAdmin from "./pages/admin/views/login/LoginAdmin";
import AdminHome from "./pages/admin/views/home/AdminHome";
import Pedidos from "./pages/admin/modules/Pedidos/Pedidos";
import Menu from "./pages/admin/modules/Menu/Menu";
import Productos from "./pages/admin/modules/Productos/Productos";
import Usuarios from "./pages/admin/modules/Usuarios/Usuarios";
import Balance from "./pages/admin/modules/balance/Balance";
import UserProfile from "./pages/client/views/user/profile/UserProfile";
import EditProfile from "./pages/client/views/user/editProfile/EditProfile";
import AboutUs from "./pages/client/views/aboutUs/AboutUs";

const RoutesConfig = () => {
    const { userData } = useUser();
    const isAuthenticated = !!userData;
    const isAdmin = userData?.rol === 'admin';

    // Componente para rutas protegidas de cliente
    const ProtectedClientRoute = ({ children }) => {
        if (!isAuthenticated) {
            return <Navigate to="/client/login" replace />;
        }
        return children;
    };

    // Componente para rutas públicas de cliente
    const PublicClientRoute = ({ children }) => {
        if (isAuthenticated) {
            if (isAdmin) {
                return <Navigate to="/admin/home" replace />;
            }
            return <Navigate to="/client/home" replace />;
        }
        return children;
    };

    // Componente para ruta pública de admin
    const PublicAdminRoute = ({ children }) => {
        if (isAuthenticated && isAdmin) {
            return <Navigate to="/admin/home" replace />;
        }
        return children;
    };

    // Componente para rutas protegidas de administrador
    const ProtectedAdminRoute = ({ children }) => {
        if (!isAuthenticated || !isAdmin) {
            return <Navigate to="/admin/login" replace />;
        }
        return children;
    };

    return (
        <Routes>
            {/* Rutas públicas */}
            <Route 
                path="/client/:mode" 
                element={
                    <PublicClientRoute>
                        <Login />
                    </PublicClientRoute>
                } 
            />
            <Route path="/client/about-us" element={<AboutUs />} />

            {/* Rutas protegidas de cliente */}
            <Route
                path="/client/home"
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
                path="/admin/login" 
                element={
                    <PublicAdminRoute>
                        <LoginAdmin />
                    </PublicAdminRoute>
                } 
            />
            <Route
                path="/admin/home"
                element={
                    <ProtectedAdminRoute>
                        <AdminHome />
                    </ProtectedAdminRoute>
                }
            >
                <Route index element={<Navigate to="pedidos" />} />
                <Route path="pedidos" element={<Pedidos />} />
                <Route path="menu" element={<Menu />} />
                <Route path="productos" element={<Productos />} />
                <Route path="usuarios" element={<Usuarios />} />
                <Route path="balance" element={<Balance />} />
            </Route>

            {/* Ruta por defecto */}
            <Route path="*" element={<Navigate to="/client/login" replace />} />
        </Routes>
    );
};

export default RoutesConfig;