import {Ban, Lock, CirclePause, ShieldUser, CirclePlay, ShieldCheck, ShieldPlus, SearchX, Loader2} from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AdminBanModal from "./AdminBanModal.jsx";
import AdminSuspendModal from "./AdminSuspendModal.jsx";
import toast from "react-hot-toast";
import config from "../config/api.js";
import {getUsers, refreshUser, banUser, suspendUser, unSuspendUser, unBanUser, promoteUser, addAdmin,} from "../services/adminService.js";
import Pagination from "../components/Pagination.jsx";
import AdminPasswordAuthModal from "./AdminPasswordAuthModal.jsx";
import SearchBar from "../components/SearchBar.jsx";
import useDebounce from "../hooks/useDebounce.js";
import AdminAddAdminModal from "./AdminAddAdminModal.jsx";
import IconButton from "../components/IconButton.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import {UserAvatar} from "../components/UserAvatar.jsx";
import RoleBadge from "../components/RoleBadge.jsx";

function AdminUsers() {
    const { t } = useTranslation();
    const [users, setUsers] = useState([]);
    const [usersCount, setUsersCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [banModal, setBanModal] = useState(false);
    const [suspendModal, setSuspendModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 50;
    const [totalPages, setTotalPages] = useState(0);
    const [adminPasswordAuthModal, setAdminPasswordAuthModal] = useState(false);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);
    const [addAdminModal, setAddAdminModal] = useState(false);

    const changePage = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const updateUser = async (userId) => {
        try {
            const data = await refreshUser(userId);
            if (!data.success) return toast.error(t(data.message));
            setUsers((prev) => prev.map((u) => (u.id === userId ? data.user : u)));
        } catch (error) {
            toast.error("failed_to_refresh_user");
            console.error(error);
        }
    };

    const loadUsers = async () => {
        setIsLoading(true);
        try {
            const usersData = await getUsers(currentPage, usersPerPage, debouncedSearch.trim());
            if (!usersData.success) return toast.error(t(usersData.message));

            setUsers(usersData.users);
            setTotalPages(usersData.totalPages);
            setUsersCount(usersData.users_count);
        } catch (error) {
            toast.error("failed_to_load_users");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCurrentPage(1);
    }, [debouncedSearch]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, debouncedSearch]);

    const executeAction = async (action, data, reloadList = false) => {
        try {
            const response = await action(data);
            if (!response.success) return toast.error(t(response.message));

            if (reloadList) await loadUsers();
            else await updateUser(data.userId);

            toast.success(t(response.message));
        } catch (error) {
            toast.error(t("something_went_wrong"));
            console.error(error);
        }
    };

    const checkSuspensions = () => {
        fetch(`${config.apiUrl}/checkSuspensions`, {
            method: "POST",
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
            .then((res) => res.json())
            .then((data) => {
                if (!data.success) return toast.error(t(data.message));
                toast.success(`${t(data.message)}: ${data.updated}`);
                loadUsers();
            });
    };

    const openAction = (setter, user) => {
        setSelectedUser(user);
        setter(true);
    };

    return (
        <div className="container admin-users mb-5">

            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 pt-3 gap-3">
                <div>
                    <h1 className="page-title mb-1">
                        {t("users")}
                        <span className="users-count fw-normal ms-2">({usersCount})</span>
                    </h1>
                    <p className="text-secondary mb-0">{t("manage_application_users")}</p>
                </div>
            </div>


            <div className="d-flex flex-column flex-md-row gap-3 mb-4">
                <div className="flex-grow-1">
                    <SearchBar setSearch={setSearch} />
                </div>
                <div className="d-flex gap-2">
                    <button className="btn btn-warning d-inline-flex align-items-center" onClick={checkSuspensions}>
                        <ShieldCheck size={18} />
                        <span className="ms-2">{t("check_suspensions")}</span>
                    </button>
                    <button className="btn btn-primary d-inline-flex align-items-center" onClick={() => setAddAdminModal(true)}>
                        <ShieldUser size={18} />
                        <span className="ms-2">{t("add_admin")}</span>
                    </button>
                </div>
            </div>


            {isLoading && (
                <div className="text-center py-5 text-secondary">
                    <Loader2 size={40} className="spin-anim mb-3" />
                    <p className="mb-0">{t("loading") || "Ładowanie..."}</p>
                </div>
            )}


            {!isLoading && users.length === 0 && (
                <div className="empty-state text-center py-5">
                    <SearchX size={48} className="text-secondary mb-3" />
                    <h5 className="text-secondary">{t("no_users_found")}</h5>
                    <p className="text-secondary small mb-0">{t("try_different_search")}</p>
                </div>
            )}


            {!isLoading && users.length > 0 && (
                <div className="card table-card border-0 shadow-sm mb-4 d-none d-lg-block">
                    <div className="table-responsive">
                        <table className="table table-dark table-hover align-middle mb-0">
                            <thead>
                            <tr>
                                <th className="ps-4">{t("user")}</th>
                                <th>Email</th>
                                <th>{t("language")}</th>
                                <th>{t("role")}</th>
                                <th>{t("status")}</th>
                                <th>{t("created_at")}</th>
                                <th className="text-end pe-4">{t("action")}</th>
                            </tr>
                            </thead>
                            <tbody>
                            {users.map((user) => (
                                <tr key={user.id}>

                                    <td className="ps-4">
                                        <div className="d-flex align-items-center">
                                            <UserAvatar url={user.avatar_url} alt={t("profile_picture")} />
                                            <div className="ms-3">
                                                <div className="fw-semibold text-light" title={user.username}>
                                                    {user.username}
                                                </div>
                                                <div className="small text-secondary">ID: {user.id}</div>
                                            </div>
                                        </div>
                                    </td>


                                    <td title={user.email} className="text-secondary">
                                        {user.email}
                                    </td>


                                    <td className="text-secondary">{user.language}</td>


                                    <td>
                                        <RoleBadge role={user.role} />
                                    </td>


                                    <td>
                                        <StatusBadge status={user.status} />
                                    </td>

                                    <td className="text-secondary">
                                        {new Date(user.created_at).toLocaleDateString(user.language_code)}
                                    </td>


                                    <td className="text-end pe-4">
                                        {user.role === 1 ? (
                                            <span className="admin-protected d-inline-flex align-items-center gap-1">
                                            <Lock size={14} />
                                            <span className="small">{t("protected")}</span>
                        </span>
                                        ) : (
                                            <div className="d-inline-flex gap-1">
                                                {user.status === "ACTIVE" && (
                                                    <>
                                                        <IconButton variant="success" icon={ShieldPlus} title={t("promote_to_admin")} onClick={() => openAction(setAdminPasswordAuthModal, user)}/>
                                                        <IconButton variant="warning" icon={CirclePause} title={t("suspend_user")} onClick={() => openAction(setSuspendModal, user)}/>
                                                        <IconButton variant="danger" icon={Ban} title={t("ban_user")} onClick={() => openAction(setBanModal, user)}/>
                                                    </>
                                                )}

                                                {user.status === "SUSPENDED" && (
                                                    <button
                                                        className="btn btn-sm btn-outline-success"
                                                        title={t("unsuspend_user")}
                                                        onClick={() =>
                                                            executeAction(unSuspendUser, { userId: user.id, userStatus: user.status })
                                                        }
                                                    >
                                                        <CirclePlay size={16} className="me-1" />
                                                        <span className="small">{t("unsuspend")}</span>
                                                    </button>
                                                )}

                                                {user.status === "BANNED" && (
                                                    <button
                                                        className="btn btn-sm btn-outline-success"
                                                        title={t("unban_user")}
                                                        onClick={() =>
                                                            executeAction(unBanUser, { userId: user.id, userStatus: user.status })
                                                        }
                                                    >
                                                        <ShieldCheck size={16} className="me-1" />
                                                        <span className="small">{t("unban")}</span>
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {!isLoading && users.length > 0 && (
                <div className="d-lg-none mobile-users">
                    {users.map((user) => (
                        <div className="user-card" key={user.id}>
                            {/* Header */}
                            <div className="d-flex align-items-center mb-3">
                                <UserAvatar url={user.avatar_url} alt={t("profile_picture")} />
                                <div className="ms-3 flex-grow-1 min-w-0">
                                    <div className="fw-semibold text-truncate" title={user.username}>
                                        {user.username}
                                    </div>
                                    <div className="small text-secondary">ID: {user.id}</div>
                                </div>
                                <div className="ms-2">
                                    <StatusBadge status={user.status} />
                                </div>
                            </div>


                            <div className="user-details">
                                <div className="row g-2 small text-secondary">
                                    <div className="col-6">
                                        <span className="detail-label">Email</span>
                                        <div className="text-light text-truncate" title={user.email}>
                                            {user.email}
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <span className="detail-label">{t("language")}</span>
                                        <div className="text-light">{user.language}</div>
                                    </div>
                                    <div className="col-6">
                                        <span className="detail-label">{t("role")}</span>
                                        <div>
                                            <RoleBadge role={user.role} />
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <span className="detail-label">{t("created_at")}</span>
                                        <div className="text-light">
                                            {new Date(user.created_at).toLocaleDateString(user.language_code)}
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className="mt-3 pt-3 border-top border-secondary border-opacity-25">
                                {user.role === 1 ? (
                                    <span className="admin-protected d-inline-flex align-items-center gap-1 text-secondary">
                    <Lock size={14} />
                    <span className="small">{t("protected")}</span>
                  </span>
                                ) : (
                                    <div className="d-flex flex-wrap gap-2">
                                        {user.status === "ACTIVE" && (
                                            <>
                                                <button className="btn btn-outline-success btn-sm d-inline-flex align-items-center" onClick={() => openAction(setAdminPasswordAuthModal, user)}>
                                                    <ShieldPlus size={16} />
                                                    <span className="ms-1 small">{t("promote")}</span>
                                                </button>
                                                <button className="btn btn-outline-warning btn-sm d-inline-flex align-items-center" onClick={() => openAction(setSuspendModal, user)}>
                                                    <CirclePause size={16} />
                                                    <span className="ms-1 small">{t("suspend")}</span>
                                                </button>
                                                <button className="btn btn-outline-danger btn-sm d-inline-flex align-items-center" onClick={() => openAction(setBanModal, user)}>
                                                    <Ban size={16} />
                                                    <span className="ms-1 small">{t("ban")}</span>
                                                </button>
                                            </>
                                        )}

                                        {user.status === "SUSPENDED" && (
                                            <button className="btn btn-outline-success btn-sm d-inline-flex align-items-center" onClick={() => executeAction(unSuspendUser, { userId: user.id, userStatus: user.status })}>
                                                <CirclePlay size={16} />
                                                <span className="ms-1 small">{t("unsuspend")}</span>
                                            </button>
                                        )}

                                        {user.status === "BANNED" && (
                                            <button className="btn btn-outline-success btn-sm d-inline-flex align-items-center" onClick={() => executeAction(unBanUser, { userId: user.id, userStatus: user.status })}>
                                                <ShieldCheck size={16} />
                                                <span className="ms-1 small">{t("unban")}</span>
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!isLoading && totalPages > 1 && (
                <Pagination currentPage={currentPage} totalPages={totalPages} changePage={changePage} />
            )}

            <AdminBanModal
                isOpen={banModal}
                onClose={() => {
                    setBanModal(false);
                    setSelectedUser(null);
                }}
                onConfirm={(reason) => {
                    executeAction(banUser, {
                        userId: selectedUser.id,
                        userStatus: selectedUser.status,
                        banReason: reason,
                    });
                    setBanModal(false);
                    setSelectedUser(null);
                }}
            />

            <AdminSuspendModal
                isOpen={suspendModal}
                onClose={() => {
                    setSuspendModal(false);
                    setSelectedUser(null);
                }}
                onConfirm={(data) => {
                    executeAction(suspendUser, {
                        userId: selectedUser.id,
                        userStatus: selectedUser.status,
                        suspendReason: data.reason,
                        suspendUntil: data.until,
                    });
                    setSuspendModal(false);
                    setSelectedUser(null);
                }}
            />

            <AdminPasswordAuthModal
                isOpen={adminPasswordAuthModal}
                onClose={() => {
                    setAdminPasswordAuthModal(false);
                    setSelectedUser(null);
                }}
                onConfirm={(password) => {
                    executeAction(promoteUser, { userId: selectedUser.id, password });
                    setAdminPasswordAuthModal(false);
                    setSelectedUser(null);
                }}
            />

            <AdminAddAdminModal
                isOpen={addAdminModal}
                onClose={() => setAddAdminModal(false)}
                onConfirm={(data) => {
                    executeAction(
                        addAdmin,
                        { username: data.username, email: data.email, password: data.password },
                        true
                    );
                    setAddAdminModal(false);
                }}
            />
        </div>
    );
}

export default AdminUsers;