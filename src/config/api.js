const config = {
    apiUrl: import.meta.env.VITE_API_URL,
};

export function resolveImageUrl(url) {
    if (!url) return null;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `${config.apiUrl}${url}`;
}

export const DEFAULT_AVATAR_URL = 'https://res.cloudinary.com/vssq7eqn/image/upload/v1/cinemix/posters/guest.webp';

export default config;