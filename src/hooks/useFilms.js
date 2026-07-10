import {useCallback} from "react";
import {useContext} from "react";
import {AuthContext} from "../context/AuthContext";
import {likeFilm, watchFilm} from "../services/filmService";


function useFilms() {

    const {userData} = useContext(AuthContext);
    console.log(userData);


    const likeToggle = useCallback((filmId, reloadFilms) => {

        if (!userData.id) {
            alert("You can't like on guest account!");
            return;
        }

        if (!filmId) {
            alert("Something went wrong!");
            return;
        }


        likeFilm(filmId, userData.id)
            .then(() => reloadFilms());
    }, [userData.id]);



    const watchedToggle = useCallback((filmId, reloadFilms) => {

        if (!userData.id) {
            alert("You can't watch on guest account!");
            return;
        }

        if (!filmId) {
            alert("Something went wrong!");
            return;
        }


        watchFilm(filmId, userData.id)
            .then(() => reloadFilms());
    }, [userData.id]);


    return {
        likeToggle,
        watchedToggle
    };

}

export default useFilms;