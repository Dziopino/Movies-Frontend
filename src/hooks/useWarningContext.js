import useFilmContext from "./useFilmContext.js";
import {WarningContext} from "../context/WarningContext.jsx";


function UseWarningContext() {
    return useFilmContext(WarningContext);
}

export default UseWarningContext;