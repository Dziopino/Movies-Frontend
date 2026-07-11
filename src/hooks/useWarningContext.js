import {useContext} from "react";
import {WarningContext} from "../context/WarningContext.jsx";

function useWarningContext() {
    return useContext(WarningContext);
}

export default useWarningContext;