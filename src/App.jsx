import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import PassReset from "./components/PassReset";
import Home from "./components/Home";
import Favorites from "./components/Favorites";
import Watched from "./components/Watched";
import Account from "./components/Account";
import ProtectedRoutes from "./components/ProtectedRoutes";
import AppLayout from "./components/AppLayout";
import {useState} from "react";

function App() {

    const onLikeToggle = (filmId,reloadFilms) =>{
        if(!userData.id){
            return alert("You can't like on guest account!");
        }

        if(!filmId){
            return alert("Something went wrong!");
        }

        fetch("http://localhost:8000/likeToggle", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({filmId:parseInt(filmId),userId:parseInt(userData.id)}),
        }).then(res => res.json()).then(() => {
            reloadFilms();
        })
    }

    const onWatchedToggle = (filmId,reloadFilms) =>{
        if(!userData.id){
            return alert("You can't like on guest account!");
        }

        if(!filmId){
            return alert("Something went wrong!");
        }

        fetch("http://localhost:8000/watchedToggle", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({filmId:parseInt(filmId),userId:parseInt(userData.id)}),
        }).then(res => res.json()).then(() => {
            reloadFilms();
        })
    }

    const [userData, setUserData] = useState({
        id: parseInt(localStorage.getItem("userId")),
        email: "",
        username: "guest",
        avatar_url: null,
        created_at: null,
        role: 0,
        bio: null,
        language_code: "en"
    });
    const [showWarning, setShowWarning] = useState(false);
    const isLoggedIn = userData.id !== null;


    return (
        <Routes>

            <Route path="/login" element={<Login setUserData={setUserData} />} />
            <Route path="/register" element={<Register setUserData={setUserData} />} />
            <Route path="/passReset" element={<PassReset />} />


            <Route element={<ProtectedRoutes isLoggedIn={isLoggedIn} />}>

                <Route element={<AppLayout setUserData={setUserData} />}>

                    <Route path="/" element={<Home isLoggedIn={isLoggedIn} userData={userData} showWarning={showWarning} onLikeToggle={onLikeToggle} onWatchedToggle={onWatchedToggle} />} />
                    <Route path="/favorites" element={<Favorites userData={userData} setShowWarning={setShowWarning} onLikeToggle={onLikeToggle} onWatchedToggle={onWatchedToggle}/>} />
                    <Route path="/watched" element={<Watched userData={userData} setShowWarning={setShowWarning} onLikeToggle={onLikeToggle} onWatchedToggle={onWatchedToggle}/>} />
                    <Route path="/account" element={<Account />} />

                </Route>

            </Route>

        </Routes>
    );
}

export default App;