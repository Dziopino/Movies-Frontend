import {useCallback} from "react";
import {useContext} from "react";
import {AuthContext} from "../context/AuthContext";
import {likeFilm, watchFilm} from "../services/filmService";


function useFilms() {

    const {userData} = useContext(AuthContext);

    const likeToggle = useCallback(async (filmId, callback) => {

        if (!userData.id) {
            alert("You can't like on guest account!");
            return;
        }

        if (!filmId) {
            alert("Something went wrong!");
            return;
        }

        try {
            const response = await likeFilm(filmId, userData.id);
            if (callback) {
                callback(response);
            }
            return response;
        } catch (err) {
            console.error("Error toggling like:", err);
        }
    }, [userData.id]);



    const watchedToggle = useCallback(async (filmId, callback) => {

        if (!userData.id) {
            alert("You can't watch on guest account!");
            return;
        }

        if (!filmId) {
            alert("Something went wrong!");
            return;
        }

        try {
            const response = await watchFilm(filmId, userData.id);
            if (callback) {
                callback(response);
            }
            return response;
        } catch (err) {
            console.error("Error toggling watched:", err);
        }
    }, [userData.id]);


    return {
        likeToggle,
        watchedToggle
    };

}

export default useFilms;