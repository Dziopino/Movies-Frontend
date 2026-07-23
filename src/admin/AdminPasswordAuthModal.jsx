import {useState} from "react";
import {useTranslation} from "react-i18next";

function AdminPasswordAuthModal({isOpen, onClose, onConfirm}) {

    const [password, setPassword] = useState("");
    const {t} = useTranslation();

    if(!isOpen){
        return null;
    }


    const confirmPassword = (e) => {
        e.preventDefault();

        if(!password){
            return;
        }

        onConfirm(password);
        setPassword("");

    };


    return (
        <div className="admin-modal-overlay">

            <form className="admin-modal" onSubmit={confirmPassword}>

                <h3>{t("confirm_promotion")}</h3>


                <label className="mt-3" htmlFor="password">
                    {t("password")}
                </label>


                <input id="password" type="password" className="form-control mt-2" placeholder={t("enter_your_password")} value={password} onChange={(e)=>setPassword(e.target.value)}/>


                <div className="d-flex justify-content-end gap-2 mt-4">

                    <button className="btn btn-secondary" type="button" onClick={()=>{setPassword("");onClose();}}>
                        {t("cancel")}
                    </button>


                    <button className="btn btn-success" type="submit" disabled={!password.trim()}>
                        {t("confirm")}
                    </button>

                </div>
            </form>
        </div>
    );
}

export default AdminPasswordAuthModal;