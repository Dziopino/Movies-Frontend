import {createContext, useState, useEffect} from "react";
import i18n from "i18next";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export function AuthProvider({children}) {

    const [userData, setUserData] = useState({
        id: Number(localStorage.getItem("userId")) || 0,
        email: "",
        username: "guest",
        avatar_url: null,
        created_at: null,
        role: Number(localStorage.getItem("role")) || 0,
        bio: null,
        language_code: localStorage.getItem("language_code") || "en"
    });

    useEffect(() => {
        if (userData.language_code) {
            i18n.changeLanguage(userData.language_code);
            localStorage.setItem("language_code", userData.language_code);
        }
    }, [userData.language_code]);


    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("language_code");
        localStorage.removeItem("role");

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
    };


    return (
        <AuthContext.Provider value={{userData, setUserData, logout}}>
            {children}
        </AuthContext.Provider>
    );
}