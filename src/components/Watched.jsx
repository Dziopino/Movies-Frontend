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
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search,500);
    const [currentPage,setCurrentPage] = useState(1);
    const [totalPages,setTotalPages] = useState(0);

    const changePage = (page)=>{

        setCurrentPage(page);

        window.scrollTo({
            top:0,
            behavior:"smooth"
        });

    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const reloadFilms = useCallback(() =>{

        fetch(`${config.apiUrl}/watchedGet`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer " + localStorage.getItem("token")
            },
            body:JSON.stringify({
                page:currentPage,
                search:debouncedSearch
            })
        })
            .then(res=>res.json())
            .then(data=>{
                if(data.message === "Watched got successfully"){
                    setWatched(data.body);
                    setTotalPages(data.totalPages);
                }
                else{
                    alert(data.message);
                }
            })

    },[currentPage,debouncedSearch]);

    useEffect(()=>{

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCurrentPage(1);

    },[debouncedSearch]);

    useEffect(() => {

        const blocked = showWarningPopup();

        if (!blocked) {
            reloadFilms();
        }

    },[userData.id,currentPage,debouncedSearch]);

    return (
        <>
            <div className="container py-5 p-4">

                <PageHeader setSearch={setSearch} title={t("watched")} />

                <div className="row  row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-4 g-5">
                    {watched.map((watched) => (
                        <div className="col" key={watched.id}>
                            <div className="card h-100 bg-dark d-flex flex-column">

                                <img loading="lazy" src={watched.poster_url} className="card-img-top" alt="Movie Image" onClick={() => navigate(`/film/${watched.id}`)}/>

                                <div className="card-body" onClick={() => navigate(`/film/${watched.id}`)} >
                                    <h2 className="card-title text-white" style={{fontSize:"1.25rem"}}>{watched.title}</h2>
                                </div>

                                <div className="card-footer bg-dark border-0 mt-auto d-flex justify-content-end gap-3">
                                    {!userData.id ? (
                                        <>
                                            <img onClick={() => likeToggle(watched.id)} style={{height:"2rem", cursor:"pointer"}} src="/favourite.svg" alt="favourite icon"/>
                                            <img onClick={() => watchedToggle(watched.id)} style={{height:"2rem", cursor:"pointer"}} src="/unseen.svg" alt="watched icon"/>
                                        </>
                                    ):(
                                        <>
                                            <img onClick={() => likeToggle(watched.id,reloadFilms)} style={{height:"2rem", cursor:"pointer"}} src={watched.userFavoritesFilms === null? "/favourite.svg" : "/favouriteRed.svg"} alt="favourite icon"/>
                                            <img onClick={() => watchedToggle(watched.id,reloadFilms)} style={{height:"2rem", cursor:"pointer"}} src={watched.film_id === null ? "/unseen.svg" : "/seen.svg"} alt="watched icon"/>
                                        </>
                                    )

                                    }
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <Pagination
                    currentPage= {currentPage}
                    totalPages = {totalPages}
                    changePage = {changePage}
                />
            </div>
        </>
    )
}
export default Watched;