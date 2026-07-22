import BackButton from "../components/BackButton.jsx";
import {NavLink, useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import useAuth from "../hooks/useAuth.js";

function AdminHeader() {
    const { t } = useTranslation();
    const {userData, logout}=useAuth();
    const navigate = useNavigate();
    return (
        <header>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark p-4">
                <div className="ms-auto d-flex align-items-center gap-3">

                    <BackButton />

                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false"  aria-label="Open navbar">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                </div>



                <div className="collapse navbar-collapse" id="navbarNav">


                    <ul className="navbar-nav ms-5">

                        <li className="nav-item">
                            <NavLink className="nav-link" to="/admin/dashboard">
                                {t("dashboard")}
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink className="nav-link" to="/admin/films">
                                {t("movies")}
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink className="nav-link" to="/admin/users">
                                {t("users")}
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink className="nav-link" to="/admin/genres">
                                {t("genres")}
                            </NavLink>
                        </li>

                    </ul>


                    <div className="ms-auto d-flex align-items-center gap-3 ">

                        <BackButton />
                            <button className="btn btn-outline-light" type="button" onClick={()=> {navigate("/");}}>{t("home")}</button>



                        <button className="btn btn-outline-light" type="button" onClick={()=> {logout();navigate("/login");}}>
                            {userData.id ? t("logout") : t("log_in")}
                        </button>

                    </div>

                </div>
            </nav>
        </header>
    )
}
export default AdminHeader;