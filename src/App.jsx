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
import AdminRoute from "./admin/AdminRoute.jsx";
import AdminLayout from "./admin/AdminLayout.jsx";
import AdminDashboard from "./admin/AdminDashboard.jsx";
import AdminFilms from "./admin/AdminFilms.jsx";
import AdminUsers from "./admin/AdminUsers.jsx";
import AdminGenres from "./admin/AdminGenres.jsx";


function App() {

    return (
        <Routes>

            {/* PUBLIC */}
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/forgotPassword" element={<ForgotPassword/>}/>
            <Route path="/resetPassword/:token" element={<ResetPassword/>}/>


            {/* USER */}
            <Route element={<ProtectedRoutes/>}>

                <Route element={<AppLayout/>}>

                    <Route path="/" element={<Home/>}/>
                    <Route path="/favorites" element={<Favorites/>}/>
                    <Route path="/watched" element={<Watched/>}/>
                    <Route path="/account" element={<Account/>}/>
                    <Route path="/film/:id" element={<Film/>}/>


                </Route>


                {/* ADMIN */}
                <Route element={<AdminRoute/>}>

                    <Route element={<AdminLayout/>}>

                        <Route path="/admin/dashboard" element={<AdminDashboard />}/>
                        <Route path="/admin/films" element={<AdminFilms />}/>
                        <Route path="/admin/users" element={<AdminUsers />}/>
                        <Route path="/admin/genres" element={<AdminGenres />}/>

                    </Route>

                </Route>

            </Route>

        </Routes>
    );
}

export default App;