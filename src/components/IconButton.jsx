function IconButton({ variant, icon: Icon, title, onClick, className = "" }) {
    return (
        <>
            <button
                className={`btn btn-sm btn-action btn-outline-${variant} ${className}`}
                title={title}
                aria-label={title}
                onClick={onClick}
            >
                <Icon size={16} />
            </button>
        </>
    )
}
export default IconButton;