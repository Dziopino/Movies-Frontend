import {useState, useCallback} from "react";
import {useNavigate} from "react-router-dom";

function useWarning(userData) {

    const navigate = useNavigate();

    const [showWarning, setShowWarning] = useState(false);
    const [fadeWarning, setFadeWarning] = useState(false);


    const showWarningPopup = useCallback(() => {

        // użytkownik jest zalogowany - nie pokazuj popupu
        if (userData.id > 0) {
            return false;
        }


        setShowWarning(true);
        setFadeWarning(false);

        setTimeout(() => {
            setFadeWarning(true);

            setTimeout(() => {
                setShowWarning(false);
                setFadeWarning(false);
            },500);

        },5000);

        navigate("/", {replace:true});

        return true;

    }, [navigate, userData.id]);


    return {
        showWarning,
        fadeWarning,
        showWarningPopup
    };
}


export default useWarning;