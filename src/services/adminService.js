import { apiRequest, postRequest } from "./apiService.js";


export const getUsers = (page, limit, search = "") =>{
    return apiRequest(`getUsers?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`);
}

export const refreshUser = (userId) => {
    return apiRequest(`refreshUser/${userId}`);
};

export const getGenres = (page, limit, search) =>{
    return apiRequest(`getGenres?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`);
}

export const refreshGenre = (genreId) => {
    return apiRequest(`refreshGenre/${genreId}`);
};

export const getFilms = (page, limit, search) =>{
    return apiRequest(`getFilmsAdmin?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`);
}

export const refreshFilm = (filmId) => {
    return apiRequest(`refreshFilm/${filmId}`);
};

export const banUser = (data) => {
    return postRequest("banUser", data);
};

export const suspendUser = (data) => {
    return postRequest("suspendUser", data);
};

export const unSuspendUser = (data) => {
    return postRequest("unSuspendUser", data);
};

export const unBanUser = (data) => {
    return postRequest("unBanUser", data);
};

export const promoteUser = (data) => {
    return postRequest("promoteUser", data);
};

export const deleteGenre = (data) => {
    return postRequest("deleteGenre", data);
};

export const editGenre = (data) => {
    return postRequest("editGenre", data);
};

export const addGenre = (data) => {
    return postRequest("addGenre", data);
};

export const deleteFilm = (data) => {
    return postRequest("deleteFilm", data);
};

export const addFilm = (data) => {
    return postRequest("addFilm", data);
};

export const addAdmin = (data) => {
    return postRequest("addAdmin", data);
};


