import {useState} from "react";
import {useTranslation} from "react-i18next";
import PasswordValidator from "../components/PasswordValidator.jsx";
import {isPasswordValid} from "../utils/passwordValidator.js";

function AdminAddAdminModal({isOpen, onClose, onConfirm}) {

    const {t} = useTranslation();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");


    if(!isOpen){
        return null;
    }


    const confirmAddAdmin = (e) => {
        e.preventDefault();

        if(password !== confirmPassword){
            return setMessage("passwords_dont_match");
        }

        if(!isPasswordValid(password)){
            return setMessage("password_requirements_not_met");
        }


        onConfirm({
            username,
            email,
            password
        });


        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setMessage("");
    };


    return (
        <div className="admin-modal-overlay">

            <form className="admin-modal" onSubmit={confirmAddAdmin}>

                <h3>{t("add_admin")}</h3>


                <label className="mt-3" htmlFor="username">
                    {t("username")}
                </label>

                <input
                    id="username"
                    type="text"
                    className="form-control mt-2"
                    value={username}
                    onChange={(e)=>setUsername(e.target.value)}
                />


                <label className="mt-3" htmlFor="email">
                    {t("email")}
                </label>

                <input
                    id="email"
                    type="email"
                    className="form-control mt-2"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                />


                <label className="mt-3" htmlFor="password">
                    {t("password")}
                </label>

                <input
                    id="password"
                    type="password"
                    className="form-control mt-2"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                />

                <PasswordValidator password={password}/>


                <label className="mt-3" htmlFor="confirmPassword">
                    {t("confirm_password")}
                </label>

                <input
                    id="confirmPassword"
                    type="password"
                    className="form-control mt-2"
                    value={confirmPassword}
                    onChange={(e)=>setConfirmPassword(e.target.value)}
                />


                {message && (
                    <p className="text-danger mt-3 mb-0">
                        {t(message)}
                    </p>
                )}


                <div className="d-flex justify-content-end gap-2 mt-4">

                    <button
                        className="btn btn-secondary"
                        type="button"
                        onClick={onClose}
                    >
                        {t("cancel")}
                    </button>


                    <button
                        className="btn btn-primary"
                        type="submit"
                        disabled={
                            !username.trim() ||
                            !email.trim() ||
                            !password ||
                            !confirmPassword
                        }
                    >
                        {t("add_admin")}
                    </button>

                </div>


            </form>

        </div>
    );
}

export default AdminAddAdminModal;