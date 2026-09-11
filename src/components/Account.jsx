import {useEffect, useState, useRef, useCallback} from "react";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import useAuth from "../hooks/useAuth.js";
import useWarningContext from "../hooks/useWarningContext.js";
import config from "../config/api.js";

function Account() {
    const {userData, setUserData} = useAuth();
    const {showWarningPopup} = useWarningContext();
    const [languageCodes, setLanguageCodes] = useState([]);
    const [isBioEditionActive, setIsBioEditionActive] = useState(false);
    const [bioEditionInput, setBioEditionInput] = useState(userData.bio ?? "");
    const [isUserNameEditionActive, setIsUserNameEditionActive] = useState(false);
    const [userNameInput, setUserNameInput] = useState(userData.username);
    const [isProfilePictureEditionActive, setIsProfilePictureEditionActive] = useState(false);
    const [stats, setStats] = useState({favorites: 0, watched: 0, totalFilms: 0});
    const [auditLogs, setAuditLogs] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const fileInputRef = useRef(null);
    const { t } = useTranslation();

    const getUserData = useCallback(() => {
        fetch(`${config.apiUrl}/api/getUserData`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        })
            .then(res => res.json())
            .then(data => {
                setUserData({
                    id: userData.id,
                    email: data.body.email,
                    username: data.body.username,
                    avatar_url: data.body.avatar_url,
                    created_at: data.body.created_at,
                    role: data.body.role,
                    bio: data.body.bio,
                    language_code: data.body.language_code
                });
                setTimeout(() => setIsLoaded(true), 100);
            })
            .catch(err => console.error("Error fetching user data:", err));
    }, [setUserData, userData.id]);

    const getLanguageCodes = () => {
        fetch(`${config.apiUrl}/api/getLanguageCodes`)
            .then(res => res.json())
            .then(data => {
                setLanguageCodes(data.body || []);
            })
            .catch(err => console.error("Error fetching languages:", err));
    };

    const getUserStats = useCallback(() => {
        Promise.all([
            fetch(`${config.apiUrl}/api/likedGet`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({page: 1, search: ""})
            }).then(res => res.json()),
            fetch(`${config.apiUrl}/api/watchedGet`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({page: 1, search: ""})
            }).then(res => res.json()),
            fetch(`${config.apiUrl}/api/getFilms`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({language: userData.language_code, page: 1, search: ""})
            }).then(res => res.json())
        ])
            .then(([favData, watchedData, filmsData]) => {
                setStats({
                    favorites: favData.body?.length || 0,
                    watched: watchedData.body?.length || 0,
                    totalFilms: filmsData.totalPages ? filmsData.totalPages * 20 : 0
                });
            })
            .catch(err => console.error("Error fetching stats:", err));
    }, [userData.language_code]);

    const getAuditLogs = useCallback(() => {
        fetch(`${config.apiUrl}/api/getUserActivity`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        })
            .then(res => res.json())
            .then(data => {
                setAuditLogs(data.body || []);
            })
            .catch(err => console.error("Error fetching user activity:", err));
    }, []);

    const onEditUserBio = (e) => {
        e.preventDefault();
        fetch(`${config.apiUrl}/api/editUserBio`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({userBio: bioEditionInput}),
        })
            .then(res => res.json())
            .then(() => {
                setIsBioEditionActive(false);
                getUserData();
            })
            .catch(err => console.error("Error updating bio:", err));
    };

    const onEditUserName = (e) => {
        e.preventDefault();
        fetch(`${config.apiUrl}/api/editUserName`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({userName: userNameInput}),
        })
            .then(res => res.json())
            .then(() => {
                setIsUserNameEditionActive(false);
                getUserData();
            })
            .catch(err => console.error("Error updating username:", err));
    };

    const onChangeLanguage = (e) => {
        const selectedLanguageCode = e.target.value;
        fetch(`${config.apiUrl}/api/changeUserLanguage`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({userLanguageCode: selectedLanguageCode}),
        })
            .then(res => res.json())
            .then(() => {
                i18n.changeLanguage(selectedLanguageCode);
                getUserData();
                getAuditLogs();
                localStorage.setItem("language_code", selectedLanguageCode);
            })
            .catch(err => console.error("Error changing language:", err));
    };

    const onSetEditProfilePictureToggler = () => {
        setIsProfilePictureEditionActive(!isProfilePictureEditionActive);
    };

    const onViewProfilePicture = () => {
        if (!userData.avatar_url){
            window.open(`${config.apiUrl}/uploads/posters/guest.webp`, "_blank");
            return;
        }
        window.open(`${config.apiUrl}${userData.avatar_url}`, "_blank");
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

        fetch(`${config.apiUrl}/api/uploadAvatar`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: formData,
        })
            .then(res => res.json())
            .then(data => {
                if (data.message !== "Avatar updated successfully") {
                    alert(data.message);
                    return;
                }
                getUserData();
                getAuditLogs();
                setIsProfilePictureEditionActive(false);
            })
            .catch(err => console.error("Error uploading avatar:", err));
    };

    useEffect(() => {
        if (userData.id === null) return;
        const blocked = showWarningPopup();
        if (blocked) return;

        getUserData();
        getLanguageCodes();
        getUserStats();
        getAuditLogs();
    }, [getUserData, showWarningPopup, userData.id, getUserStats, getAuditLogs]);

    const activityMeta = {
        USER_LOGGED_IN: {labelKey: "activity_login", descKey: "activity_login_desc"},
        AVATAR_UPDATED: {labelKey: "activity_avatar_updated", descKey: "activity_avatar_updated_desc"},
        FILM_LIKED: {labelKey: "activity_favorite_added", descKey: "activity_favorite_added_desc"},
        FILM_WATCHED: {labelKey: "activity_watched_marked", descKey: "activity_watched_marked_desc"},
        LANGUAGE_CHANGED: {labelKey: "activity_language_changed", descKey: "activity_language_changed_desc"}
    };

    const getActionIcon = (action) => {
        const iconMap = {
            USER_LOGGED_IN: "🔐",
            AVATAR_UPDATED: "✏️",
            FILM_LIKED: "♥️",
            FILM_WATCHED: "👁️",
            LANGUAGE_CHANGED: "🌐"
        };
        return iconMap[action] || "📝";
    };

    const getActionColor = (action) => {
        const colorMap = {
            USER_LOGGED_IN: "action-badge-success",
            AVATAR_UPDATED: "action-badge-info",
            FILM_LIKED: "action-badge-danger",
            FILM_WATCHED: "action-badge-purple",
            LANGUAGE_CHANGED: "action-badge-warning"
        };
        return colorMap[action] || "action-badge-default";
    };

    return (
        <div className="account-dashboard-container">
            <div className={`account-dashboard-grid ${isLoaded ? 'loaded' : ''}`}>
                <div className="dashboard-header-card animate-slide-down">
                    <div className="profile-header-section">
                        <div className="avatar-wrapper-modern">
                            <div className="avatar-glow"></div>
                            <img src={userData.avatar_url === null ? `${config.apiUrl}/uploads/posters/guest.webp` : `${config.apiUrl}${userData.avatar_url}`} alt={t("profile_picture")} className="avatar-image-modern" onClick={onSetEditProfilePictureToggler}/>
                            <div className="avatar-edit-indicator" onClick={onSetEditProfilePictureToggler}>
                                <span>✏️</span>
                            </div>
                        </div>

                        {isProfilePictureEditionActive && (
                            <div className="avatar-options-popup animate-fade-in">
                                <button className="avatar-option-btn" onClick={onViewProfilePicture}>
                                    <span className="option-icon">👁️</span>
                                    {t("view_profile_picture")}
                                </button>
                                <button className="avatar-option-btn" onClick={onOpenFilePicker}>
                                    <span className="option-icon">📁</span>
                                    {t("choose_a_profile_picture")}
                                </button>
                            </div>
                        )}
                        <input type="file" ref={fileInputRef} style={{ display: "none" }} accept="image/*" onChange={onFileChange} />

                        <div className="profile-info-section">
                            {isUserNameEditionActive ? (
                                <form onSubmit={onEditUserName} className="inline-edit-form animate-fade-in">
                                    <input id="edit_username" className="inline-edit-input" value={userNameInput} onChange={(e) => setUserNameInput(e.target.value)} autoFocus/>
                                    <div className="inline-edit-actions">
                                        <button type="submit" className="inline-btn save-btn">✓</button>
                                        <button type="button" className="inline-btn cancel-btn" onClick={() => setIsUserNameEditionActive(false)}>✕</button>
                                    </div>
                                </form>
                            ) : (
                                <div className="username-display">
                                    <h1 className="username-title">{userData.username}</h1>
                                    <button className="edit-icon-btn" onClick={() => {setUserNameInput(userData.username ?? "");setIsUserNameEditionActive(true);}}>
                                        ✏️
                                    </button>
                                </div>
                            )}

                            <p className="user-email">{userData.email}</p>

                            <div className="user-role-badge">
                                <span className="role-icon">{userData.role === 1 ? '👑' : '👤'}</span>
                                <span className="role-text">{userData.role === 1 ? t("admin") : t("user")}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="dashboard-stats-row">
                    <div className="stat-card-modern animate-scale-in" style={{animationDelay: '0.1s'}}>
                        <div className="stat-icon-wrapper stat-favorites">
                            <span className="stat-emoji">♥️</span>
                        </div>
                        <div className="stat-details">
                            <div className="stat-number">{stats.favorites}</div>
                            <div className="stat-label">{t("favorites") || "Favorites"}</div>
                        </div>
                        <div className="stat-sparkle"></div>
                    </div>

                    <div className="stat-card-modern animate-scale-in" style={{animationDelay: '0.2s'}}>
                        <div className="stat-icon-wrapper stat-watched">
                            <span className="stat-emoji">👁️</span>
                        </div>
                        <div className="stat-details">
                            <div className="stat-number">{stats.watched}</div>
                            <div className="stat-label">{t("watched") || "Watched"}</div>
                        </div>
                        <div className="stat-sparkle"></div>
                    </div>
                </div>

                <div className="dashboard-bio-card animate-fade-in" style={{animationDelay: '0.4s'}}>
                    <div className="card-header-modern">
                        <h3 className="card-title-modern">
                            <span className="title-icon">📝</span>
                            {t("bio") || "About Me"}
                        </h3>
                    </div>
                    <div className="card-content-modern">
                        {!userData.bio || isBioEditionActive ? (
                            <form onSubmit={onEditUserBio} className="bio-edit-form">
                                <textarea id="edit_bio" className="bio-textarea-modern" rows="4" value={bioEditionInput} onChange={(e) => setBioEditionInput(e.target.value)} placeholder={t("enter_your_bio") || "Tell us about yourself..."}/>
                                <div className="form-actions-modern">
                                    <button type="submit" className="form-btn save-btn-modern">
                                        <span>✓</span> {t("confirm")}
                                    </button>
                                    {userData.bio && (
                                        <button type="button" className="form-btn cancel-btn-modern" onClick={() => setIsBioEditionActive(false)}>
                                            <span>✕</span> {t("cancel")}
                                        </button>
                                    )}
                                </div>
                            </form>
                        ) : (
                            <div className="bio-display" onClick={() => {
                                setBioEditionInput(userData.bio ?? "");
                                setIsBioEditionActive(true);
                            }}>
                                <p className="bio-text">{userData.bio}</p>
                                <div className="bio-edit-overlay">
                                    <span className="edit-hint">{t("click_to_edit")}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="dashboard-settings-card animate-fade-in" style={{animationDelay: '0.5s'}}>
                    <div className="card-header-modern">
                        <h3 className="card-title-modern">
                            <span className="title-icon">⚙️</span>
                            {t("settings") || "Settings"}
                        </h3>
                    </div>
                    <div className="card-content-modern">
                        <div className="setting-item-modern">
                            <label htmlFor="change_language" className="setting-label">
                                <span className="label-icon">🌐</span>
                                {t("choose_your_language") || "Language"}
                            </label>
                            <select id="change_language" className="setting-select-modern" value={userData.language_code || ""} onChange={onChangeLanguage}>
                                {languageCodes?.map((language) => (
                                    <option key={language.code} value={language.code}>{language.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="setting-item-modern">
                            <div className="setting-label">
                                <span className="label-icon">📅</span>
                                {t("member_since") || "Member Since"}
                            </div>
                            <div className="setting-value">
                                {userData.created_at ? new Date(userData.created_at).toLocaleDateString(userData.language_code, {day: 'numeric', month: 'long', year: 'numeric'}) : "—"}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="dashboard-activity-card animate-fade-in" style={{animationDelay: '0.6s'}}>
                    <div className="card-header-modern">
                        <h3 className="card-title-modern">
                            <span className="title-icon">📊</span>
                            {t("activity_log") || "Recent Activity"}
                        </h3>
                    </div>
                    <div className="card-content-modern">
                        <div className="activity-list">
                            {auditLogs.length === 0 && (
                                <p className="activity-description">{t("no_activity_yet")}</p>
                            )}
                            {auditLogs.map((log, index) => {
                                const meta = activityMeta[log.action];
                                if (!meta) return null;
                                return (
                                <div key={log.action} className="activity-item animate-slide-left" style={{animationDelay: `${index * 0.1}s`}}>
                                    <div className="activity-icon-wrapper">
                                        <span className="activity-emoji">{getActionIcon(log.action)}</span>
                                    </div>
                                    <div className="activity-details">
                                        <div className="activity-header">
                                            <span className={`activity-badge ${getActionColor(log.action)}`}>
                                                {t(meta.labelKey)}
                                            </span>
                                            <span className="activity-time">
                                                {new Date(log.created_at).toLocaleTimeString(userData.language_code, {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        </div>
                                        <p className="activity-description">{t(meta.descKey)}</p>
                                    </div>
                                </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Account;
