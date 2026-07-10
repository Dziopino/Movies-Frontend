import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";

function ProtectedRoutes() {

    const {userData}=useAuth();

    const isLoggedIn = userData.id != null;


    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}

export default ProtectedRoutes;