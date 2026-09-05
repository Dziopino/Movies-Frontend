import i18n from '../i18n';

let globalErrorHandler = null;

export const registerErrorHandler = (handler) => {
    globalErrorHandler = handler;
};

export const fetchWithRateLimitHandling = async (url, options = {}) => {
    try {
        const response = await fetch(url, options);

        if (response.status === 429) {
            const errorData = await response.json().catch(() => ({
                error_key: 'error.rate_limit_exceeded',
                retryAfter: 900
            }));

            const errorKey = errorData.error_key || 'error.rate_limit_exceeded';
            const translatedMessage = i18n.t(errorKey);
            const retryAfter = errorData.retryAfter || 900;

            console.warn('[RATE LIMIT] Request blocked:', {
                url,
                errorKey,
                retryAfter,
                limit: errorData.limit,
                current: errorData.current
            });

            if (globalErrorHandler) {
                globalErrorHandler({
                    errorKey,
                    message: translatedMessage,
                    retryAfter,
                    limit: errorData.limit,
                    remaining: errorData.remaining
                });
            }

            return {
                ok: false,
                status: 429,
                statusText: 'Too Many Requests',
                json: async () => ({ success: false, error_key: errorKey, message: translatedMessage }),
                text: async () => translatedMessage,
                isRateLimited: true
            };
        }

        return response;
    } catch (error) {
        console.error('[FETCH ERROR]', error);
        throw error;
    }
};

export default fetchWithRateLimitHandling;
