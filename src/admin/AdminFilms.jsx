import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import useDebounce from "../hooks/useDebounce.js";
import {banUser, deleteFilm, getFilms, promoteUser, refreshFilm, suspendUser,} from "../services/adminService.js";
import toast from "react-hot-toast";
import SearchBar from "../components/SearchBar.jsx";
import {CirclePlus, Trash} from "lucide-react";
import Pagination from "../components/Pagination.jsx";
import AdminSuspendModal from "./AdminSuspendModal.jsx";
import AdminPasswordAuthModal from "./AdminPasswordAuthModal.jsx";
import useAuth from "../hooks/useAuth.js";

function AdminFilms() {


    const {t} = useTranslation();
    const [films, setFilms] = useState([]);
    const [filmsCount, setFilmsCount] = useState(0);
    const [suspendModal, setSuspendModal] = useState(false);
    const [selectedFilm, setSelectedFilm] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const filmsPerPage = 50;
    const [totalPages, setTotalPages] = useState(0);
    const [adminPasswordAuthModal, setAdminPasswordAuthModal] = useState(false);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);
    const {userData} = useAuth();

    const changePage = (page) => {
        setCurrentPage(page);
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const updateFilm = async (filmId) => {
        try {
            const data = await refreshFilm(filmId);

            if(!data.success){
                return toast.error(t(data.message));
            }

            setFilms(prevFilms =>
                prevFilms.map(film =>
                    film.id === filmId ? data.film : film
                )
            );

        } catch(error) {
            toast.error("failed_to_refresh_films");
            console.error(error);
        }
    };

    const loadFilms = async () => {
        try {

            const filmsData = await getFilms(currentPage, filmsPerPage, debouncedSearch.trim());

            if(!filmsData.success){
                return toast.error(t(filmsData.message));
            }

            setFilms(filmsData.films);
            setTotalPages(filmsData.totalPages);
            setFilmsCount(filmsData.films_count);

        } catch(error) {
            toast.error("failed_to_load_films");
            console.error(error);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCurrentPage(1);
    }, [debouncedSearch]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadFilms();
    }, [currentPage, debouncedSearch]);

    const executeAction = async (action, data, reloadList = false) => {
        try {
            const response = await action(data);

            if(!response.success){
                return toast.error(t(response.message));
            }

            if (reloadList) {
                await loadFilms();
            } else {
                await updateFilm(data.filmId);
            }


            toast.success(t(response.message));

        } catch(error) {
            toast.error(t("something_went_wrong"));
            console.error(error);
        }
    };

    return (
        <div className="container admin-users mb-4">
            <h1 className="text-center text-">{t("movies")}<span className="users-count fw-normal ms-2">({filmsCount})</span></h1>
            <p>{t("manage_application_films")}</p>

            <div className="d-flex justify-content-between align-items-center gap-3 mb-4 mt-4">
                <SearchBar setSearch={setSearch}/>

                <button className="btn btn-primary">
                    <CirclePlus size={18}/>
                    <span className="ms-2">{t("add_film")}</span>
                </button>
            </div>
            <div className="table-responsive admin-table">
                <table className="table table-dark align-middle">
                    <thead>
                    <tr>
                        <th>{t("film")}</th>
                        <th>{t("rating")}</th>
                        <th>{t("release_date")}</th>
                        <th>{t("duration")}</th>
                        <th className="text-end">{t("action")}</th>
                    </tr>
                    </thead>

                    <tbody>

                    {films.map(film => (
                        <tr key={film.id}>
                            <td>
                                <div className="d-flex align-items-center">
                                    <img className="admin-table-image" src={"/"+film.poster_url} alt={t("film_poster")}/>

                                    <div className="ms-3">
                                        <strong title={film.title}>{film.title}</strong>
                                        <div className="small">ID: {film.id}</div>
                                    </div>
                                </div>
                            </td>

                            <td title={film.rating}>{film.rating}</td>

                            <td>{new Date(film.release_date).toLocaleDateString(userData.language_code)}</td>

                            <td>{parseInt(film.duration/60)}h {film.duration%60}min</td>


                            <td className="text-end">
                                <>
                                    <button className="btn btn-sm btn-outline-danger" title={t("delete_film")} onClick={()=>{setSelectedFilm(film);setAdminPasswordAuthModal(true)}}>
                                        <Trash size={16}/>
                                    </button>
                                </>
                            </td>

                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>


            <div className="mobile-users">
                {films.map(film => (
                    <div className="user-card" key={film.id}>

                        <div className="d-flex align-items-center">
                            <img className="admin-table-image" src={"/"+film.poster_url} alt={t("film_poster")}/>

                            <div className="ms-3 user-info">
                                <strong title={film.title}>{film.title}</strong>
                                <div className="small">ID: {film.id}</div>
                            </div>
                        </div>

                        <hr/>

                        <div className="user-details">
                            <p title={film.rating}>
                                {t("rating")+": "}
                                <b>{film.rating}</b>
                            </p>

                            <p>
                                {t("release_date")+": "}
                                <b>{new Date(film.release_date).toLocaleDateString(userData.language_code)}</b>
                            </p>

                            <p>
                                {t("duration")+": "}
                                <b>{parseInt(film.duration/60)}h {film.duration%60}min</b>
                            </p>
                        </div>

                        <div className="mt-3">
                             <>

                                 <button className="btn btn-outline-danger" onClick={()=>{setSelectedFilm(film);setAdminPasswordAuthModal(true)}}>
                                     <Trash size={16}/>
                                     <span className="ms-1">{t("delete")}</span>
                                 </button>
                             </>
                        </div>

                    </div>
                ))}

            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} changePage={changePage}/>

            <AdminPasswordAuthModal
                isOpen={adminPasswordAuthModal}
                onClose={()=>{
                    setAdminPasswordAuthModal(false);
                    setSelectedFilm(null);
                }}
                onConfirm={(password)=>{
                    executeAction(deleteFilm,{
                        filmId:selectedFilm.id,
                        password,
                    },
                        true
                    );
                    setAdminPasswordAuthModal(false);
                    setSelectedFilm(null);
                }}
            />

            <AdminSuspendModal
                isOpen={suspendModal}
                onClose={()=>{
                    setSuspendModal(false);
                    setSelectedFilm(null);
                }}
                onConfirm={(data)=>{

                    executeAction(suspendUser,{
                        filmId:selectedFilm.id,
                        filmStatus:selectedFilm.status,
                        suspendReason:data.reason,
                        suspendUntil:data.until
                    });

                    setSuspendModal(false);
                    setSelectedFilm(null);
                }}
            />
        </div>
    );
}

export default AdminFilms