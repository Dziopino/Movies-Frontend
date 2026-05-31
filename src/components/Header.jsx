import {NavLink} from "react-router-dom";

function Header({setUserData}) {
    return (
        <>
            <header>
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark p-4">
                    <button className="btn btn-primary me-4" type="button" onClick={()=> {setUserData({id: null, email: "", username: "guest", avatar_url: null, created_at: null, role: 0, bio: null, language_code: "en"});localStorage.clear();}}>Logout</button>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item active">
                                <NavLink className="nav-link" to="/">Home</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/favorites">Favorites</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/watched">Watched</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/account">My account</NavLink>
                            </li>
                        </ul>
                    </div>
                </nav>
            </header>
        </>
    );
}

export default Header;