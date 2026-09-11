import {useCallback, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import useAuth from "../hooks/useAuth.js";
import useFilmContext from "../hooks/useFilmContext.js";
import useWarningContext from "../hooks/useWarningContext.js";
import config from "../config/api.js";
import Pagination from "./Pagination.jsx";
import useDebounce from "../hooks/useDebounce.js";

function Favorites() {
    const navigate = useNavigate();
    const {userData} = useAuth();
    const {likeToggle, watchedToggle} = useFilmContext();
    const {showWarningPopup} = useWarningContext();
    const {t} = useTranslation();

    const [favorites, setFavorites] = useState([]);
    const [filteredFavorites, setFilteredFavorites] = useState([]);
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
        fetch(`${config.apiUrl}/api/likedGet`, {
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
                if (data.message === "Liked got successfully") {
                    setFavorites(data.body || []);
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
                    setFavorites([]);
                }
                setTimeout(() => setIsLoading(false), 300);
            })
            .catch(err => {
                console.error("Error loading favorites:", err);
                setFavorites([]);
                setIsLoading(false);
            });
    }, [currentPage, debouncedSearch]);

    const handleLikeToggle = async (filmId) => {
        await likeToggle(filmId);
        setFavorites(prevFavorites => prevFavorites.filter(film => film.id !== filmId));
    };

    const handleWatchedToggle = async (filmId) => {
        await watchedToggle(filmId);
        setFavorites(prevFavorites => prevFavorites.map(film => {
            if (film.id === filmId) {
                return {
                    ...film,
                    watchedFilmId: film.watchedFilmId === null ? filmId : null
                };
            }
            return film;
        }));
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
        let filtered = [...favorites];

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
        setFilteredFavorites(filtered);
    }, [favorites, selectedGenre, sortBy]);

    return (
        <div className="favorites-ultra-container">
            <div className="favorites-content-wrapper">
                <div className="favorites-hero-header">
                    <div className="hero-title-group animate-slide-down">
                        <div className="hero-icon-large">♥</div>
                        <h1 className="hero-title">{t("favorites")}</h1>
                        <p className="hero-subtitle">{t("favorites_subtitle")}</p>
                        <div className="collection-count">
                            <span className="count-number">{filteredFavorites.length}</span>
                            <span className="count-label">{t("movies_in_collection")}</span>
                        </div>
                    </div>
                </div>

                <div className="modern-filter-panel animate-slide-up">
                    <div className="filter-row">
                        <div className="filter-group">
                            <div className="filter-icon">🔍</div>
                            <input id="search_by_title" type="text" className="modern-search-input" placeholder={t("search_by_title") || "Search favorites..."} value={search} onChange={(e) => setSearch(e.target.value)}/>
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
                ) : filteredFavorites.length === 0 ? (
                    <div className="empty-state-modern animate-fade-in">
                        <div className="empty-icon">💔</div>
                        <h3 className="empty-title">{t("no_favorites_yet")}</h3>
                        <p className="empty-message">{t("start_building_your_collection")}</p>
                        <button className="empty-action-btn" onClick={() => navigate("/")}>
                            {t("explore_movies")}
                        </button>
                    </div>
                ) : (
                    <div className="films-grid-modern">
                        {filteredFavorites.map((favorite, index) => (
                            <div className="film-card-ultra animate-scale-in" key={favorite.id} style={{animationDelay: `${index * 0.05}s`}}>
                                <div className="film-card-inner">
                                    <div className="film-poster-container" onClick={() => navigate(`/film/${favorite.id}`)}>
                                        <img loading="lazy" src={`${config.apiUrl}${favorite.poster_url}`} className="film-poster-modern" alt={favorite.title}/>
                                        <div className="poster-overlay">
                                            <div className="overlay-content">
                                                <span className="play-icon">▶</span>
                                                <span className="view-details">{t("view_details")}</span>
                                            </div>
                                        </div>
                                        <div className="rating-float">
                                            ⭐ {favorite.rating?.toFixed(1) || "N/A"}
                                        </div>
                                        <div className="favorite-badge-float">♥</div>
                                    </div>

                                    <div className="film-info-modern">
                                        <h3 className="film-title-modern" onClick={() => navigate(`/film/${favorite.id}`)}>
                                            {favorite.title}
                                        </h3>
                                        <div className="film-meta-row">
                                            <span className="meta-year">
                                                {favorite.release_date ? new Date(favorite.release_date).getFullYear() : "—"}
                                            </span>
                                            <span className="meta-dot">•</span>
                                            <span className="meta-genre">
                                                {favorite.genres?.split(",")[0]?.trim() || t("movie")}
                                            </span>
                                        </div>

                                        <div className="film-actions-row">
                                            {!userData.id ? (
                                                <>
                                                    <button className="action-icon-btn" onClick={() => likeToggle(favorite.id)}>
                                                        ♡
                                                    </button>
                                                    <button className="action-icon-btn" onClick={() => watchedToggle(favorite.id)}>
                                                        ✓
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button className="action-icon-btn active-favorite pulse-animation" onClick={() => handleLikeToggle(favorite.id)} title={t("remove_from_favorites")}>
                                                        ♥
                                                    </button>
                                                    <button className={`action-icon-btn ${favorite.watchedFilmId !== null ? 'active-watched' : ''}`} onClick={() => handleWatchedToggle(favorite.id)} title={favorite.watchedFilmId === null ? t("mark_as_watched") : t("watched")}>
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

export default Favorites;
