function RoleBadge({ role }) {
    return (
        <>
            <span className={`badge ${role ? "badge-admin" : "badge-user"}`}>
                {role ? "Admin" : "User"}
            </span>
        </>
    )
}
export default RoleBadge;