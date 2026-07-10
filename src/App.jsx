import {Routes, Route} from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import ForgotPassword from "./components/ForgotPassword.jsx";
import Home from "./components/Home";
import Favorites from "./components/Favorites";
import Watched from "./components/Watched";
import Account from "./components/Account";
import ProtectedRoutes from "./components/ProtectedRoutes";
import AppLayout from "./components/AppLayout";
import Film from "./components/Film.jsx";
import ResetPassword from "./components/ResetPassword.jsx";


function App() {

    return (
        <Routes>

            {/* PUBLIC */}
            <Route path="/login" element={<Login/>} />
            <Route path="/register" element={<Register/>} />
            <Route path="/forgotPassword" element={<ForgotPassword />} />
            <Route path="/resetPassword/:token" element={<ResetPassword />} />

            {/* PROTECTED */}
            <Route element={<ProtectedRoutes/>}>

                <Route element={<AppLayout/>}>

                    <Route path="/" element={<Home/>}/>

                    <Route path="/favorites" element={<Favorites/>}/>

                    <Route path="/watched" element={<Watched/>}/>

                    <Route path="/account" element={<Account/>}/>

                    <Route path="/film/:id" element={<Film/>}/>

                </Route>
            </Route>
        </Routes>
    );
}

export default App;