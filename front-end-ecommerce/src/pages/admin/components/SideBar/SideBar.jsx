import { Link } from "react-router-dom";
import dashboardIcon from '../../../../assets/admin/icons/svgs/dashboardIcon.svg';
import pedidosIcon from '../../../../assets/admin/icons/svgs/pedidosIcon.svg';
import productosIcon from '../../../../assets/admin/icons/productosIcon.png';
import usuariosIcon from '../../../../assets/admin/icons/svgs/usuariosIcon.svg';
import balanceIcon from '../../../../assets/admin/icons/balanceIcon.png';
import flechaDerecha from '../../../../assets/admin/icons/svgs/flechaDerecha.svg';
import adminImg from '../../../../assets/admin/images/avatar/Administrador.jpeg';
import "./SideBar.css";
import Avatar from "../avatar/Avatar";

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
                                        <div className="menu-item-admin">
                                            <img src={dashboardIcon} alt="Icono de Dashboard" className="icon-item" />
                                            <span>Dashboard</span>
                                        </div>
                                        <img src={flechaDerecha} alt="Flecha derecha" className="flecha-icon" />
                                    </Link>
                                </li>
                                <li>
                                    <Link to={"/admin/pedidos"} className="menu-link">
                                        <div className="menu-item-admin">
                                            <img src={pedidosIcon} alt="Icono de Pedidos" className="icon-item"/>
                                            <span>Pedidos</span>
                                        </div>
                                        <img src={flechaDerecha} alt="Flecha derecha" className="flecha-icon" />
                                    </Link>
                                </li>
                                <li>
                                    <Link to={"/admin/productos"} className="menu-link">
                                        <div className="menu-item-admin">
                                            <img src={productosIcon} alt="Icono de Productos" className="icon-item"/>
                                            <span>Productos</span>
                                        </div>
                                        <img src={flechaDerecha} alt="Flecha derecha" className="flecha-icon" />
                                    </Link>
                                </li>
                                <li>
                                    <Link to={"/admin/usuarios"} className="menu-link">
                                        <div className="menu-item-admin">
                                            <img src={usuariosIcon} alt="Icono de Usuarios" className="icon-item" />
                                            <span>Usuarios</span>
                                        </div>
                                        <img src={flechaDerecha} alt="Flecha derecha" className="flecha-icon" />
                                    </Link>
                                </li>
                                <li>
                                    <Link to={"/admin/balance"} className="menu-link">
                                        <div className="menu-item-admin">
                                            <img src={balanceIcon} alt="Icono de Balance"  className="icon-item"/>
                                            <span>Balance</span>
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
