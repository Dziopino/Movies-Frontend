import {Outlet} from "react-router-dom";

import BackButton from "../components/BackButton.jsx";
import Footer from "../components/Footer.jsx";
import AdminHeader from "./AdminHeader.jsx";

function AdminLayout() {
    return (
        <>
            <AdminHeader />

            <BackButton />

            <main style={{ display: "flex", flexGrow: 1 }}>
                <Outlet />
            </main>

            <Footer />
        </>
    )
}
export default AdminLayout;