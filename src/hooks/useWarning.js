import {useCallback, useState} from "react";
import {useNavigate} from "react-router-dom";

function useWarning(userData) {

    const navigate = useNavigate();

    const [showWarning, setShowWarning] = useState(false);
    const [fadeWarning, setFadeWarning] = useState(false);


    const showWarningPopup = useCallback(() => {

        if (userData.id) {
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

    }, [userData.id, navigate]);


    return {
        showWarning,
        fadeWarning,
        showWarningPopup
    };
}

export default useWarning;