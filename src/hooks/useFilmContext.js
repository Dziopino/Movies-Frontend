import {useContext} from 'react';
import {FilmContext} from "../context/FilmContext.jsx";

function UseFilmContext() {
    return useContext(FilmContext);
}

export default UseFilmContext;