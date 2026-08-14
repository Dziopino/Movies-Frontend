import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import useDebounce from "../hooks/useDebounce.js";
import { deleteFilm, getFilms, refreshFilm } from "../services/adminService.js";
import toast from "react-hot-toast";
import SearchBar from "../components/SearchBar.jsx";
import { CirclePlus, Trash, SearchX, Loader2 } from "lucide-react";
import Pagination from "../components/Pagination.jsx";
import AdminPasswordAuthModal from "./AdminPasswordAuthModal.jsx";
import useAuth from "../hooks/useAuth.js";
import IconButton from "../components/IconButton.jsx";

function AdminFilms() {
    const { t } = useTranslation();
    const [films, setFilms] = useState([]);
    const [filmsCount, setFilmsCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFilm, setSelectedFilm] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const filmsPerPage = 50;
    const [totalPages, setTotalPages] = useState(0);
    const [adminPasswordAuthModal, setAdminPasswordAuthModal] = useState(false);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);
    const { userData } = useAuth();

    const changePage = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const updateFilm = async (filmId) => {
        try {
            const data = await refreshFilm(filmId);
            if (!data.success) return toast.error(t(data.message));
            setFilms((prev) => prev.map((f) => (f.id === filmId ? data.film : f)));
        } catch (error) {
            toast.error("failed_to_refresh_films");
            console.error(error);
        }
    };

    const loadFilms = async () => {
        setIsLoading(true);
        try {
            const filmsData = await getFilms(currentPage, filmsPerPage, debouncedSearch.trim());
            if (!filmsData.success) return toast.error(t(filmsData.message));

            setFilms(filmsData.films);
            setTotalPages(filmsData.totalPages);
            setFilmsCount(filmsData.films_count);
        } catch (error) {
            toast.error("failed_to_load_films");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCurrentPage(1);
    }, [debouncedSearch]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadFilms();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, debouncedSearch]);

    const executeAction = async (action, data, reloadList = false) => {
        try {
            const response = await action(data);
            if (!response.success) return toast.error(t(response.message));

            if (reloadList) await loadFilms();
            else await updateFilm(data.filmId);

            toast.success(t(response.message));
        } catch (error) {
            toast.error(t("something_went_wrong"));
            console.error(error);
        }
    };

    const openAction = (setter, film) => {
        setSelectedFilm(film);
        setter(true);
    };

    return (
        <div className="container admin-users mb-5">

            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 pt-3 gap-3">
                <div>
                    <h1 className="page-title mb-1">
                        {t("movies")}
                        <span className="users-count fw-normal ms-2">({filmsCount})</span>
                    </h1>
                    <p className="text-secondary mb-0">{t("manage_application_films")}</p>
                </div>
            </div>


            <div className="d-flex flex-column flex-md-row gap-3 mb-4">
                <div className="flex-grow-1">
                    <SearchBar setSearch={setSearch} />
                </div>
                <div className="d-flex gap-2">
                    <button className="btn btn-primary d-inline-flex align-items-center">
                        <CirclePlus size={18} />
                        <span className="ms-2">{t("add_film")}</span>
                    </button>
                </div>
            </div>


            {isLoading && (
                <div className="text-center py-5 text-secondary">
                    <Loader2 size={40} className="spin-anim mb-3" />
                    <p className="mb-0">{t("loading") || "Ładowanie..."}</p>
                </div>
            )}


            {!isLoading && films.length === 0 && (
                <div className="empty-state text-center py-5">
                    <SearchX size={48} className="text-secondary mb-3" />
                    <h5 className="text-secondary">{t("no_films_found") || "Nie znaleziono filmów"}</h5>
                    <p className="text-secondary small mb-0">{t("try_different_search") || "Spróbuj innego wyszukiwania"}</p>
                </div>
            )}


            {!isLoading && films.length > 0 && (
                <div className="card table-card border-0 shadow-sm mb-4 d-none d-lg-block">
                    <div className="table-responsive">
                        <table className="table table-dark table-hover align-middle mb-0">
                            <thead>
                            <tr>
                                <th className="ps-4">{t("film")}</th>
                                <th>{t("rating")}</th>
                                <th>{t("release_date")}</th>
                                <th>{t("duration")}</th>
                                <th className="text-end pe-4">{t("action")}</th>
                            </tr>
                            </thead>
                            <tbody>
                            {films.map((film) => (
                                <tr key={film.id}>
                                    <td className="ps-4">
                                        <div className="d-flex align-items-center">
                                            <img className="admin-table-image" src={"/" + film.poster_url} alt={t("film_poster")} loading="lazy"/>
                                            <div className="ms-3">
                                                <div className="fw-semibold text-light" title={film.title}>
                                                    {film.title}
                                                </div>
                                                <div className="small text-secondary">ID: {film.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="text-secondary">{film.rating}</td>
                                    <td className="text-secondary">
                                        {new Date(film.release_date).toLocaleDateString(userData.language_code)}
                                    </td>
                                    <td className="text-secondary">
                                        {parseInt(film.duration / 60)}h {film.duration % 60}min
                                    </td>
                                    <td className="text-end pe-4">
                                        <IconButton variant="danger" icon={Trash} title={t("delete_film")} onClick={() => openAction(setAdminPasswordAuthModal, film)}/>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {!isLoading && films.length > 0 && (
                <div className="d-lg-none mobile-users">
                    {films.map((film) => (
                        <div className="user-card" key={film.id}>
                            <div className="d-flex align-items-center mb-3">
                                <img className="admin-table-image" src={"/" + film.poster_url} alt={t("film_poster")} loading="lazy"/>
                                <div className="ms-3 flex-grow-1 min-w-0">
                                    <div className="fw-semibold text-truncate text-light" title={film.title}>
                                        {film.title}
                                    </div>
                                    <div className="small text-secondary">ID: {film.id}</div>
                                </div>
                            </div>

                            <div className="user-details">
                                <div className="row g-2 small text-secondary">
                                    <div className="col-6">
                                        <span className="detail-label">{t("rating")}</span>
                                        <div className="text-light">{film.rating}</div>
                                    </div>
                                    <div className="col-6">
                                        <span className="detail-label">{t("release_date")}</span>
                                        <div className="text-light">
                                            {new Date(film.release_date).toLocaleDateString(userData.language_code)}
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <span className="detail-label">{t("duration")}</span>
                                        <div className="text-light">
                                            {parseInt(film.duration / 60)}h {film.duration % 60}min
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-3 pt-3 border-top border-secondary border-opacity-25">
                                <button
                                    className="btn btn-outline-danger btn-sm d-inline-flex align-items-center"
                                    onClick={() => openAction(setAdminPasswordAuthModal, film)}
                                >
                                    <Trash size={16} />
                                    <span className="ms-1 small">{t("delete")}</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!isLoading && totalPages > 1 && (
                <Pagination currentPage={currentPage} totalPages={totalPages} changePage={changePage} />
            )}

            <AdminPasswordAuthModal
                isOpen={adminPasswordAuthModal}
                onClose={() => {
                    setAdminPasswordAuthModal(false);
                    setSelectedFilm(null);
                }}
                onConfirm={(password) => {
                    executeAction(deleteFilm, { filmId: selectedFilm.id, password }, true);
                    setAdminPasswordAuthModal(false);
                    setSelectedFilm(null);
                }}
            />
        </div>
    );
}

export default AdminFilms;