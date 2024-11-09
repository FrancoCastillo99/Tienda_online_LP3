import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../../client/context/UserContext"; // Ajusta la ruta según tu estructura

import pedidosIcon from '../../../../assets/admin/icons/svgs/pedidosIcon.svg';
import productosIcon from '../../../../assets/admin/icons/productosIcon.png';
import usuariosIcon from '../../../../assets/admin/icons/svgs/usuariosIcon.svg';
import balanceIcon from '../../../../assets/admin/icons/balanceIcon.png';
import flechaDerecha from '../../../../assets/admin/icons/svgs/flechaDerecha.svg';
import adminImg from '../../../../assets/admin/images/avatar/Administrador.png';
import signOut from '../../../../assets/admin/icons/signOutIcon.png';
import "./SideBar.css";
import Avatar from "../avatar/Avatar";

const SideBar = () => {
    const admin = "Franco";
    const { logout } = useUser();
    const navigate = useNavigate();

    const handleLogout = async (e) => {
        e.preventDefault(); // Prevenir la navegación por defecto del Link
        try {
            await logout();
            navigate('/admin/login');
        } catch (error) {
            console.error("Error durante el cierre de sesión:", error);
        }
    };

    return(     
            <div className="container-panel">
                <div className="panel-admin">
                    <div className="info-admin">
                        <Avatar 
                            image={adminImg} 
                            username={admin} 
                            imageSize={"5rem"} 
                            fontSize={"2rem"} 
                        />
                    </div>  
                    <div className="menu-admin">
                        <nav>
                            <ul className="menu-list">
                                <li>
                                    <Link to={"/admin/home/pedidos"} className="menu-link">
                                        <div className="menu-item-admin">
                                            <img src={pedidosIcon} alt="Icono de Pedidos" className="icon-item"/>
                                            <span>Pedidos</span>
                                        </div>
                                        <img src={flechaDerecha} alt="Flecha derecha" className="flecha-icon" />
                                    </Link>
                                </li>
                                <li>
                                    <Link to={"/admin/home/productos"} className="menu-link">
                                        <div className="menu-item-admin">
                                            <img src={productosIcon} alt="Icono de Productos" className="icon-item"/>
                                            <span>Productos</span>
                                        </div>
                                        <img src={flechaDerecha} alt="Flecha derecha" className="flecha-icon" />
                                    </Link>
                                </li>
                                <li>
                                    <Link to={"/admin/home/usuarios"} className="menu-link">
                                        <div className="menu-item-admin">
                                            <img src={usuariosIcon} alt="Icono de Usuarios" className="icon-item" />
                                            <span>Usuarios</span>
                                        </div>
                                        <img src={flechaDerecha} alt="Flecha derecha" className="flecha-icon" />
                                    </Link>
                                </li>
                                <li>
                                    <Link to={"/admin/home/balance"} className="menu-link">
                                        <div className="menu-item-admin">
                                            <img src={balanceIcon} alt="Icono de Balance"  className="icon-item"/>
                                            <span>Balance</span>
                                        </div>
                                        <img src={flechaDerecha} alt="Flecha derecha" className="flecha-icon" />
                                    </Link>
                                </li>
                                <li>
                                    <a href="#" onClick={handleLogout} className="menu-link">
                                        <div className="menu-item-admin">
                                            <img src={signOut} alt="Icono de Salida" className="icon-item"/>
                                            <span>Cerrar Sesión</span>
                                        </div>
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
    );      
}

export default SideBar;