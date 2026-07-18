import {Ban, Shield, Lock, CirclePause} from "lucide-react";
import {useEffect, useState} from "react";
import config from "../config/api.js";
import {useTranslation} from "react-i18next";

function AdminUsers() {

    const {t} = useTranslation();

    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState("");
    const [usersCount, setUsersCount] = useState(0);

    useEffect(() => {
        fetch(`${config.apiUrl}/getUsers`,{
            method: "GET",
            headers:{
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
            .then(res => res.json())
            .then(data => {
                if(!data.success){
                    setMessage(data.message);
                }
                setUsers(data.users);
            });

        fetch(`${config.apiUrl}/getUsersCount`,{
            method: "GET",
            headers:{
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
        .then(res => res.json())
        .then(data => {
            if(!data.success){
                setMessage(data.message);
            }
            setUsersCount(data.users_count);
        })
    }, []);


    return (
        <div className="container admin-users mb-4">
            <h1 className="text-center text-">{t("users")}<span className="users-count fw-normal ms-2">({usersCount})</span></h1>

            <div className="d-flex justify-content-between align-items-center mb-4">
                <p>{t("manage_application_users")}</p>

                <button className="btn btn-primary">
                    <Shield size={18}/>
                    <span className="ms-2">{t("add_admin")}</span>
                </button>
            </div>

            <div className="table-responsive admin-table">
                <table className="table table-dark align-middle">
                    <thead>
                    <tr>
                        <th>{t("user")}</th>
                        <th>Email</th>
                        <th>{t("language")}</th>
                        <th>{t("role")}</th>
                        <th>{t("status")}</th>
                        <th>{t("created_at")}</th>
                        <th className="text-end">{t("action")}</th>
                    </tr>
                    </thead>

                    <tbody>
                    {message}
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>
                                <div className="d-flex align-items-center">
                                    <img className="user-avatar" src={user.avatar_url === null ? "/guest.webp" : `${config.apiUrl}${user.avatar_url}`} alt={t("profile_picture")}/>

                                    <div className="ms-3">
                                        <strong title={user.username}>{user.username}</strong>
                                        <div className="small">ID: {user.id}</div>
                                    </div>
                                </div>
                            </td>

                            <td title={user.email}>{user.email}</td>

                            <td>{user.language}</td>

                            <td>
                                <span className={user.role ? "badge badge-admin" : "badge badge-user"}>
                                    {user.role ? "Admin" : "User"}
                                </span>
                            </td>

                            <td>
                                <span className={user.status === "ACTIVE" ? "badge badge-active" : "badge badge-banned"}>
                                    {user.status}
                                </span>
                            </td>
                            <td>{new Date(user.created_at).toLocaleDateString(user.language_code)}</td>


                            <td className="text-end">
                                {user.role === 1 ?
                                    (
                                        <span className="admin-protected me-2" title="Protected. You cannot manage another admin">
                                            <Lock size={16}/>
                                            Protected
                                        </span>
                                    )
                                    :
                                    (
                                        <>
                                            <button className="btn btn-sm btn-outline-warning me-2" title={t("suspend_user")}>
                                                <CirclePause size={16}/>
                                            </button>

                                            <button className="btn btn-sm btn-outline-danger" title={t("ban_user")}>
                                                <Ban size={16}/>
                                            </button>
                                        </>
                                    )
                                }

                            </td>

                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>


            <div className="mobile-users">
                {users.map(user => (
                    <div className="user-card" key={user.id}>

                        <div className="d-flex align-items-center">
                            <img src={user.avatar_url === null ? "/guest.webp" : user.avatar_url} className="user-avatar" alt="Profile picture"/>

                            <div className="ms-3 user-info">
                                <strong title={user.username}>{user.username}</strong>
                                <div className="small users-count">ID: {user.id}</div>
                            </div>
                        </div>

                        <hr/>

                        <div className="user-details">
                            <p>Email: <span title={user.email}>{user.email}</span></p>

                            <p>
                                Language:
                                <b>{user.language}</b>
                            </p>

                            <p>
                                Role:
                                <span className={user.role ? "badge badge-admin ms-2" : "badge badge-user ms-2"}>
                        {user.role ? "Admin" : "User"}
                    </span>
                            </p>

                            <p>
                                Status:
                                <span className={user.status === "ACTIVE" ? "badge badge-active ms-2" : "badge badge-banned ms-2"}>
                        {user.status}
                    </span>
                            </p>

                            <p>
                                Created:
                                <b className="ms-2">
                                    {new Date(user.created_at).toLocaleDateString(user.language)}
                                </b>
                            </p>
                        </div>

                        <div className="mt-3">
                            {
                                user.role ?
                                    (
                                        <span className="admin-protected">
                                            <Lock size={16}/>
                                            Protected
                                        </span>
                                    )
                                    :
                                    (
                                        <>
                                            <button className="btn btn-outline-warning me-2">
                                                <CirclePause size={16}/>
                                                <span className="ms-1">Suspend</span>
                                            </button>

                                            <button className="btn btn-outline-danger">
                                                <Ban size={16}/>
                                                <span className="ms-1">Ban</span>
                                            </button>
                                        </>
                                    )
                            }
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
}

export default AdminUsers;