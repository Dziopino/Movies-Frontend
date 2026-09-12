import config, { resolveImageUrl, DEFAULT_AVATAR_URL } from "../config/api.js";

export function UserAvatar({ url, alt }) {
    return (
        <img className="admin-table-image" src={url === null ? DEFAULT_AVATAR_URL : resolveImageUrl(url)} alt={alt} loading="lazy"/>
    )
}