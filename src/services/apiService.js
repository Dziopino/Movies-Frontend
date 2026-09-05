import config from "../config/api.js";

export async function apiRequest(endpoint, options = {}) {
    // Add /api prefix if not already present
    const normalizedEndpoint = endpoint.startsWith('/api/') ? endpoint : `/api/${endpoint.replace(/^\//, '')}`;

    const response = await fetch(`${config.apiUrl}${normalizedEndpoint}`, {
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

export const postFormDataRequest = (endpoint, formData) => {
    return apiRequest(endpoint, {
        method: "POST",
        body: formData
    });
};