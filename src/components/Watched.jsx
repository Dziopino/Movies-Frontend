import {useState, useEffect, useCallback} from "react";
import {useNavigate} from "react-router-dom";

function Watched({userData,setShowWarning,onLikeToggle,onWatchedToggle}) {

    const navigate = useNavigate();


    const [watched, setWatched] = useState([]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const reloadFilms = useCallback(() =>{
        fetch("http://localhost:8000/watchedGet",{
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({userId : userData.id}),
        }).then((res) => res.json()).then((data) => {
            if (data.message === "Watched got successfully") {
                setWatched(data.body);
            }else{
                alert(data.message);
            }
        })
    })

    useEffect(() => {
        if(!userData.id){
            setShowWarning(true);
            return navigate("/",{replace:true});
        }

        reloadFilms();
    },[navigate, reloadFilms, setShowWarning, userData.id])

    return (
        <>
            <div className="container py-5 p-4">
                <h1 className="text-center mb-5">Watched</h1>
                <div className="row  row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-4 g-5">
                    {watched.map((watched) => (
                        <div className="col" key={watched.id}>
                            <div className="card h-100 bg-dark d-flex flex-column">

                                <img src={watched.poster_url} className="card-img-top" alt="Movie Image"/>

                                <div className="card-body">
                                    <h5 className="card-title text-white">{watched.title}</h5>
                                </div>

                                <div className="card-footer bg-dark border-0 mt-auto d-flex justify-content-end gap-3">
                                    {!userData.id ? (
                                        <>
                                            <img onClick={() => onLikeToggle(watched.id)} style={{height:"2rem", cursor:"pointer"}} src="/favourite.png" alt="favourite icon"/>
                                            <img onClick={() => onWatchedToggle(watched.id)} style={{height:"2rem", cursor:"pointer"}} src="/unseen.png" alt="watched icon"/>
                                        </>
                                    ):(
                                        <>
                                            <img onClick={() => onLikeToggle(watched.id,reloadFilms)} style={{height:"2rem", cursor:"pointer"}} src={watched.userFavoritesFilms === null? "/favourite.png" : "/favouriteRed.png"} alt="favourite icon"/>
                                            <img onClick={() => onWatchedToggle(watched.id,reloadFilms)} style={{height:"2rem", cursor:"pointer"}} src={watched.film_id === null ? "/unseen.png" : "/seen.png"} alt="watched icon"/>
                                        </>
                                    )

                                    }

                                </div>

                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}
export default Watched;