import {useCallback, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import PageHeader from "./PageHeader.jsx";
import {useTranslation} from "react-i18next";
import useAuth from "../hooks/useAuth.js";
import useFilmContext from "../hooks/useFilmContext.js";
import useWarningContext from "../hooks/useWarningContext.js";
import config from "../config/api.js";
import useDebounce from "../hooks/useDebounce.js";
import Pagination from "./Pagination.jsx";

function Watched() {
    const navigate = useNavigate();
    const {userData} = useAuth();
    const {likeToggle, watchedToggle} = useFilmContext();
    const {showWarningPopup} = useWarningContext();
    const {t} = useTranslation();

    const [watched, setWatched] = useState([]);
    const [filteredWatched, setFilteredWatched] = useState([]);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    const [isLoading, setIsLoading] = useState(false);

    const changePage = (page) => {
        setCurrentPage(page);
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const reloadFilms = useCallback(() => {
        setIsLoading(true);
        fetch(`${config.apiUrl}/api/watchedGet`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            body: JSON.stringify({
                page: currentPage,
                search: debouncedSearch
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.message === "Watched got successfully") {
                    setWatched(data.body || []);
                    setTotalPages(data.totalPages || 0);

                    const allGenres = new Set();
                    (data.body || []).forEach(film => {
                        if (film.genres) {
                            film.genres.split(",").forEach(genre => {
                                allGenres.add(genre.trim());
                            });
                        }
                    });
                    setGenres(Array.from(allGenres).sort());
                } else {
                    console.error(data.message);
                    setWatched([]);
                }
                setTimeout(() => setIsLoading(false), 300);
            })
            .catch(err => {
                console.error("Error loading watched films:", err);
                setWatched([]);
                setIsLoading(false);
            });
    }, [currentPage, debouncedSearch]);

    const handleLikeToggle = async (filmId) => {
        await likeToggle(filmId);
        setWatched(prevWatched => prevWatched.map(film => {
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
        // Remove from watched list since it was unmarked as watched
        setWatched(prevWatched => prevWatched.filter(film => film.id !== filmId));
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCurrentPage(1);
    }, [debouncedSearch]);

    useEffect(() => {
        const blocked = showWarningPopup();
        if (!blocked) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            reloadFilms();
        }
    }, [userData.id, currentPage, debouncedSearch, reloadFilms, showWarningPopup]);

    useEffect(() => {
        let filtered = [...watched];

        if (selectedGenre) {
            filtered = filtered.filter(film =>
                film.genres?.toLowerCase().includes(selectedGenre.toLowerCase())
            );
        }

        switch (sortBy) {
            case "rating":
                filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                break;
            case "title":
                filtered.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
                break;
            case "oldest":
                filtered.sort((a, b) => new Date(a.release_date || 0) - new Date(b.release_date || 0));
                break;
            case "newest":
            default:
                filtered.sort((a, b) => new Date(b.release_date || 0) - new Date(a.release_date || 0));
                break;
        }

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFilteredWatched(filtered);
    }, [watched, selectedGenre, sortBy]);

    return (
        <div className="watched-ultra-container">
            <div className="watched-content-wrapper">
                <div className="watched-hero-header">
                    <div className="hero-title-group animate-slide-down">
                        <div className="hero-icon-large">👁️</div>
                        <h1 className="hero-title">{t("watched")}</h1>
                        <p className="hero-subtitle">{t("watched_subtitle")}</p>
                        <div className="collection-count">
                            <span className="count-number">{filteredWatched.length}</span>
                            <span className="count-label">{t("movies_watched")}</span>
                        </div>
                    </div>
                </div>

                <div className="modern-filter-panel animate-slide-up">
                    <div className="filter-row">
                        <div className="filter-group">
                            <div className="filter-icon">🔍</div>
                            <input id="search_by_title" type="text" className="modern-search-input" placeholder={t("search_by_title") || "Search watched movies..."} value={search} onChange={(e) => setSearch(e.target.value)}/>
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
                            <select id="filter_by" className="modern-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
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
                ) : filteredWatched.length === 0 ? (
                    <div className="empty-state-modern animate-fade-in">
                        <div className="empty-icon">📺</div>
                        <h3 className="empty-title">{t("no_watched_movies_yet")}</h3>
                        <p className="empty-message">{t("start_tracking_your_journey")}</p>
                        <button className="empty-action-btn" onClick={() => navigate("/")}>
                            {t("discover_movies")}
                        </button>
                    </div>
                ) : (
                    <div className="films-grid-modern">
                        {filteredWatched.map((film, index) => (
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
                                        <div className="watched-badge-float">✓</div>
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
                                                    <button className="action-icon-btn" onClick={() => likeToggle(film.id)}>
                                                        ♡
                                                    </button>
                                                    <button className="action-icon-btn" onClick={() => watchedToggle(film.id)}>
                                                        ✓
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button className={`action-icon-btn ${film.film_id !== null ? 'active-favorite' : ''}`} onClick={() => handleLikeToggle(film.id)} title={film.film_id === null ? t("add_to_favorites") : t("remove_from_favorites")}>
                                                        {film.film_id === null ? '♡' : '♥'}
                                                    </button>
                                                    <button className="action-icon-btn active-watched pulse-animation" onClick={() => handleWatchedToggle(film.id)} title={t("watched")}>
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

                <Pagination currentPage={currentPage} totalPages={totalPages} changePage={changePage}/>
            </div>
        </div>
    );
}

export default Watched;
