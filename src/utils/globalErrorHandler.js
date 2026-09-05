import i18n from '../i18n';

const originalFetch = window.fetch;

let errorCallback = null;

export const setupGlobalErrorHandler = (callback) => {
    errorCallback = callback;
    console.log('[GLOBAL HANDLER] Error callback registered');
};

window.fetch = async function(...args) {
    console.log('[FETCH INTERCEPT] Request to:', args[0]);

    try {
        const response = await originalFetch.apply(this, args);

        if (response.status === 429) {
            console.log('[FETCH INTERCEPT] 429 detected!');

            const clone = response.clone();
            const data = await clone.json().catch(() => ({}));

            const errorKey = data.error_key || 'error.rate_limit_exceeded';
            const message = i18n.t(errorKey);
            const retryAfter = data.retryAfter || 900;

            console.log('[FETCH INTERCEPT] Calling error callback', {
                errorKey,
                message,
                retryAfter
            });

            if (errorCallback) {
                errorCallback({
                    errorKey,
                    message,
                    retryAfter,
                    limit: data.limit,
                    remaining: data.remaining
                });
            }
        }

        return response;
    } catch (error) {
        console.error('[FETCH INTERCEPT] Error:', error);
        throw error;
    }
};

console.log('[GLOBAL HANDLER] window.fetch override installed');
