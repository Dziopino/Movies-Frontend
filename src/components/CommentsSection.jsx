import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import config from "../config/api.js";
import useAuth from "../hooks/useAuth.js";
import Comment from "./Comment.jsx";

function CommentsSection({ filmId }) {
    const { t } = useTranslation();
    const { userData } = useAuth();
    const [comments, setComments] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [commentsCount, setCommentsCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [lastCommentIsSpoiler, setLastCommentIsSpoiler] = useState(false);
    const loadMoreRef = useRef(null);
    const isFetchingRef = useRef(false);

    const hasMore = page < totalPages;

    const fetchPage = useCallback(async (targetPage) => {
        const isFirstPage = targetPage === 1;
        if (isFirstPage) setIsLoading(true);
        else setIsLoadingMore(true);
        isFetchingRef.current = true;

        try {
            const token = localStorage.getItem("token");
            const headers = {
                "Content-Type": "application/json"
            };
            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            }

            const response = await fetch(`${config.apiUrl}/api/films/${filmId}/comments?page=${targetPage}`, {
                method: "GET",
                headers
            });

            const data = await response.json();
            if (data.success && data.comments) {
                setComments(prev => isFirstPage ? data.comments : [...prev, ...data.comments]);
                setPage(targetPage);
                setTotalPages(data.totalPages || 0);
                setCommentsCount(data.comments_count || 0);
            } else {
                console.error("Failed to fetch comments:", data.message);
            }
        } catch (error) {
            console.error("Error fetching comments:", error);
        } finally {
            setIsLoading(false);
            setIsLoadingMore(false);
            isFetchingRef.current = false;
        }
    }, [filmId]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchPage(1);
    }, [fetchPage]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!userData.id) {
            setSubmitError(t("login_to_comment") || "Please log in to comment");
            return;
        }

        const trimmedComment = newComment.trim();
        if (!trimmedComment) {
            setSubmitError(t("comment_cannot_be_empty") || "Comment cannot be empty");
            return;
        }

        if (trimmedComment.length > 5000) {
            setSubmitError(t("comment_too_long") || "Comment is too long (max 5000 characters)");
            return;
        }

        setIsSubmitting(true);
        setSubmitError(null);
        setSubmitSuccess(false);

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${config.apiUrl}/api/films/${filmId}/comments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ content: trimmedComment })
            });

            const data = await response.json();

            if (data.success) {
                setNewComment("");
                setSubmitSuccess(true);
                setLastCommentIsSpoiler(data.is_spoiler === 1);
                await fetchPage(1);
                setTimeout(() => {
                    setSubmitSuccess(false);
                    setLastCommentIsSpoiler(false);
                }, 3000);
            } else {
                setSubmitError(data.message || t("failed_to_add_comment") || "Failed to add comment");
            }
        } catch (error) {
            console.error("Error adding comment:", error);
            setSubmitError(t("network_error") || "Network error. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleTextareaChange = (e) => {
        setNewComment(e.target.value);
        if (submitError) setSubmitError(null);
    };

    const handleCommentUpdate = (updatedComment) => {
        setComments(prevComments =>
            prevComments.map(comment =>
                comment.id === updatedComment.id ? updatedComment : comment
            )
        );
    };

    const handleCommentDelete = (commentId) => {
        setComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
        setCommentsCount(prev => Math.max(0, prev - 1));
    };

    useEffect(() => {
        const sentinel = loadMoreRef.current;
        if (!sentinel || !hasMore) return;

        const observer = new IntersectionObserver((entries) => {
            if (!entries[0].isIntersecting || isFetchingRef.current) return;
            fetchPage(page + 1);
        }, { rootMargin: "200px" });

        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [fetchPage, hasMore, isLoading, isLoadingMore, page]);

    if (isLoading) {
        return (
            <div className="comments-section">
                <div className="comments-loader">
                    <div className="spinner"></div>
                    <span>{t("loading_comments") || "Loading comments..."}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="comments-section">
            <h2 className="comments-title">{t("comments") || "Comments"} ({commentsCount || comments.length})</h2>

            <form onSubmit={handleSubmit} className="comment-form">
                <textarea className="comment-textarea" value={newComment} onChange={handleTextareaChange} placeholder={userData.id ? t("write_comment_placeholder") || "Write your comment..." : t("login_to_comment_placeholder") || "Log in to write a comment"} rows={4} maxLength={5000} disabled={!userData.id || isSubmitting}/>
                <div className="comment-form-footer">
                    <span className="char-count">{newComment.length}/5000</span>
                    {userData.id ? (
                        <button type="submit" className="comment-submit-btn" disabled={isSubmitting || !newComment.trim()}>
                            {isSubmitting ? t("posting") || "Posting..." : t("post_comment") || "Post Comment"}
                        </button>
                    ) : (
                        <a href="/login" className="comment-login-link">
                            {t("login_to_comment") || "Log in to comment"}
                        </a>
                    )}
                </div>
            </form>

            {submitSuccess && (
                <div className="comment-success-message">
                    {t("comment_posted_success") || "Comment posted successfully!"}
                    {lastCommentIsSpoiler && <span> {t("spoiler_detected") || "(Spoiler detected)"}</span>}
                </div>
            )}
            {submitError && (
                <div className="comment-error-message">
                    {submitError}
                </div>
            )}

            <div className="comments-list">
                {comments.length === 0 ? (
                    <div className="no-comments">
                        {t("no_comments_yet") || "No comments yet. Be the first to share your thoughts!"}
                    </div>
                ) : (
                    comments.map((comment) => (
                        <Comment key={comment.id} comment={comment} currentUserId={userData.id} onCommentUpdate={handleCommentUpdate} onCommentDelete={handleCommentDelete}/>
                    ))
                )}
            </div>

            {hasMore && (
                <div ref={loadMoreRef} className="comments-load-more">
                    {isLoadingMore && (
                        <div className="comments-loader comments-loader-compact">
                            <div className="spinner"></div>
                            <span>{t("loading_comments") || "Loading comments..."}</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default CommentsSection;