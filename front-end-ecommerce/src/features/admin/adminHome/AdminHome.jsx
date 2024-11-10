import { Outlet } from "react-router-dom";
import SideBar from "../sideBar/SideBar";
import './AdminHome.css';

const AdminHome = () => {
    return (
        <main>
            <div className="home-container-admin">
                <SideBar/>
                <Outlet />
            </div>
        </main>
    );
}

export default AdminHome;
