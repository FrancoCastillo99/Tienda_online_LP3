import { Link } from "react-router-dom";
import dashboardIcon from '../../../assets/svgs/dashboardIcon.svg';
import pedidosIcon from '../../../assets/svgs/pedidosIcon.svg';
import menuIcon from '../../../assets/svgs/menuIcon.svg';
import productosIcon from '../../../assets/images/iconos/productosIcon.png';
import usuariosIcon from '../../../assets/svgs/usuariosIcon.svg';
import analitycsIcon from '../../../assets/images/iconos/analitycsIcon.png';
import flechaDerecha from '../../../assets/svgs/flechaDerecha.svg';
import adminImg from '../../../assets/images/avatar/Administrador.jpeg';
import "./SideBar.css";
import Avatar from "../../avatar/Avatar";

const SideBar = () => {
    const admin = "Emiliano";
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
                                    <Link to={"/admin/dashboard"} className="menu-link">
                                        <div className="menu-item">
                                            <img src={dashboardIcon} alt="Icono de Dashboard" className="icon-item" />
                                            <span>Dashboard</span>
                                        </div>
                                        <img src={flechaDerecha} alt="Flecha derecha" className="flecha-icon" />
                                    </Link>
                                </li>
                                <li>
                                    <Link to={"/admin/pedidos"} className="menu-link">
                                        <div className="menu-item">
                                            <img src={pedidosIcon} alt="Icono de Pedidos" className="icon-item"/>
                                            <span>Pedidos</span>
                                        </div>
                                        <img src={flechaDerecha} alt="Flecha derecha" className="flecha-icon" />
                                    </Link>
                                </li>
                                <li>
                                    <Link to={"/admin/menu"} className="menu-link">
                                        <div className="menu-item">
                                            <img src={menuIcon} alt="Icono del Menú" className="icon-item"/>
                                            <span>Menú</span>
                                        </div>
                                        <img src={flechaDerecha} alt="Flecha derecha" className="flecha-icon" />
                                    </Link>
                                </li>
                                <li>
                                    <Link to={"/admin/productos"} className="menu-link">
                                        <div className="menu-item">
                                            <img src={productosIcon} alt="Icono de Productos" className="icon-item"/>
                                            <span>Productos</span>
                                        </div>
                                        <img src={flechaDerecha} alt="Flecha derecha" className="flecha-icon" />
                                    </Link>
                                </li>
                                <li>
                                    <Link to={"/admin/usuarios"} className="menu-link">
                                        <div className="menu-item">
                                            <img src={usuariosIcon} alt="Icono de Usuarios" className="icon-item" />
                                            <span>Usuarios</span>
                                        </div>
                                        <img src={flechaDerecha} alt="Flecha derecha" className="flecha-icon" />
                                    </Link>
                                </li>
                                <li>
                                    <Link to={"/admin/analitycs"} className="menu-link">
                                        <div className="menu-item">
                                            <img src={analitycsIcon} alt="Icono de Analitycs"  className="icon-item"/>
                                            <span>Analitycs</span>
                                        </div>
                                        <img src={flechaDerecha} alt="Flecha derecha" className="flecha-icon" />
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
    );      
}

export default SideBar;
