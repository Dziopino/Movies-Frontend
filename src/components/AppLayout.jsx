import Header from "./Header";
import Footer from "./Footer";
import BackButton from "./BackButton";
import { Outlet } from "react-router-dom";

function AppLayout()  {

    return (
        <>
            <Header />

            <BackButton />

            <main style={{ display: "flex", flexGrow: 1 }}>
                <Outlet />
            </main>

            <Footer />
        </>
    );
}

export default AppLayout;