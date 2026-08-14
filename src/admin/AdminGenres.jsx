import SearchBar from "../components/SearchBar.jsx";
import { CirclePlus, Pencil, Trash, SearchX, Loader2 } from "lucide-react";
import { deleteGenre, editGenre, refreshGenre, getGenres, addGenre } from "../services/adminService.js";
import Pagination from "../components/Pagination.jsx";
import AdminPasswordAuthModal from "./AdminPasswordAuthModal.jsx";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useDebounce from "../hooks/useDebounce.js";
import AdminEditGenreModal from "./AdminEditGenreModal.jsx";
import AdminAddGenre from "./AdminAddGenre.jsx";
import IconButton from "../components/IconButton.jsx";


function AdminGenres() {
    const { t } = useTranslation();
    const [genres, setGenres] = useState([]);
    const [genresCount, setGenresCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [editGenreModal, setEditGenreModal] = useState(false);
    const [addGenreModal, setAddGenreModal] = useState(false);
    const [adminPasswordAuthModal, setAdminPasswordAuthModal] = useState(false);
    const [selectedGenre, setSelectedGenre] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const genresPerPage = 50;
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);

    const changePage = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const updateGenres = async (genreId) => {
        try {
            const data = await refreshGenre(genreId);
            if (!data.success) return toast.error(t(data.message));
            setGenres((prev) => prev.map((g) => (g.id === genreId ? data.genre : g)));
        } catch (error) {
            toast.error("failed_to_refresh_genres");
            console.error(error);
        }
    };

    const loadGenres = async () => {
        setIsLoading(true);
        try {
            const genresData = await getGenres(currentPage, genresPerPage, debouncedSearch.trim());
            if (!genresData.success) return toast.error(t(genresData.message));

            setGenres(genresData.genres);
            setTotalPages(genresData.totalPages);
            setGenresCount(genresData.genres_count);
        } catch (error) {
            toast.error("failed_to_load_genres");
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
        loadGenres();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, debouncedSearch]);

    const executeAction = async (action, data, reloadList = false) => {
        try {
            const response = await action(data);
            if (!response.success) return toast.error(t(response.message));

            if (reloadList) await loadGenres();
            else await updateGenres(data.genreId);

            toast.success(t(response.message));
        } catch (error) {
            toast.error(t("something_went_wrong"));
            console.error(error);
        }
    };

    const openAction = (setter, genre) => {
        setSelectedGenre(genre);
        setter(true);
    };

    return (
        <div className="container admin-users mb-5">

            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 pt-3 gap-3">
                <div>
                    <h1 className="page-title mb-1">
                        {t("genres")}
                        <span className="users-count fw-normal ms-2">({genresCount})</span>
                    </h1>
                    <p className="text-secondary mb-0">{t("manage_application_genres")}</p>
                </div>
            </div>


            <div className="d-flex flex-column flex-md-row gap-3 mb-4">
                <div className="flex-grow-1">
                    <SearchBar setSearch={setSearch} />
                </div>
                <div className="d-flex gap-2">
                    <button className="btn btn-primary d-inline-flex align-items-center" onClick={() => setAddGenreModal(true)}>
                        <CirclePlus size={18} />
                        <span className="ms-2">{t("add_genre")}</span>
                    </button>
                </div>
            </div>


            {isLoading && (
                <div className="text-center py-5 text-secondary">
                    <Loader2 size={40} className="spin-anim mb-3" />
                    <p className="mb-0">{t("loading") || "Ładowanie..."}</p>
                </div>
            )}


            {!isLoading && genres.length === 0 && (
                <div className="empty-state text-center py-5">
                    <SearchX size={48} className="text-secondary mb-3" />
                    <h5 className="text-secondary">{t("no_genres_found") || "Nie znaleziono gatunków"}</h5>
                    <p className="text-secondary small mb-0">{t("try_different_search") || "Spróbuj innego wyszukiwania"}</p>
                </div>
            )}


            {!isLoading && genres.length > 0 && (
                <div className="card table-card border-0 shadow-sm mb-4 d-none d-lg-block">
                    <div className="table-responsive">
                        <table className="table table-dark table-hover align-middle mb-0">
                            <thead>
                            <tr>
                                <th className="ps-4">ID</th>
                                <th>{t("name")}</th>
                                <th>{t("movies_count")}</th>
                                <th className="text-end pe-4">{t("action")}</th>
                            </tr>
                            </thead>
                            <tbody>
                            {genres.map((genre) => (
                                <tr key={genre.id}>
                                    <td className="ps-4 text-secondary">{genre.id}</td>
                                    <td className="fw-semibold text-light" title={genre.name}>{genre.name}</td>
                                    <td>
                                        {genre.movies_count > 0 ? (
                                            <span className="badge bg-success">{genre.movies_count}</span>
                                        ) : (
                                            <span className="badge bg-secondary">0</span>
                                        )}
                                    </td>
                                    <td className="text-end pe-4">
                                        <div className="d-inline-flex gap-1">
                                            <IconButton
                                                variant="warning"
                                                icon={Pencil}
                                                title={t("edit_genre")}
                                                onClick={() => openAction(setEditGenreModal, genre)}
                                            />
                                            <IconButton
                                                variant="danger"
                                                icon={Trash}
                                                title={t("delete_genre")}
                                                onClick={() => openAction(setAdminPasswordAuthModal, genre)}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}


            {!isLoading && genres.length > 0 && (
                <div className="d-lg-none mobile-users">
                    {genres.map((genre) => (
                        <div className="user-card" key={genre.id}>
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <div className="min-w-0">
                                    <div className="fw-semibold text-truncate text-light" title={genre.name}>
                                        {genre.name}
                                    </div>
                                    <div className="small text-secondary">ID: {genre.id}</div>
                                </div>
                                <div>
                                    {genre.movies_count > 0 ? (
                                        <span className="badge bg-success">{genre.movies_count}</span>
                                    ) : (
                                        <span className="badge bg-secondary">0</span>
                                    )}
                                </div>
                            </div>

                            <div className="user-details">
                                <div className="row g-2 small text-secondary">
                                    <div className="col-6">
                                        <span className="detail-label">ID</span>
                                        <div className="text-light">{genre.id}</div>
                                    </div>
                                    <div className="col-6">
                                        <span className="detail-label">{t("movies_count")}</span>
                                        <div className="text-light">{genre.movies_count > 0 ? genre.movies_count : 0}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-3 pt-3 border-top border-secondary border-opacity-25">
                                <div className="d-flex flex-wrap gap-2">
                                    <button
                                        className="btn btn-outline-warning btn-sm d-inline-flex align-items-center"
                                        onClick={() => openAction(setEditGenreModal, genre)}
                                    >
                                        <Pencil size={16} />
                                        <span className="ms-1 small">{t("edit")}</span>
                                    </button>
                                    <button
                                        className="btn btn-outline-danger btn-sm d-inline-flex align-items-center"
                                        onClick={() => openAction(setAdminPasswordAuthModal, genre)}
                                    >
                                        <Trash size={16} />
                                        <span className="ms-1 small">{t("delete")}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!isLoading && totalPages > 1 && (
                <Pagination currentPage={currentPage} totalPages={totalPages} changePage={changePage} />
            )}

            <AdminEditGenreModal
                isOpen={editGenreModal}
                onClose={() => {
                    setEditGenreModal(false);
                    setSelectedGenre(null);
                }}
                onConfirm={(data) => {
                    executeAction(editGenre, { genreId: selectedGenre.id, newGenreName: data.newGenreName });
                    setEditGenreModal(false);
                    setSelectedGenre(null);
                }}
                genreName={selectedGenre?.name}
            />

            <AdminPasswordAuthModal
                isOpen={adminPasswordAuthModal}
                onClose={() => {
                    setAdminPasswordAuthModal(false);
                    setSelectedGenre(null);
                }}
                onConfirm={(password) => {
                    executeAction(deleteGenre, { genreId: selectedGenre.id, password }, true);
                    setAdminPasswordAuthModal(false);
                    setSelectedGenre(null);
                }}
            />

            <AdminAddGenre
                isOpen={addGenreModal}
                onClose={() => setAddGenreModal(false)}
                onConfirm={(data) => {
                    executeAction(addGenre, { newGenreName: data.newGenreName }, true);
                    setAddGenreModal(false);
                }}
            />
        </div>
    );
}

export default AdminGenres;