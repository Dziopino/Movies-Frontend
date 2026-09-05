import i18n from '../i18n';

const originalFetch = window.fetch;

let globalErrorHandler = null;

export const registerGlobalFetchHandler = (handler) => {
    globalErrorHandler = handler;
};

window.fetch = async (...args) => {
    try {
        const response = await originalFetch(...args);

        if (response.status === 429) {
            const clonedResponse = response.clone();

            try {
                const errorData = await clonedResponse.json();
                const errorKey = errorData.error_key || 'error.rate_limit_exceeded';
                const translatedMessage = i18n.t(errorKey);
                const retryAfter = errorData.retryAfter || 900;

                if (globalErrorHandler) {
                    globalErrorHandler({
                        errorKey,
                        message: translatedMessage,
                        retryAfter,
                        limit: errorData.limit,
                        remaining: errorData.remaining
                    });
                }
                // eslint-disable-next-line no-unused-vars
            } catch (e) {
                console.warn('[RATE LIMIT] Could not parse 429 response body');
            }

            return response;
        }

        return response;
    } catch (error) {
        console.error('[FETCH ERROR]', error);
        throw error;
    }
};

export default window.fetch;
