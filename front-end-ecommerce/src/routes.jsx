import { Routes, Route, Navigate } from "react-router-dom"
import Login from "./components/login/Login"
import Home from "./components/home/Home"
import LoginAdmin from "./components/admin/login/LoginAdmin"
import AdminHome from "./components/admin/home/AdminHome"
import Dashboard from "./components/admin/dashboard/Dashboard"
import Pedidos from "./components/admin/Pedidos/Pedidos"
import Productos from "./components/admin/Productos/Productos"
import Usuarios from "./components/admin/Usuarios/Usuarios"
import Balance from "./components/admin/Balance/Balance"
import UserProfile from "./components/user/Profile/UserProfile"
import EditProfile from "./components/user/EditProfile/EditProfile"


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
                <Route path="productos" element={<Productos />}/>
                <Route path="usuarios" element={<Usuarios />}/>
                <Route path="balance" element={<Balance />}/>
            </Route>
            <Route path="/profile" element={<UserProfile/>}/>
            <Route path="/edit-profile" element={<EditProfile/>}/>
        </Routes>
    )
};

export default RoutesConfig;