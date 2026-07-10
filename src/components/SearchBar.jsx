import { useState } from "react";
import {useTranslation} from "react-i18next";

function SearchBar({ setSearch }) {

    const [value, setValue] = useState("");
    const { t } = useTranslation();

    const handleChange = (e) => {
        const v = e.target.value;
        setValue(v);
        setSearch(v);
    };

    return (
        <input name="search" className="form-control" type="text" value={value} onChange={handleChange} placeholder={t("search")} />

    );
}

export default SearchBar;