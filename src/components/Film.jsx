import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {useTranslation} from "react-i18next";
import Stars from "./Stars.jsx";
import useAuth from "../hooks/useAuth.js";
import useFilmContext from "../hooks/useFilmContext.js";

function Film() {
    const { id } = useParams();
    const [film, setFilm] = useState(null);
    const {userData} = useAuth();
    const {likeToggle, watchedToggle} = useFilmContext();
    const { t } = useTranslation();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const reloadFilm = () => {
        fetch(`http://localhost:8000/getFilm/${id}?language=${userData.language_code}&userId=${userData.id}`)
            .then(res => res.json())
            .then(data => {
                setFilm(data.body);
            });
    };

    useEffect(() => {
        reloadFilm();
    }, [id, userData.id, userData.language_code]);


    if (!film) return <div className="text-white p-5"></div>;

    return (
        <div className="container py-5 text-white d-flex justify-content-center">

            <div className="row align-items-center justify-content-center w-100" style={{ maxWidth: "1000px" }}>

                {/* POSTER */}
                <div className="col-md-4 mb-4 mb-md-0 d-flex justify-content-center">
                    <div className="bg-dark rounded shadow-lg overflow-hidden" style={{ width: "100%" }}>
                        <img
                            src={`http://localhost:5173/${film.poster_url}`} alt={film.title} className="img-fluid w-100" style={{ objectFit: "cover" }}/>
                    </div>
                </div>

                {/* INFO */}
                <div className="col-md-7 d-flex justify-content-center">
                    <div className="bg-dark p-4 rounded shadow-lg w-100">

                        <h1 className="mb-3 fw-bold">{film.title}</h1>

                        <div className="mb-3 d-flex align-items-center gap-2">
                        <span className="text-secondary small">
                            <Stars rating={film.rating}/>{"   "+film.rating}
                        </span>
                        </div>

                        <p className="text-secondary mb-4" style={{ lineHeight: "1.6" }}>
                            {film.description}
                        </p>

                        <div className="mb-3">
                            <h6 className="text-uppercase text-secondary mb-2">{t("genres")}</h6>

                            <div className="d-flex flex-wrap gap-2">
                                {film.genres?.split(",").map((g, i) => (
                                    <span key={i} className="badge bg-secondary px-3 py-2">
                                    {g.trim()}
                                </span>
                                ))}
                            </div>
                        </div>

                            <div className="row mt-4">
                                <div className="col-8">
                                    <div className=" text-secondary small">
                                        <div>{t("duration")}: {parseInt(film.duration/60)}h {film.duration%60}min</div>
                                        <div>{t("release_date")}:{" "}{new Date(film.release_date).toLocaleDateString(userData.language_code)}</div>
                                    </div>
                                </div>
                                <div className="col-4">
                                    <div className="bg-dark border-0 mt-auto d-flex justify-content-end gap-3">
                                        {!userData.id ? (
                                            <>
                                                <img onClick={() => likeToggle(film.id)} style={{height:"2rem", cursor:"pointer"}} src="/favourite.svg" alt="favourite icon"/>
                                                <img onClick={() => watchedToggle(film.id)} style={{height:"2rem", cursor:"pointer"}} src="/unseen.svg" alt="watched icon"/>
                                            </>
                                        ):(
                                            <>
                                                <img onClick={() => likeToggle(film.id,reloadFilm)} style={{height:"2rem", cursor:"pointer"}} src={film.favoriteFilmId === null ? "/favourite.svg" : "/favouriteRed.svg"} alt="favourite icon"/>
                                                <img onClick={() => watchedToggle(film.id,reloadFilm)} style={{height:"2rem", cursor:"pointer"}} src={film.watchedFilmId === null ? "/unseen.svg" : "/seen.svg"} alt="watched icon"/>
                                            </>
                                        )

                                        }

                                    </div>
                                </div>
                            </div>




                    </div>
                </div>

            </div>
        </div>
    );
}

export default Film;