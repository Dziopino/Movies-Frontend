import SearchBar from "../components/SearchBar.jsx";
import {CirclePlus, Pencil, Trash} from "lucide-react";
import {deleteGenre, editGenre, refreshGenre, getGenres, addGenre} from "../services/adminService.js";
import Pagination from "../components/Pagination.jsx";
import AdminPasswordAuthModal from "./AdminPasswordAuthModal.jsx";
import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import toast from "react-hot-toast";
import useDebounce from "../hooks/useDebounce.js";
import AdminEditGenreModal from "./AdminEditGenreModal.jsx";
import AdminAddGenre from "./AdminAddGenre.jsx";



function AdminGenres() {

    const {t} = useTranslation();
    const [genres, setGenres] = useState([]);
    const [genresCount, setGenresCount] = useState(0);
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
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const updateGenres = async (genreId) => {
        try {
            const data = await refreshGenre(genreId);

            if(!data.success){
                return toast.error(t(data.message));
            }

            setGenres(prevGenres =>
                prevGenres.map(genre =>
                    genre.id === genreId ? data.genre : genre
                )
            );

        } catch(error) {
            toast.error("failed_to_refresh_genres");
            console.error(error);
        }
    };

    const loadGenres = async () => {
        try {

            const genresData = await getGenres(currentPage, genresPerPage, debouncedSearch.trim());

            if(!genresData.success){
                return toast.error(t(genresData.message));
            }

            setGenres(genresData.genres);
            setTotalPages(genresData.totalPages);
            setGenresCount(genresData.genres_count);

        } catch(error) {
            toast.error("failed_to_load_genres");
            console.error(error);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCurrentPage(1);
    }, [debouncedSearch]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadGenres();
    }, [currentPage, debouncedSearch]);

    const executeAction = async (action, data, reloadList = false) => {
        try {
            const response = await action(data);

            if (!response.success) {
                return toast.error(t(response.message));
            }

            if (reloadList) {
                await loadGenres();
            } else {
                await updateGenres(data.genreId);
            }

            toast.success(t(response.message));

        } catch (error) {
            toast.error(t("something_went_wrong"));
            console.error(error);
        }
    };

    return (
        <div className="container admin-users mb-4">
            <h1 className="text-center text-">{t("genres")}<span className="users-count fw-normal ms-2">({genresCount})</span></h1>
            <p>{t("manage_application_genres")}</p>

            <div className="d-flex justify-content-between align-items-center gap-3 mb-4 mt-4">
                <SearchBar setSearch={setSearch}/>

                <button className="btn btn-primary" onClick={()=>{setAddGenreModal(true)}}>
                    <CirclePlus size={18}/>
                    <span className="ms-2">{t("add_genre")}</span>
                </button>
            </div>
            <div className="table-responsive admin-table">
                <table className="table table-dark align-middle">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>{t("name")}</th>
                        <th>{t("movies_count")}</th>
                        <th>{t("action")}</th>
                    </tr>
                    </thead>

                    <tbody>

                    {genres.map(genre => (
                        <tr key={genre.id}>
                            <td>
                                <div className="d-flex align-items-center">
                                    <div>
                                        <div>{genre.id}</div>
                                    </div>
                                </div>
                            </td>

                            <td title={genre.name}>{genre.name}</td>

                            <td>
                                {genre.movies_count > 0 ? (
                                    <span className="badge bg-success" title={genre.movies_count}>
                                        {genre.movies_count}
                                    </span>
                                ) : (
                                    <span className="badge bg-secondary">
                                        0
                                    </span>
                                )}
                            </td>


                            <td className="text-end">
                                <>
                                    <button className="btn btn-sm btn-outline-warning me-2" title={t("edit_genre")} onClick={()=>{setSelectedGenre(genre);setEditGenreModal(true)}}>
                                        <Pencil size={16}/>
                                    </button>
                                    <button className="btn btn-sm btn-outline-danger" title={t("delete_genre")} onClick={()=>{setSelectedGenre(genre);setAdminPasswordAuthModal(true)}}>
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
                {genres.map(genre => (
                    <div className="user-card" key={genre.id}>

                        <div className="d-flex align-items-center">
                                <div className="users-count">ID: {genre.id}</div>
                        </div>

                        <hr/>

                        <div className="user-details">
                            <p>{t("name")}: <b title={genre.name}>{genre.name}</b></p>

                            <p>
                                {t("movies_count")}
                                <b className={genre.movies_count > 0 ? "badge bg-success ms-2" : "badge bg-secondary ms-2"}>
                                    {genre.movies_count > 0 ? genre.movies_count : 0}
                                </b>
                            </p>
                        </div>

                        <div className="mt-3">
                            <>
                                <button className="btn btn-outline-warning me-2" onClick={()=>{setSelectedGenre(genre);setEditGenreModal(true)}}>
                                    <Pencil size={16}/>
                                    <span className="ms-1">{t("edit")}</span>
                                </button>

                                <button className="btn btn-outline-danger" onClick={()=>{setSelectedGenre(genre);setAdminPasswordAuthModal(true)}}>
                                    <Trash size={16}/>
                                    <span className="ms-1">{t("delete")}</span>
                                </button>
                            </>
                        </div>

                    </div>
                ))}

            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} changePage={changePage}/>

            <AdminEditGenreModal
                isOpen={editGenreModal}
                onClose={()=>{
                    setEditGenreModal(false);
                    setSelectedGenre(null);
                }}
                onConfirm={(data)=>{

                    executeAction(editGenre,{
                        genreId:selectedGenre.id,
                        newGenreName:data.newGenreName,
                    });

                    setEditGenreModal(false);
                    setSelectedGenre(null);
                }}
                genreName={selectedGenre?.name}
            />

            <AdminPasswordAuthModal
                isOpen={adminPasswordAuthModal}
                onClose={()=>{
                    setAdminPasswordAuthModal(false);
                    setSelectedGenre(null);
                }}
                onConfirm={(password)=>{

                    executeAction(deleteGenre, {
                            genreId: selectedGenre.id,
                            password
                        },
                        true
                    );

                    setAdminPasswordAuthModal(false);
                    setSelectedGenre(null);
                }}
            />


            <AdminAddGenre
                isOpen={addGenreModal}
                onClose={()=>{
                    setAddGenreModal(false);
                }}
                onConfirm={(data)=>{

                    executeAction(addGenre,{
                        newGenreName:data.newGenreName,
                    },
                        true
                    )

                    setAddGenreModal(false);
                }}
            />
        </div>
    )
}
export default AdminGenres;