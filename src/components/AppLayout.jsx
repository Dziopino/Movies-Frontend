import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

function AppLayout({setUserData}) {
    return (
        <>
            <Header setUserData={setUserData} />

            <div className="min-vh-100">
                <Outlet />
            </div>

            <Footer />
        </>
    );
}

export default AppLayout;