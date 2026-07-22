import {Ban, Lock, CirclePause, ShieldUser, CirclePlay, ShieldCheck} from "lucide-react";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import AdminBanModal from "./AdminBanModal.jsx";
import AdminSuspendModal from "./AdminSuspendModal.jsx";
import toast from "react-hot-toast";
import config from "../config/api.js";
import {getUsers, getUsersCount, refreshUser, banUser, suspendUser, unSuspendUser, unBanUser} from "../services/adminService.js";
import Pagination from "../components/Pagination.jsx";

function AdminUsers() {

    const {t} = useTranslation();

    const [users, setUsers] = useState([]);
    const [usersCount, setUsersCount] = useState(0);
    const [banModal, setBanModal] = useState(false);
    const [suspendModal, setSuspendModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 50;
    const [totalPages, setTotalPages] = useState(0);

    const changePage = (page) => {
        setCurrentPage(page);
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const updateUser = async (userId) => {
        try {
            const data = await refreshUser(userId);

            if(!data.success){
                return toast.error(data.message);
            }

            setUsers(prevUsers =>
                prevUsers.map(user =>
                    user.id === userId ? data.user : user
                )
            );

        } catch(error) {
            toast.error("Failed to refresh user");
            console.error(error);
        }
    };
    useEffect(() => {

        const loadUsers = async () => {
            try {

                const usersData = await getUsers(currentPage, usersPerPage);

                if(!usersData.success){
                    return toast.error(usersData.message);
                }

                setUsers(usersData.users);
                setTotalPages(usersData.totalPages);


                const countData = await getUsersCount();

                if(!countData.success){
                    return toast.error(countData.message);
                }

                setUsersCount(countData.users_count);

            } catch(error) {
                toast.error("Failed to load users");
                console.error(error);
            }
        };

        loadUsers();

    }, [currentPage]);

    const executeAction = async (action, data) => {
        try {
            const response = await action(data);

            if(!response.success){
                return toast.error(response.message);
            }

            await updateUser(data.userId);

            toast.success(response.message);

        } catch(error) {
            toast.error("Something went wrong");
            console.error(error);
        }
    };




    return (
        <div className="container admin-users mb-4">
            <h1 className="text-center text-">{t("users")}<span className="users-count fw-normal ms-2">({usersCount})</span></h1>

            <div className="d-flex justify-content-between align-items-center mb-4">
                <p>{t("manage_application_users")}</p>

                <button className="btn btn-primary">
                    <ShieldUser size={18}/>
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
                                <span className={user.status === "ACTIVE" ? "badge badge-active" : user.status === "SUSPENDED" ? "badge badge-suspended" : "badge badge-banned"}>
                                    {user.status}
                                </span>
                            </td>
                            <td>{new Date(user.created_at).toLocaleDateString(user.language_code)}</td>


                            <td className="text-end">
                                {user.role === 1 ?
                                    (
                                        <span className="admin-protected me-2" title="Protected. You cannot manage another admin">
                                            <Lock size={16}/>
                                            {t("protected")}
                                        </span>
                                    )
                                    :
                                    (


                                        <>
                                            {user.status === "ACTIVE" && (
                                                <>
                                                    <button className="btn btn-sm btn-outline-warning me-2" title={t("suspend_user")} onClick={()=>{setSelectedUser(user);setSuspendModal(true)}}>
                                                        <CirclePause size={16}/>
                                                    </button>

                                                    <button className="btn btn-sm btn-outline-danger" title={t("ban_user")} onClick={()=>{setSelectedUser(user);setBanModal(true)}}>
                                                        <Ban size={16}/>
                                                    </button>
                                                </>
                                            )}
                                            {user.status === "SUSPENDED" && (
                                                <>
                                                    <button className="btn btn-sm btn-outline-success me-2" title={t("unsuspend_user")} onClick={()=>{executeAction(unSuspendUser,{userId:user.id, userStatus:user.status})}}>
                                                        <CirclePlay size={16} className="me-1"/>
                                                        {t("unsuspend")}
                                                    </button>
                                                </>
                                            )}
                                            {user.status === "BANNED" && (
                                                <>
                                                    <button className="btn btn-sm btn-outline-success" title={t("unban_user")} onClick={()=>{executeAction(unBanUser,{userId:user.id, userStatus:user.status})}}>
                                                        <ShieldCheck size={16} className="me-1"/>
                                                        {t("unban")}
                                                    </button>
                                                </>
                                            )}
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

                            <div className="d-flex align-items-center">
                                <span className="me-1">Status:</span>

                                <span className={user.status === "ACTIVE" ? "badge badge-active" : user.status === "SUSPENDED" ? "badge badge-suspended" : "badge badge-banned"}>
                                {user.status}
                                </span>
                            </div>

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

                                            {user.status === "ACTIVE" && (
                                                <>
                                                    <button className="btn btn-outline-warning me-2" onClick={()=>{setSelectedUser(user);setSuspendModal(true)}} >
                                                        <CirclePause size={16}/>
                                                        <span className="ms-1">{t("suspend")}</span>
                                                    </button>

                                                    <button className="btn btn-outline-danger" onClick={()=>{setSelectedUser(user);setBanModal(true)}}>
                                                        <Ban size={16}/>
                                                        <span className="ms-1">{t("ban")}</span>
                                                    </button>
                                                </>
                                            )}
                                            {user.status === "SUSPENDED" && (
                                                <>
                                                    <button className="btn btn-outline-success me-2" onClick={()=>{executeAction(unSuspendUser,{userId:user.id, userStatus:user.status})}}>
                                                        <CirclePlay size={16}/>
                                                        <span className="ms-1" >{t("unsuspend")}</span>
                                                    </button>
                                                </>
                                            )}
                                            {user.status === "BANNED" && (
                                                <>
                                                    <button className="btn btn-outline-success" onClick={()=>{executeAction(unBanUser,{userId:user.id, userStatus:user.status})}}>
                                                        <ShieldCheck size={16}/>
                                                        <span className="ms-1">{t("unban")}</span>
                                                    </button>
                                                </>
                                            )}


                                        </>
                                    )
                            }
                        </div>

                    </div>
                ))}

            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} changePage={changePage}/>

            <AdminBanModal
                isOpen={banModal}
                onClose={()=>{
                    setBanModal(false);
                    setSelectedUser(null);
                }}
                onConfirm={(reason)=>{
                    executeAction(banUser,{
                        userId:selectedUser.id,
                        userStatus:selectedUser.status,
                        banReason:reason
                    });
                    setBanModal(false);
                    setSelectedUser(null);
                }}
            />

            <AdminSuspendModal
                isOpen={suspendModal}
                onClose={()=>{
                    setSuspendModal(false);
                    setSelectedUser(null);
                }}
                onConfirm={(data)=>{

                    executeAction(suspendUser,{
                        userId:selectedUser.id,
                        userStatus:selectedUser.status,
                        suspendReason:data.reason,
                        suspendUntil:data.until
                    });

                    setSuspendModal(false);
                    setSelectedUser(null);
                }}
            />
        </div>
    );
}

export default AdminUsers;