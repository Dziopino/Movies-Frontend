import { useEffect, useState } from "react";
import { useParams} from "react-router-dom";
import {useTranslation} from "react-i18next";
import Stars from "./Stars.jsx";
import useAuth from "../hooks/useAuth.js";
import useFilmContext from "../hooks/useFilmContext.js";
import config from "../config/api.js";

function Film() {
    const { id } = useParams();
    const [film, setFilm] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const {userData} = useAuth();
    const {likeToggle, watchedToggle} = useFilmContext();
    const { t } = useTranslation();

    const reloadFilm = () => {
        fetch(`${config.apiUrl}/api/getFilm/${id}?language=${userData.language_code}`,{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
        })
            .then(res => res.json())
            .then(data => {
                setFilm(data.body);
                setTimeout(() => setIsLoaded(true), 100);
            })
            .catch(err => console.error("Error loading film:", err));
    };

    const handleLikeToggle = async () => {
        await likeToggle(film.id);
        setFilm(prevFilm => ({
            ...prevFilm,
            favoriteFilmId: prevFilm.favoriteFilmId === null ? film.id : null
        }));
    };

    const handleWatchedToggle = async () => {
        await watchedToggle(film.id);
        setFilm(prevFilm => ({
            ...prevFilm,
            watchedFilmId: prevFilm.watchedFilmId === null ? film.id : null
        }));
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsLoaded(false);
        reloadFilm();
    }, [id, userData.id, userData.language_code]);

    if (!film) {
        return (
            <div className="film-loader-container">
                <div className="film-loader-spinner">
                    <div className="spinner-ring"></div>
                    <div className="spinner-ring"></div>
                    <div className="spinner-ring"></div>
                    <div className="spinner-text">{t("loading")}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="film-hero-container">
            <div className="film-backdrop-gradient" style={{backgroundImage: `url(${config.apiUrl}${film.poster_url})`}}></div>

            <div className={`film-content-wrapper ${isLoaded ? 'loaded' : ''}`}>
                <div className="film-split-layout">
                    <div className="film-poster-section animate-slide-left">
                        <div className="film-poster-frame">
                            <img src={`${config.apiUrl}${film.poster_url}`} alt={film.title} className="film-poster-hero"/>
                            <div className="poster-glow"></div>
                        </div>

                        <div className="film-quick-actions">
                            {!userData.id ? (
                                <>
                                    <button className="quick-action-btn favorite-btn" onClick={() => likeToggle(film.id)}>
                                        <span className="action-icon">♥</span>
                                        <span className="action-label">{t("add_to_favorites") || "Add to Favorites"}</span>
                                    </button>
                                    <button className="quick-action-btn watched-btn" onClick={() => watchedToggle(film.id)}>
                                        <span className="action-icon">✓</span>
                                        <span className="action-label">{t("mark_as_watched") || "Mark as Watched"}</span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button className={`quick-action-btn favorite-btn ${film.favoriteFilmId !== null ? 'active' : ''}`} onClick={handleLikeToggle}>
                                        <span className="action-icon">♥</span>
                                        <span className="action-label">
                                            {film.favoriteFilmId === null ? t("add_to_favorites") : t("in_favorites")}
                                        </span>
                                    </button>
                                    <button className={`quick-action-btn watched-btn ${film.watchedFilmId !== null ? 'active' : ''}`} onClick={handleWatchedToggle}>
                                        <span className="action-icon">✓</span>
                                        <span className="action-label">
                                            {film.watchedFilmId === null ? (t("mark_as_watched") || "Mark as Watched") : (t("watched") || "Watched")}
                                        </span>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="film-info-section animate-slide-right">
                        <div className="film-header-group">
                            <h1 className="film-title-hero">
                                {film.title}
                            </h1>
                            <div className="film-meta-badges">
                                <span className="meta-badge year-badge">
                                    {film.release_date ? new Date(film.release_date).getFullYear() : "N/A"}
                                </span>
                                <span className="meta-badge duration-badge">
                                    {parseInt(film.duration/60)}h {film.duration%60}m
                                </span>
                            </div>
                        </div>

                        <div className="film-rating-showcase">
                            <div className="rating-stars-large">
                                <Stars rating={film.rating}/>
                            </div>
                            <div className="rating-score">
                                <span className="score-number">{film.rating?.toFixed(1) || "N/A"}</span>
                                <span className="score-max">/10</span>
                            </div>
                        </div>

                        <div className="film-genres-flow">
                            {film.genres?.split(",").map((g, i) => (
                                <span key={i} className="genre-pill animate-fade-in" style={{animationDelay: `${i * 0.1}s`}}>
                                    {g.trim()}
                                </span>
                            ))}
                        </div>

                        <div className="film-description-block">
                            <h3 className="section-title">{t("overview") || "Overview"}</h3>
                            <p className="film-description-text">
                                {film.description}
                            </p>
                        </div>

                        <div className="film-details-grid">
                            <div className="detail-card animate-fade-in" style={{animationDelay: '0.2s'}}>
                                <div className="detail-icon">📅</div>
                                <div className="detail-content">
                                    <span className="detail-label">{t("release_date") || "Release Date"}</span>
                                    <span className="detail-value">
                                        {new Date(film.release_date).toLocaleDateString(userData.language_code, {day: 'numeric', month: 'long', year: 'numeric'})}
                                    </span>
                                </div>
                            </div>

                            <div className="detail-card animate-fade-in" style={{animationDelay: '0.3s'}}>
                                <div className="detail-icon">⏱️</div>
                                <div className="detail-content">
                                    <span className="detail-label">{t("duration") || "Duration"}</span>
                                    <span className="detail-value">
                                        {parseInt(film.duration/60)}h {film.duration%60}min
                                    </span>
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
