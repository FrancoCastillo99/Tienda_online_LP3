import { Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/client/views/login/Login"
import Home from "./pages/client/views/home/Home"
import LoginAdmin from "./pages/admin/views/login/LoginAdmin"
import AdminHome from "./pages/admin/views/home/AdminHome"
import Dashboard from "./pages/admin/modules/dashboard/Dashboard"
import Pedidos from "./pages/admin/modules/Pedidos/Pedidos"
import Menu from "./pages/admin/modules/Menu/Menu"
import Productos from "./pages/admin/modules/Productos/Productos"
import Usuarios from "./pages/admin/modules/Usuarios/Usuarios"
import Analitycs from "./pages/admin/modules/Analitycs/Analitycs"
import UserProfile from "./pages/client/views/user/Profile/UserProfile"
import EditProfile from "./pages/client/views/user/EditProfile/EditProfile"


const RoutesConfig = () => {
    return(
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/admin/login" element={<LoginAdmin />} />
            <Route path="/admin" element={<AdminHome />} >
                <Route path="dashboard" element={<Dashboard />} /> {/* Cambiar a 'dashboard' como ruta */}
                <Route index element={<Navigate to="/admin/dashboard" />} /> {/* Redirigir a '/admin/dashboard' */}
                <Route path="pedidos" element={<Pedidos />}/>
                <Route path="menu" element={<Menu />}/>
                <Route path="productos" element={<Productos />}/>
                <Route path="usuarios" element={<Usuarios />}/>
                <Route path="analitycs" element={<Analitycs />}/>
            </Route>
            <Route path="/profile" element={<UserProfile/>}/>
            <Route path="/edit-profile" element={<EditProfile/>}/>
        </Routes>
    )
};

export default RoutesConfig;