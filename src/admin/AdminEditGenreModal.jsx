import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";

function AdminEditGenreModal({isOpen, onClose, onConfirm, genreName}) {
    const [newGenreName, setGenreName] = useState("");
    const {t} = useTranslation();

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setGenreName(genreName || "");
    }, [genreName]);

    if(!isOpen){
        return null;
    }


    const confirmEdition = (e) => {
        e.preventDefault();
        onConfirm({newGenreName});
        setGenreName("");
    };


    return (
        <div className="admin-modal-overlay">
            <form className="admin-modal" onSubmit={confirmEdition}>
                <h3>{t("edit_genre")}</h3>

                <label className="mt-3" htmlFor="genre_name">
                    {t("genre_name")}
                </label>

                <input id="genre_name" className="form-control mt-2" placeholder={t("enter_genre_name")} value={newGenreName} onChange={(e)=>setGenreName(e.target.value)}/>

                <div className="d-flex justify-content-end gap-2 mt-4">

                    <button className="btn btn-secondary" type="button" onClick={onClose}>
                        {t("cancel")}
                    </button>


                    <button className="btn btn-warning" type="submit" disabled={!newGenreName}>
                        {t("edit")}
                    </button>

                </div>

            </form>

        </div>
    );
}

export default AdminEditGenreModal;