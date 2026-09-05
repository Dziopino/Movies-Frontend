import { createContext, useContext, useState } from 'react';

const ErrorContext = createContext();

export const useError = () => {
    const context = useContext(ErrorContext);
    if (!context) {
        throw new Error('useError must be used within ErrorProvider');
    }
    return context;
};

export const ErrorProvider = ({ children }) => {
    const [rateLimitError, setRateLimitError] = useState(null);

    const showRateLimitError = (errorInfo) => {
        setRateLimitError(errorInfo);
    };

    const clearRateLimitError = () => {
        setRateLimitError(null);
    };

    return (
        <ErrorContext.Provider value={{
            rateLimitError,
            showRateLimitError,
            clearRateLimitError
        }}>
            {children}
        </ErrorContext.Provider>
    );
};
