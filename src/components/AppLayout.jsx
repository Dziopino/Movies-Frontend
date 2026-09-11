import Header from "./Header";
import Footer from "./Footer";
import BackButton from "./BackButton";
import { Outlet } from "react-router-dom";

function AppLayout()  {

    return (
        <>
            <Header />

            <BackButton />

            <main style={{ display: "flex", flexGrow: 1, width: "100%", justifyContent: "center" }}>
                <Outlet />
            </main>

            <Footer />
        </>
    );
}

export default AppLayout;