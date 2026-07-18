import config from "../config/api.js";

export function likeFilm(filmId) {

    return fetch(`${config.apiUrl}/likeToggle`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
            filmId: parseInt(filmId),
        })
    })
        .then(res => res.json());

}


export function watchFilm(filmId) {

    return fetch(`${config.apiUrl}/watchedToggle`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
            filmId: parseInt(filmId),
        })
    })
        .then(res => res.json());
}