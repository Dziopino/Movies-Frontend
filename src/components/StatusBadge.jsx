function StatusBadge({ status }) {
    const statusClass =
        status === "ACTIVE"
            ? "badge-active"
            : status === "SUSPENDED"
                ? "badge-suspended"
                : "badge-banned";

    return (
        <span className={`badge ${statusClass} d-inline-flex align-items-center gap-1`}>
        <span className={`status-dot ${statusClass}-dot`} />
            {status}
        </span>
    );
}
export default StatusBadge