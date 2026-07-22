import config from "../config/api.js";

export async function apiRequest(endpoint, options = {}) {

    const response = await fetch(`${config.apiUrl}/${endpoint}`, {
        ...options,
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            ...options.headers
        }
    });

    return response.json();
}

export const postRequest = (endpoint, data) => {
    return apiRequest(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
};