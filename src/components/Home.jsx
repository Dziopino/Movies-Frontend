import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import PageHeader from "./PageHeader";



function Home({userData,showWarning,onLikeToggle,onWatchedToggle,onLogout,fadeWarning}) {

    const navigate = useNavigate();

    const {t} = useTranslation();

    const [films, setFilms] = useState([]);

    const [search, setSearch] = useState("");

    const filteredFilms = films.filter(film =>
        film.title.toLowerCase().includes(search.toLowerCase())
    );

    const reloadFilms = () => {
        fetch("http://localhost:8000/getFilms", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: userData.id })
        })
            .then(res => res.json())
            .then(data => {
                if (data.body && data.body.length > 0) {
                    setFilms(data.body);
                } else {
                    alert(data.message);
                }
            });
    };


    useEffect(() => {
        reloadFilms();
    },[userData.id]);




    return (
        <>
            <div className="container py-5 p-4">
                {showWarning && (
                    <div className="container d-flex justify-content-center align-items-center">
                        <div className="row w-100 justify-content-center">
                            <div className="col-12 col-md-6">
                                <div
                                    className={`alert bg-dark text-white text-center shadow-lg p-4 fade-warning ${fadeWarning ? "fade-out" : ""}`}
                                >

                                    <p className="text-danger h2 mb-3">You can't go here as guest!</p>

                                    <p className="h6 mb-4">Log in to add your personal preferences</p>

                                    <div className="d-flex justify-content-center gap-3">
                                        <button className="btn btn-success btn-lg" type="button" onClick={onLogout}>{t("log_in")}</button>

                                        <button className="btn btn-primary btn-lg" type="button" onClick={() =>{onLogout;navigate("/register")}}>{t("sign_in")}</button>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>

                )}

                <PageHeader setSearch={setSearch} title={t("movies")}/>

                <div className="row  row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-4 g-5">

                    {filteredFilms.map((film) => (
                        <div className="col" key={film.id}>
                            <div className="card h-100 bg-dark d-flex flex-column">

                                <img loading="lazy" src={film.poster_url} className="card-img-top" alt="Movie Image" onClick={() => navigate(`/film/${film.id}`)}/>

                                <div className="card-body" onClick={() => navigate(`/film/${film.id}`)}>
                                    <h2 className="card-title text-white" style={{fontSize:"1.25rem"}}>{film.title}</h2>
                                </div>

                                <div className="card-footer bg-dark border-0 mt-auto d-flex justify-content-end gap-3">
                                    {!userData.id ? (
                                        <>
                                            <img onClick={() => onLikeToggle(film.id)} style={{height:"2rem", cursor:"pointer"}} src="/favourite.svg" alt="favourite icon"/>
                                            <img onClick={() => onWatchedToggle(film.id)} style={{height:"2rem", cursor:"pointer"}} src="/unseen.svg" alt="watched icon"/>
                                        </>
                                    ):(
                                        <>
                                            <img onClick={() => onLikeToggle(film.id,reloadFilms)} style={{height:"2rem", cursor:"pointer"}} src={film.film_id === null ? "/favourite.svg" : "/favouriteRed.svg"} alt="favourite icon"/>
                                            <img onClick={() => onWatchedToggle(film.id,reloadFilms)} style={{height:"2rem", cursor:"pointer"}} src={film.watchedFilmId === null ? "/unseen.svg" : "/seen.svg"} alt="watched icon"/>
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

export default Home