import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import useAuth from "../hooks/useAuth.js";
import useFilmContext from "../hooks/useFilmContext.js";
import useWarningContext from "../hooks/useWarningContext.js";
import config from "../config/api.js";
import Pagination from "./Pagination.jsx";
import useDebounce from "../hooks/useDebounce.js";

function Home() {
    const navigate = useNavigate();
    const {likeToggle, watchedToggle} = useFilmContext();
    const {showWarning, fadeWarning} = useWarningContext();
    const {userData, logout} = useAuth();
    const {t} = useTranslation();
    const [films, setFilms] = useState([]);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    const [isLoading, setIsLoading] = useState(false);

    const reloadFilms = () => {
        setIsLoading(true);
        fetch(`${config.apiUrl}/api/getFilms`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(localStorage.getItem("token") && {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                })
            },
            body: JSON.stringify({
                language: userData.language_code,
                page: currentPage,
                search: debouncedSearch.trim()
            })
        })
            .then(res => res.json())
            .then(data => {
                let filteredFilms = data.body || [];

                if (selectedGenre) {
                    filteredFilms = filteredFilms.filter(film =>
                        film.genres?.toLowerCase().includes(selectedGenre.toLowerCase())
                    );
                }

                switch (sortBy) {
                    case "rating":
                        filteredFilms.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                        break;
                    case "title":
                        filteredFilms.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
                        break;
                    case "oldest":
                        filteredFilms.sort((a, b) => new Date(a.release_date || 0) - new Date(b.release_date || 0));
                        break;
                    case "newest":
                    default:
                        filteredFilms.sort((a, b) => new Date(b.release_date || 0) - new Date(a.release_date || 0));
                        break;
                }

                setFilms(filteredFilms);
                setTotalPages(data.totalPages || 0);
                setTimeout(() => setIsLoading(false), 300);
            })
            .catch(err => {
                console.error("Error loading films:", err);
                setFilms([]);
                setIsLoading(false);
            });
    };

    const fetchGenres = () => {
        fetch(`${config.apiUrl}/api/getFilms`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(localStorage.getItem("token") && {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                })
            },
            body: JSON.stringify({
                language: userData.language_code,
                page: 1,
                search: ""
            })
        })
            .then(res => res.json())
            .then(data => {
                const allGenres = new Set();
                (data.body || []).forEach(film => {
                    if (film.genres) {
                        film.genres.split(",").forEach(genre => {
                            allGenres.add(genre.trim());
                        });
                    }
                });
                setGenres(Array.from(allGenres).sort());
            })
            .catch(err => console.error("Error fetching genres:", err));
    };

    const handleLikeToggle = async (filmId) => {
        await likeToggle(filmId);
        setFilms(prevFilms => prevFilms.map(film => {
            if (film.id === filmId) {
                return {
                    ...film,
                    film_id: film.film_id === null ? filmId : null
                };
            }
            return film;
        }));
    };

    const handleWatchedToggle = async (filmId) => {
        await watchedToggle(filmId);
        setFilms(prevFilms => prevFilms.map(film => {
            if (film.id === filmId) {
                return {
                    ...film,
                    watchedFilmId: film.watchedFilmId === null ? filmId : null
                };
            }
            return film;
        }));
    };

    const changePage = (page) => {
        setCurrentPage(page);
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCurrentPage(1);
    }, [debouncedSearch]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        reloadFilms();
    }, [userData.id, userData.language_code, currentPage, debouncedSearch, selectedGenre, sortBy]);

    useEffect(() => {
        fetchGenres();
    }, [userData.language_code]);

    return (
        <div className="home-ultra-container">
            {showWarning && (
                <div className="warning-overlay animate-fade-in">
                    <div className={`warning-modal ${fadeWarning ? "fade-out" : ""}`}>
                        <div className="warning-icon">🔒</div>
                        <h2 className="warning-title">{t("guest_mode_limited")}</h2>
                        <p className="warning-message">{t("guest_mode_warning_message")}</p>
                        <div className="warning-actions">
                            <button className="warning-btn warning-btn-primary" onClick={logout}>
                                {t("log_in")}
                            </button>
                            <button className="warning-btn warning-btn-secondary" onClick={() => {logout(); navigate("/register");}}>
                                {t("sign_in")}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="home-content-wrapper">
                <div className="home-hero-header">
                    <div className="hero-title-group animate-slide-down">
                        <h1 className="hero-title">{t("movies")}</h1>
                        <p className="hero-subtitle">{t("discover_your_next_favorite_film")}</p>
                    </div>
                </div>

                <div className="modern-filter-panel animate-slide-up">
                    <div className="filter-row">
                        <div className="filter-group">
                            <div className="filter-icon">🔍</div>
                            <input id="search_by_title" type="text" className="modern-search-input" placeholder={t("search_by_title") || "Search movies..."} value={search} onChange={(e) => setSearch(e.target.value)}/>
                        </div>

                        <div className="filter-group">
                            <div className="filter-icon">🎭</div>
                            <select id="genres_filter" className="modern-select" value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)}>
                                <option value="">{t("all_genres") || "All Genres"}</option>
                                {genres.map((genre) => (
                                    <option key={genre} value={genre}>
                                        {genre}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-group">
                            <div className="filter-icon">⚡</div>
                            <select id="sort_by" className="modern-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                                <option value="newest">{t("newest") || "Newest First"}</option>
                                <option value="oldest">{t("oldest") || "Oldest First"}</option>
                                <option value="rating">{t("highest_rated") || "Top Rated"}</option>
                                <option value="title">{t("alphabetical") || "A → Z"}</option>
                            </select>
                        </div>
                    </div>
                </div>

                {isLoading ? (
                    <div className="films-loading">
                        <div className="loading-spinner-large">
                            <div className="spinner-ring"></div>
                            <div className="spinner-ring"></div>
                            <div className="spinner-ring"></div>
                        </div>
                    </div>
                ) : (
                    <div className="films-grid-modern">
                        {films?.map((film, index) => (
                            <div className="film-card-ultra animate-scale-in" key={film.id} style={{animationDelay: `${index * 0.05}s`}}>
                                <div className="film-card-inner">
                                    <div className="film-poster-container" onClick={() => navigate(`/film/${film.id}`)}>
                                        <img loading="lazy" src={`${config.apiUrl}${film.poster_url}`} className="film-poster-modern" alt={film.title}/>
                                        <div className="poster-overlay">
                                            <div className="overlay-content">
                                                <span className="play-icon">▶</span>
                                                <span className="view-details">{t("view_details")}</span>
                                            </div>
                                        </div>
                                        <div className="rating-float">
                                            ⭐ {film.rating?.toFixed(1) || "N/A"}
                                        </div>
                                    </div>

                                    <div className="film-info-modern">
                                        <h3 className="film-title-modern" onClick={() => navigate(`/film/${film.id}`)}>
                                            {film.title}
                                        </h3>
                                        <div className="film-meta-row">
                                            <span className="meta-year">
                                                {film.release_date ? new Date(film.release_date).getFullYear() : "—"}
                                            </span>
                                            <span className="meta-dot">•</span>
                                            <span className="meta-genre">
                                                {film.genres?.split(",")[0]?.trim() || t("movie")}
                                            </span>
                                        </div>

                                        <div className="film-actions-row">
                                            {!userData.id ? (
                                                <>
                                                    <button className="action-icon-btn" onClick={() => likeToggle(film.id)} title={t("add_to_favorites")}>
                                                        ♡
                                                    </button>
                                                    <button className="action-icon-btn" onClick={() => watchedToggle(film.id)} title={t("mark_as_watched")}>
                                                        ✓
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button className={`action-icon-btn ${film.film_id !== null ? 'active-favorite' : ''}`} onClick={() => handleLikeToggle(film.id)} title={film.film_id === null ? t("add_to_favorites") : t("remove_from_favorites")}>
                                                        {film.film_id === null ? '♡' : '♥'}
                                                    </button>
                                                    <button className={`action-icon-btn ${film.watchedFilmId !== null ? 'active-watched' : ''}`} onClick={() => handleWatchedToggle(film.id)} title={film.watchedFilmId === null ? t("mark_as_watched") : t("watched")}>
                                                        ✓
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <Pagination currentPage={currentPage} totalPages={totalPages} changePage={changePage} />
            </div>
        </div>
    );
}

export default Home;
