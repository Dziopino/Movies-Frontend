import config from "../config/api.js";

export function likeFilm(filmId, userId) {

    return fetch(`${config.apiUrl}/likeToggle`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            filmId: parseInt(filmId),
            userId: parseInt(userId)
        })
    })
        .then(res => res.json());

}


export function watchFilm(filmId, userId) {

    return fetch(`${config.apiUrl}/watchedToggle`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            filmId: parseInt(filmId),
            userId: parseInt(userId)
        })
    })
        .then(res => res.json());
}