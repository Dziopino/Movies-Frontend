import {useCallback, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import PageHeader from "./PageHeader.jsx";
import useAuth from "../hooks/useAuth.js";
import useFilmContext from "../hooks/useFilmContext.js";
import useWarningContext from "../hooks/useWarningContext.js";

function Favorites()  {

    const navigate = useNavigate();

    const {userData} = useAuth();

    const {likeToggle, watchedToggle} = useFilmContext();

    const {showWarningPopup} = useWarningContext();

    const { t } = useTranslation();

    const [favorites, setFavorites] = useState([]);

    const [search, setSearch] = useState("");

    const filteredFilms = favorites.filter((film) => (
        film.title.toLowerCase().includes(search.toLowerCase())
    ))


    // eslint-disable-next-line react-hooks/exhaustive-deps
    const reloadFilms = useCallback(() =>{
        fetch("http://localhost:8000/likedGet",{
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({userId : userData.id}),
        }).then((res) => res.json()).then((data) => {
            if (data.message === "Liked got successfully") {
                setFavorites(data.body);
            }else{
                alert(data.message);
            }
        })
    })

    useEffect(() => {
        if (!showWarningPopup) {
            reloadFilms();
        }
    }, [reloadFilms, showWarningPopup, userData.id]);

    return (
        <>
            <div className="container py-5 p-4">

                <PageHeader setSearch={setSearch} title={t("favorites")} />
                <div className="row  row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-4 g-5">
                    {filteredFilms.map((favorite) => (
                        <div className="col" key={favorite.id}>
                            <div className="card h-100 bg-dark d-flex flex-column">

                                <img loading="lazy" src={favorite.poster_url} className="card-img-top" alt="Movie Image" onClick={()=>(navigate(`/film/${favorite.id}`))}/>

                                <div className="card-body" onClick={()=>(navigate(`/film/${favorite.id}`))}>
                                    <h2 className="card-title text-white" style={{fontSize:"1.25rem"}}>{favorite.title}</h2>
                                </div>

                                <div className="card-footer bg-dark border-0 mt-auto d-flex justify-content-end gap-3">
                                    {!userData.id ? (
                                        <>
                                            <img onClick={() => likeToggle(favorite.id)} style={{height:"2rem", cursor:"pointer"}} src="/favourite.svg" alt="favourite icon"/>
                                            <img onClick={() => watchedToggle(favorite.id)} style={{height:"2rem", cursor:"pointer"}} src="/unseen.svg" alt="watched icon"/>
                                        </>
                                    ):(
                                        <>
                                            <img onClick={() => likeToggle(favorite.id,reloadFilms)} style={{height:"2rem", cursor:"pointer"}} src={favorite.film_id === null? "/favourite.svg" : "/favouriteRed.svg"} alt="favourite icon"/>
                                            <img onClick={() => watchedToggle(favorite.id,reloadFilms)} style={{height:"2rem", cursor:"pointer"}} src={favorite.watchedFilmId === null ? "/unseen.svg" : "/seen.svg"} alt="watched icon"/>
                                        </>
                                    )

                                    }

                                </div>

                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}
export default Favorites;