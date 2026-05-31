import {useCallback, useEffect, useState} from "react";



function Home({userData,showWarning,onLikeToggle,onWatchedToggle}) {

    const [films, setFilms] = useState([]);
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const reloadFilms = useCallback(() =>{
        fetch("http://localhost:8000/getFilms", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: userData.id })
        }).then(res => res.json())
            .then(data => {
                if (data.body && data.body.length > 0) {
                    return setFilms(data.body);
                }
                return alert(data.message);
            })
    })



    useEffect(() => {
        reloadFilms();
    },[reloadFilms, userData]);




    return (
        <>
            <div className="container py-5 p-4">
                {showWarning && (
                    <p className="text-danger text-center">You can't go here as guest!</p>
                )}
                <h1 className="text-center mb-5">Movies</h1>
                <div className="row  row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-4 g-5">
                    {films.map((film) => (
                        <div className="col" key={film.id}>
                            <div className="card h-100 bg-dark d-flex flex-column">

                                <img src={film.poster_url} className="card-img-top" alt="Movie Image"/>

                                <div className="card-body">
                                    <h5 className="card-title text-white">{film.title}</h5>
                                </div>

                                <div className="card-footer bg-dark border-0 mt-auto d-flex justify-content-end gap-3">
                                    {!userData.id ? (
                                        <>
                                            <img onClick={() => onLikeToggle(film.id)} style={{height:"2rem", cursor:"pointer"}} src="/favourite.png" alt="favourite icon"/>
                                            <img onClick={() => onWatchedToggle(film.id)} style={{height:"2rem", cursor:"pointer"}} src="/unseen.png" alt="watched icon"/>
                                        </>
                                    ):(
                                        <>
                                            <img onClick={() => onLikeToggle(film.id,reloadFilms)} style={{height:"2rem", cursor:"pointer"}} src={film.film_id === null ? "/favourite.png" : "/favouriteRed.png"} alt="favourite icon"/>
                                            <img onClick={() => onWatchedToggle(film.id,reloadFilms)} style={{height:"2rem", cursor:"pointer"}} src={film.watchedFilmId === null ? "/unseen.png" : "/seen.png"} alt="watched icon"/>
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

export default Home