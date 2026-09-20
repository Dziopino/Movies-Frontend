import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pencil, Trash2 } from "lucide-react";
import { resolveImageUrl, DEFAULT_AVATAR_URL } from "../config/api.js";
import config from "../config/api.js";

function Comment({ comment, currentUserId, onCommentUpdate, onCommentDelete }) {
    const { t } = useTranslation();
    const [isRevealed, setIsRevealed] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState(null);
    const [deleteSuccess, setDeleteSuccess] = useState(false);

    const handleClick = () => {
        if (comment.is_spoiler === 1 && !isRevealed) {
            setIsRevealed(true);
        }
    };

    const handleEditClick = (e) => {
        e.stopPropagation();
        setIsEditing(true);
        setEditContent(comment.content);
    };

    const handleSaveEdit = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!editContent.trim()) {
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${config.apiUrl}/api/films/${comment.film_id}/comments/${comment.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ content: editContent })
            });

            const data = await response.json();

            if (data.success) {
                setIsEditing(false);
                onCommentUpdate && onCommentUpdate({ ...comment, content: editContent, is_spoiler: data.is_spoiler });
                setEditContent(comment.content);
            } else {
                alert(data.message || "Failed to update comment");
            }
        } catch (error) {
            console.error("Error updating comment:", error);
            alert("Network error. Please try again.");
        }
    };

    const handleCancelEdit = (e) => {
        e.stopPropagation();
        setIsEditing(false);
        setEditContent(comment.content);
    };

    const handleDeleteClick = async (e) => {
        e.stopPropagation();

        if (!window.confirm(t("confirm_delete_comment") || "Are you sure you want to delete this comment?")) {
            return;
        }

        setIsDeleting(true);
        setDeleteError(null);
        setDeleteSuccess(false);

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${config.apiUrl}/api/films/${comment.film_id}/comments/${comment.id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (data.success) {
                setIsDeleting(false);
                setDeleteSuccess(true);
                onCommentDelete && onCommentDelete(comment.id);

                setTimeout(() => {
                    setDeleteSuccess(false);
                }, 3000);
            } else {
                setIsDeleting(false);
                setDeleteError(data.message || "Failed to delete comment");
            }
        } catch (error) {
            console.error("Error deleting comment:", error);
            setIsDeleting(false);
            setDeleteError("Network error. Please try again.");
        }
    };

    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString(navigator.language || 'en', {year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'});
        } catch {
            return dateString;
        }
    };

    const isAuthor = currentUserId && comment.user_id === currentUserId;

    return (
        <div className="comment-card" onClick={comment.is_spoiler === 1 ? handleClick : undefined}>
            <div className="comment-header">
                <img src={comment.avatar_url ? resolveImageUrl(comment.avatar_url) : DEFAULT_AVATAR_URL} alt={comment.username} className="comment-avatar"/>
                <div className="comment-meta">
                    <span className="comment-author">{comment.username} {isAuthor && <span className="author-badge">{t("you") || "You"}</span>}</span>
                    <span className="comment-date">{formatDate(comment.created_at)}</span>
                </div>

                {isAuthor && (
                    <div className="comment-actions">
                        <button className="comment-edit-btn" onClick={handleEditClick} disabled={isDeleting || isEditing} title={t("edit_comment")} aria-label={t("edit_comment")}>
                            <Pencil size={14} className="comment-action-icon" />
                        </button>
                        <button className="comment-delete-btn" onClick={handleDeleteClick} disabled={isEditing || isDeleting} title={t("delete_comment")} aria-label={t("delete_comment")}>
                            <Trash2 size={14} className="comment-action-icon" />
                        </button>
                    </div>
                )}
            </div>

            {deleteSuccess && (
                <div className="comment-delete-success">
                    {t("comment_deleted_success") || "Comment deleted successfully."}
                </div>
            )}
            {deleteError && (
                <div className="comment-delete-error">
                    {deleteError}
                </div>
            )}

            {!isEditing && (
                <div className="comment-content-wrapper">
                    {comment.is_spoiler === 1 && !isRevealed ? (
                        <>
                            <div className="comment-content spoiler-blur" onClick={handleClick}>
                                {comment.content}
                            </div>
                            <div className="spoiler-overlay" onClick={handleClick}>
                                <span className="spoiler-label">{t("click_to_reveal_spoiler") || "Click to reveal spoiler"}</span>
                            </div>
                        </>
                    ) : (
                        <div className="comment-content" style={isRevealed ? { filter: 'none' } : undefined}>
                            {comment.content}
                        </div>
                    )}
                </div>
            )}

            {isEditing && (
                <form onSubmit={handleSaveEdit} className="comment-edit-form">
                    <textarea className="comment-edit-textarea" value={editContent} onChange={(e) => setEditContent(e.target.value)} rows={3} maxLength={5000}/>
                    <div className="comment-edit-form-footer">
                        <span className="char-count">{editContent.length}/5000</span>
                        <button type="submit" className="comment-save-btn" disabled={!editContent.trim()}>
                            {t("save") || "Save"}
                        </button>
                        <button type="button" className="comment-cancel-btn" onClick={handleCancelEdit}>
                            {t("cancel") || "Cancel"}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}

export default Comment;