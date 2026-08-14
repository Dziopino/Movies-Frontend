import config from "../config/api.js";

export function UserAvatar({ url, alt }) {
    return (
        <img className="admin-table-image" src={url === null ? "/guest.webp" : `${config.apiUrl}${url}`} alt={alt} loading="lazy"/>
    )
}