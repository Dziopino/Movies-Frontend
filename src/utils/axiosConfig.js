import axios from 'axios';
import i18n from '../i18n';

let rateLimitErrorHandler = null;

export const setupAxiosInterceptor = (onRateLimitError) => {
    rateLimitErrorHandler = onRateLimitError;

    axios.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response && error.response.status === 429) {
                const errorData = error.response.data;
                const errorKey = errorData.error_key || 'error.rate_limit_exceeded';
                const translatedMessage = i18n.t(errorKey);
                const retryAfter = errorData.retryAfter || 900;

                console.warn('[RATE LIMIT] Request blocked:', {
                    path: error.config?.url,
                    errorKey,
                    retryAfter,
                    limit: errorData.limit,
                    current: errorData.current
                });

                if (rateLimitErrorHandler) {
                    rateLimitErrorHandler({
                        errorKey,
                        message: translatedMessage,
                        retryAfter,
                        limit: errorData.limit,
                        remaining: errorData.remaining
                    });
                }

                return Promise.reject({
                    isRateLimitError: true,
                    translatedMessage,
                    errorKey,
                    response: {
                        data: { success: false, message: translatedMessage },
                        status: 429
                    }
                });
            }

            return Promise.reject(error);
        }
    );
};

const axiosInstance = axios.create();
export default axiosInstance;

