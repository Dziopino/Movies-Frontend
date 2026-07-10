import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import i18n from "i18next";

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
    const navigate = useNavigate();

    // =========================
    // STATE (single source of truth)
    // =========================
    const [userData, setUserData] = useState({
        id: Number(localStorage.getItem("userId")) || 0,
        email: "",
        username: "guest",
        avatar_url: null,
        created_at: null,
        role: 0,
        bio: null,
        language_code: localStorage.getItem("language_code") || "en"
    });

    const [showWarning, setShowWarning] = useState(false);
    const [fadeWarning, setFadeWarning] = useState(false);

    const isLoggedIn = userData.id != null;

    // =========================
    // i18n SYNC ON START
    // =========================
    useEffect(() => {
        if (userData.language_code) {
            i18n.changeLanguage(userData.language_code);
            localStorage.setItem("language_code", userData.language_code);
        }
    }, [userData.language_code]);

    // =========================
    // LOGOUT
    // =========================
    const onLogout = useCallback(() => {
        localStorage.removeItem("userId");
        localStorage.removeItem("language_code");

        setUserData({
            id: null,
            email: "",
            username: "guest",
            avatar_url: null,
            created_at: null,
            role: 0,
            bio: null,
            language_code: "en"
        });

        i18n.changeLanguage("en");

        navigate("/login");
    }, [navigate]);

    // =========================
    // PROTECTED ROUTE WARNING
    // =========================
    const onShowPopUpWarning = useCallback(() => {
        if (!userData.id) {
            setShowWarning(true);
            setFadeWarning(false);

            setTimeout(() => {
                setFadeWarning(true);

                setTimeout(() => {
                    setShowWarning(false);
                    setFadeWarning(false);
                }, 500);
            }, 5000);

            navigate("/", { replace: true });
            return true;
        }

        return false;
    }, [userData.id, navigate]);

    // =========================
    // LIKE TOGGLE
    // =========================
    const onLikeToggle = useCallback((filmId, reloadFilms) => {
        if (!userData.id) return alert("You can't like on guest account!");
        if (!filmId) return alert("Something went wrong!");

        fetch("http://localhost:8000/likeToggle", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                filmId: parseInt(filmId),
                userId: parseInt(userData.id)
            }),
        })
            .then(res => res.json())
            .then(() => reloadFilms());
    }, [userData.id]);

    // =========================
    // WATCHED TOGGLE
    // =========================
    const onWatchedToggle = useCallback((filmId, reloadFilms) => {
        if (!userData.id) return alert("You can't like on guest account!");
        if (!filmId) return alert("Something went wrong!");

        fetch("http://localhost:8000/watchedToggle", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                filmId: parseInt(filmId),
                userId: parseInt(userData.id)
            }),
        })
            .then(res => res.json())
            .then(() => reloadFilms());
    }, [userData.id]);

    // =========================
    // RENDER
    // =========================
    return (
        <Routes>

            {/* PUBLIC */}
            <Route path="/login" element={<Login setUserData={setUserData} />} />
            <Route path="/register" element={<Register setUserData={setUserData} />} />
            <Route path="/forgotPassword" element={<ForgotPassword />} />
            <Route path="/resetPassword/:token" element={<ResetPassword />} />

            {/* PROTECTED */}
            <Route element={<ProtectedRoutes isLoggedIn={isLoggedIn} />}>

                <Route element={<AppLayout setUserData={setUserData} userData={userData} />}>

                    <Route path="/" element={<Home isLoggedIn={isLoggedIn} userData={userData} showWarning={showWarning} fadeWarning={fadeWarning} onLikeToggle={onLikeToggle} onWatchedToggle={onWatchedToggle} setUserData={setUserData} onLogout={onLogout}/>}/>

                    <Route path="/favorites" element={<Favorites userData={userData} onShowPopUpWarning={onShowPopUpWarning} onLikeToggle={onLikeToggle} onWatchedToggle={onWatchedToggle}/>}/>

                    <Route path="/watched" element={<Watched userData={userData} onShowPopUpWarning={onShowPopUpWarning} onLikeToggle={onLikeToggle} onWatchedToggle={onWatchedToggle}/>}/>

                    <Route path="/account" element={<Account userData={userData} onShowPopUpWarning={onShowPopUpWarning} setUserData={setUserData}/>}/>

                    <Route path="/film/:id" element={<Film userData={userData} onLikeToggle={onLikeToggle} onWatchedToggle={onWatchedToggle}/>}/>

                </Route>
            </Route>
        </Routes>
    );
}

export default App;