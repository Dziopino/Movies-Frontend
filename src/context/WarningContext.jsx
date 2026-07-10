import useWarning from "../hooks/useWarning.js";
import useAuth from "../hooks/useAuth.js";
import {createContext} from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const WarningContext = createContext();

export function WarningProvider({ children }) {
    const {userData} = useAuth();
    const {showWarning, fadeWarning, showWarningPopup} = useWarning(userData);

    return (
        <WarningContext.Provider value={{showWarning, fadeWarning, showWarningPopup}}>{children}</WarningContext.Provider>
    )
}

export default WarningContext;