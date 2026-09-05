import { useTranslation } from "react-i18next";
import { ShieldAlert, Clock } from "lucide-react";

function RateLimitAlert({ message, retryAfter, onDismiss }) {
    const { t } = useTranslation();

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        if (minutes > 0) {
            return `${minutes} ${t('minutes')} ${secs > 0 ? `${secs}s` : ''}`;
        }
        return `${secs}s`;
    };

    return (
        <div className="alert alert-warning d-flex align-items-start border-warning bg-dark text-white p-4 mb-4" role="alert">
            <ShieldAlert size={32} className="text-warning me-3 flex-shrink-0" style={{ marginTop: '2px' }} />
            <div className="flex-grow-1">
                <h5 className="alert-heading text-warning mb-2 d-flex align-items-center">
                    <strong>{t('rate_limit_exceeded_title')}</strong>
                </h5>
                <p className="mb-2">{message}</p>
                <div className="d-flex align-items-center text-warning-emphasis mt-3">
                    <Clock size={18} className="me-2" />
                    <span className="fw-semibold">
                        {t('retry_after')}: {formatTime(retryAfter)}
                    </span>
                </div>
            </div>
            {onDismiss && (
                <button type="button" className="btn-close btn-close-white ms-3" onClick={onDismiss} aria-label="Close"></button>
            )}
        </div>
    );
}

export default RateLimitAlert;
