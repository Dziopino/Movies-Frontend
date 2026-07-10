import {createContext} from "react";
import useFilms from "../hooks/useFilms";

// eslint-disable-next-line react-refresh/only-export-components
export const FilmContext = createContext();

export function FilmProvider({children}) {

    const {likeToggle, watchedToggle} = useFilms();


    return (
        <FilmContext.Provider value={{likeToggle, watchedToggle}}>
            {children}
        </FilmContext.Provider>
    );
}