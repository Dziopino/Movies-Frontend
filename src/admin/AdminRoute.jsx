import {Navigate, Outlet} from "react-router-dom";
import useAuth from "../hooks/useAuth.js";

function AdminRoute() {

    const {userData} = useAuth();

    if (Number(userData.role) !== 1) {
        return <Navigate to="/" />;
    }

    return <Outlet />;
}

export default AdminRoute;