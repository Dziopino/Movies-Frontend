import { apiRequest, postRequest } from "./apiService.js";


export const getUsers = (page, limit) =>{
    return apiRequest(`getUsers?page=${page}&limit=${limit}`);
}

export const getUsersCount = () => {
    return apiRequest("getUsersCount");
};


export const refreshUser = (userId) => {
    return apiRequest(`refreshUser/${userId}`);
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