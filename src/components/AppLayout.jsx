import Header from "./Header";
import Footer from "./Footer";
import BackButton from "./BackButton";
import { Outlet } from "react-router-dom";

function AppLayout({ setUserData, userData })  {
    return (
        <>
            <Header setUserData={setUserData} userData={userData} />

            <BackButton />

            <div style={{ display: "flex", flexGrow: 1 }}>
                <Outlet />
            </div>

            <Footer />
        </>
    );
}

export default AppLayout;