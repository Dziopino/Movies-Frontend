import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import BackButton from "./BackButton.jsx";

function Header({ setUserData, userData }) {
    const { t } = useTranslation();

    return (
        <header>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark p-4">
                <div className="ms-auto d-flex align-items-center gap-3">

                    <BackButton />

                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                </div>



                <div className="collapse navbar-collapse" id="navbarNav">


                    <ul className="navbar-nav ms-5">

                        <li className="nav-item">
                            <NavLink className="nav-link" to="/">
                                {t("home")}
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink className="nav-link" to="/favorites">
                                {t("favorites")}
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink className="nav-link" to="/watched">
                                {t("watched")}
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink className="nav-link" to="/account">
                                {t("account")}
                            </NavLink>
                        </li>

                    </ul>


                    <div className="ms-auto d-flex align-items-center gap-3 ">

                        <BackButton />

                        <button

                            className="btn btn-outline-light ms-5"
                            type="button"
                            onClick={() => {
                                setUserData({
                                    id: null,
                                    email: "",
                                    username: "guest",
                                    avatar_url: null,
                                    created_at: null,
                                    role: 0,
                                    bio: null,
                                    language_code: "en"
                                });

                                localStorage.clear();
                            }}
                        >
                            {userData.id ? t("logout") : t("log_in")}
                        </button>

                    </div>

                </div>
            </nav>
        </header>
    );
}

export default Header;