import {Routes, Route} from "react-router-dom";
import { useEffect } from "react";
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
import AdminFilmDetails from "./admin/AdminFilmDetails.jsx";
import AdminUsers from "./admin/AdminUsers.jsx";
import AdminGenres from "./admin/AdminGenres.jsx";
import RateLimitAlert from "./components/RateLimitAlert.jsx";
import { useError } from "./context/ErrorContext.jsx";
import { setupAxiosInterceptor } from "./utils/axiosConfig.js";
import { registerGlobalFetchHandler } from "./utils/globalFetchHandler.js";


function App() {
    const { rateLimitError, showRateLimitError, clearRateLimitError } = useError();

    useEffect(() => {
        // Setup Axios interceptor
        setupAxiosInterceptor(showRateLimitError);

        // Setup global fetch handler
        registerGlobalFetchHandler(showRateLimitError);
    }, [showRateLimitError]);

    useEffect(() => {
        // Auto-clear error after retryAfter time
        if (rateLimitError) {
            const timeout = setTimeout(() => {
                clearRateLimitError();
            }, rateLimitError.retryAfter * 1000);

            return () => clearTimeout(timeout);
        }
    }, [rateLimitError, clearRateLimitError]);

    return (
        <>
            {rateLimitError && (
                <div style={{position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', zIndex: 9999, width: '90%', maxWidth: '600px'}}>
                    <RateLimitAlert message={rateLimitError.message} retryAfter={rateLimitError.retryAfter} onDismiss={clearRateLimitError}/>
                </div>
            )}
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
                        <Route path="/admin/films/:id" element={<AdminFilmDetails />}/>
                        <Route path="/admin/users" element={<AdminUsers />}/>
                        <Route path="/admin/genres" element={<AdminGenres />}/>

                    </Route>

                </Route>

            </Route>

            </Routes>
        </>
    );
}

export default App;