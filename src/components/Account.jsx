import {useEffect, useState, useRef, useCallback} from "react";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import useAuth from "../hooks/useAuth.js";
import useWarningContext from "../hooks/useWarningContext.js";

function Account() {

    const {userData,setUserData} = useAuth();

    const {showWarningPopup} = useWarningContext();

    const [languageCodes, setLanguageCodes] = useState([]);
    const [isBioEditionActive, setIsBioEditionActive] = useState(false);
    const [bioEditionInput, setBioEditionInput] = useState(userData.bio ?? "");
    const [isUserNameEditionActive, setIsUserNameEditionActive] = useState(false);
    const [userNameInput, setUserNameInput] = useState(userData.username);
    const [isProfilePictureEditionActive, setIsProfilePictureEditionActive] = useState(false);

    const fileInputRef = useRef(null);

    const { t } = useTranslation();


    const getUserData = useCallback(() => {
        fetch("http://localhost:8000/getUserData",{
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({userId: userData.id}),
        }).then(res => res.json()).then(data => {
            setUserData({id:localStorage.getItem("userId"), email: data.body.email, username: data.body.username, avatar_url: data.body.avatar_url, created_at: data.body.created_at, role: data.body.role, bio: data.body.bio, language_code: data.body.language_code});
        })
    },[userData.id, setUserData])

    const getLanguageCodes = () => {
        fetch("http://localhost:8000/getLanguageCodes")
            .then(res => res.json()).then(data => {
            setLanguageCodes(data.body);
        })
    }

    const onEditUserBio = (e) => {
        e.preventDefault();

        fetch("http://localhost:8000/editUserBio", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({userId: userData.id,userBio: bioEditionInput}),
        }).then(res => res.json()).then(() => {
            setIsBioEditionActive(false);
            getUserData();
        })

    }

    const onEditUserName = (e) => {
        e.preventDefault();
        fetch("http://localhost:8000/editUserName", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({userId: userData.id,userName: userNameInput}),
        }).then(res => res.json()).then(() => {
            setIsUserNameEditionActive(false);
            getUserData();
        })
    }

    const onChangeLanguage = (e) => {
        const selectedLanguageCode = e.target.value;

        fetch("http://localhost:8000/changeUserLanguage", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId: userData.id,
                userLanguageCode: selectedLanguageCode
            }),
        }).then(res => res.json()).then(() => {

            i18n.changeLanguage(selectedLanguageCode);

            getUserData();

            localStorage.setItem("language_code", selectedLanguageCode);
        });
    };

    const onSetEditProfilePictureToggler = () => {
        if(!isProfilePictureEditionActive){
            setIsProfilePictureEditionActive(true);
        }else{
            setIsProfilePictureEditionActive(false);
        }
    }

    const onViewProfilePicture = () => {
        if (!userData.avatar_url) return;

        window.open(
            `http://localhost:8000${userData.avatar_url}`,
            "_blank"
        );
    };

    const onOpenFilePicker = () => {
        fileInputRef.current.click();
    };

    const onFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert(t("you_can_add_only_images"));
            return;
        }

        const maxSize = 2 * 1024 * 1024;
        if (file.size > maxSize) {
            alert(t("file_is_too_large"));
            return;
        }

        const formData = new FormData();
        formData.append("avatar", file);
        formData.append("userId", userData.id);

        fetch("http://localhost:8000/uploadAvatar", {
            method: "POST",
            body: formData,
        })
            .then(res => res.json())
            .then(data => {
                if (data.message !== "Avatar updated successfully") {
                    alert(data.message);
                    return;
                }

                getUserData();
                setIsProfilePictureEditionActive(false);
            });
    };

    useEffect(() => {
        if (userData.id === null) return;

        const blocked = showWarningPopup();
        if (blocked) return;

        getUserData();
        getLanguageCodes();
    }, [userData.id]);


    return (
        <div className="container py-5 text-white d-flex justify-content-center">
            <div className="row align-items-center justify-content-center w-100" style={{ maxWidth: "1000px" }}>

                <div className="col-md-4 mb-4 mb-md-0 d-flex justify-content-center">
                    <div className="bg-dark rounded shadow-lg overflow-hidden w-100 text-center p-3">

                        <img src={userData.avatar_url === null ? "/guest.webp" : `http://localhost:8000${userData.avatar_url}`} alt="user avatar" className="img-fluid rounded-circle" style={{ width: "180px", height: "180px", objectFit: "cover", cursor: "pointer" }} onClick={onSetEditProfilePictureToggler}/>

                        {isProfilePictureEditionActive && (
                            <div className="d-flex flex-column gap-2 mt-3">
                                <button className="btn btn-outline-light" onClick={onViewProfilePicture}>{t("view_profile_picture")}</button>

                                <button className="btn btn-outline-light" onClick={onOpenFilePicker}>{t("choose_a_profile_picture")}</button>
                            </div>
                        )}

                        <input type="file" ref={fileInputRef} style={{ display: "none" }} accept="image/*" onChange={onFileChange} />

                    </div>
                </div>

                <div className="col-md-7 d-flex justify-content-center">
                    <div className="bg-dark p-4 rounded shadow-lg w-100">

                        <div className="mb-3">
                            {isUserNameEditionActive ? (
                                <form onSubmit={onEditUserName}>
                                    <label className="form-label">{t("enter_your_new_username")}</label>

                                    <input className="form-control" value={userNameInput}
                                           onChange={(e) => setUserNameInput(e.target.value)}/>

                                    <div className="mt-2 d-flex gap-2">
                                        <button type="submit" className="btn btn-success">{t("confirm")}</button>
                                    </div>
                                </form>
                            ) : (
                                <div className="d-flex justify-content-between align-items-center">
                                    <h2 className="m-0">{t("username")}: {userData.username}</h2>
                                    <img src="/edit.svg" alt="edit" style={{width: "24px", cursor: "pointer"}}
                                         onClick={() => setIsUserNameEditionActive(true)}/>
                                </div>
                            )}
                        </div>

                        <p className="text-white mb-3">{t("email")}: {userData.email}</p>

                        <div className="mb-3">
                            {!userData.bio || isBioEditionActive ? (
                                <form onSubmit={onEditUserBio}>
                                    <label className="form-label">{t("enter_your_bio")}</label>

                                    <textarea className="form-control" rows="3" value={bioEditionInput}
                                              onChange={(e) => setBioEditionInput(e.target.value)}/>

                                    <button type="submit" className="btn btn-success mt-2">{t("confirm")}</button>
                                </form>
                            ) : (
                                <div className="d-flex justify-content-between">
                                    <p className="text-white">{t("bio")}: {userData.bio}</p>
                                    <img src="/edit.svg" alt="edit" style={{width: "24px", cursor: "pointer"}}
                                         onClick={() => setIsBioEditionActive(true)}/>
                                </div>
                            )}
                        </div>



                        <div className="mt-4">
                            <label className="text-white" htmlFor="language-select">{t("choose_your_language")}</label>

                            <select id="language-select" className="form-select" value={userData.language_code || ""} onChange={onChangeLanguage}>
                                {languageCodes.map((language) => (
                                    <option key={language.code} value={language.code}>{language.name}</option>
                                ))}
                            </select>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}

export default Account;