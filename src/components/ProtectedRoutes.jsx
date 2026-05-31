import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoutes({isLoggedIn}) {
    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}

export default ProtectedRoutes;