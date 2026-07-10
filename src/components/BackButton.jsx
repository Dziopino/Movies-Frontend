import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

function BackButton() {
    const navigate = useNavigate();
    const location = useLocation();

    const blocked = ["/login", "/register", "/passReset"];

    const handleBack = () => {
        const current = location.pathname;

        if (blocked.includes(current)) return;

        navigate("/", { replace: true });
    };

    if (blocked.includes(location.pathname)) return null;

    return (
        <button className="back-button" onClick={handleBack}>
            <FaArrowLeft size="60%" />
        </button>
    );
}

export default BackButton;