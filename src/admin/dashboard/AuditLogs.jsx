import { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import useDebounce from '../../hooks/useDebounce';
import config from "../../config/api.js";

const AuditLogs = () => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [logs, setLogs] = useState([]);
    const [pagination, setPagination] = useState({currentPage: 1, totalPages: 1, totalRows: 0});
    const [filters, setFilters] = useState({action: '', username: '', page: 1, limit: 10});
    const debouncedUsername = useDebounce(filters.username, 500);
    const actionTypes = ['FILM_LIKED', 'FILM_UNLIKED', 'FILM_WATCHED', 'FILM_UNWATCHED', 'USER_REGISTERED', 'USER_LOGGED_IN', 'PROFILE_UPDATED', 'USERNAME_CHANGED', 'BIO_UPDATED', 'LANGUAGE_CHANGED', 'AVATAR_UPDATED', 'PASSWORD_CHANGED', 'PASSWORD_RESET_REQUESTED', 'PASSWORD_RESET_COMPLETED', 'USER_BANNED', 'USER_UNBANNED', 'USER_SUSPENDED', 'USER_UNSUSPENDED', 'USER_PROMOTED', 'GENRE_CREATED', 'GENRE_UPDATED', 'GENRE_DELETED', 'FILM_CREATED', 'FILM_UPDATED', 'FILM_DELETED'];

    useEffect(() => {
        // eslint-disable-next-line react-hooks/immutability
        fetchAuditLogs();
    }, [filters.action, filters.page, filters.limit, debouncedUsername]);

    const fetchAuditLogs = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const params = new URLSearchParams();
            params.append('page', filters.page);
            params.append('limit', filters.limit);
            if (filters.action) params.append('action', filters.action);
            if (debouncedUsername) params.append('username', debouncedUsername);

            const response = await axios.get(`${config.apiUrl}/api/admin/dashboard/audit-logs?${params.toString()}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setLogs(response.data.logs);
                setPagination(response.data.pagination);
            } else {
                setError(t('failed_to_load_audit_logs'));
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message;
            setError(t(errorMessage || 'server_connection_error'));
            console.error('Audit logs error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({
            ...prev,
            [field]: value,
            page: 1
        }));
    };

    const handlePageChange = (newPage) => {
        setFilters(prev => ({ ...prev, page: newPage }));
    };

    const getActionBadgeStyle = (action) => {
        const styles = {
            'USER_BANNED': { bg: 'bg-danger bg-opacity-25', text: 'text-danger', icon: 'bi-shield-x' },
            'USER_SUSPENDED': { bg: 'bg-danger bg-opacity-25', text: 'text-danger', icon: 'bi-pause-circle' },
            'FILM_DELETED': { bg: 'bg-danger bg-opacity-25', text: 'text-danger', icon: 'bi-trash' },
            'GENRE_DELETED': { bg: 'bg-danger bg-opacity-25', text: 'text-danger', icon: 'bi-trash' },

            'USER_UNBANNED': { bg: 'bg-success bg-opacity-25', text: 'text-success', icon: 'bi-shield-check' },
            'USER_UNSUSPENDED': { bg: 'bg-success bg-opacity-25', text: 'text-success', icon: 'bi-play-circle' },
            'USER_PROMOTED': { bg: 'bg-success bg-opacity-25', text: 'text-success', icon: 'bi-star-fill' },
            'USER_REGISTERED': { bg: 'bg-success bg-opacity-25', text: 'text-success', icon: 'bi-person-plus' },
            'PASSWORD_RESET_COMPLETED': { bg: 'bg-success bg-opacity-25', text: 'text-success', icon: 'bi-check-circle' },
            'FILM_CREATED': { bg: 'bg-success bg-opacity-25', text: 'text-success', icon: 'bi-plus-circle' },
            'GENRE_CREATED': { bg: 'bg-success bg-opacity-25', text: 'text-success', icon: 'bi-tag-fill' },

            'USER_LOGGED_IN': { bg: 'bg-primary bg-opacity-25', text: 'text-primary', icon: 'bi-box-arrow-in-right' },
            'FILM_LIKED': { bg: 'bg-primary bg-opacity-25', text: 'text-primary', icon: 'bi-heart-fill' },
            'FILM_WATCHED': { bg: 'bg-primary bg-opacity-25', text: 'text-primary', icon: 'bi-eye-fill' },

            'FILM_UNLIKED': { bg: 'bg-secondary bg-opacity-25', text: 'text-secondary', icon: 'bi-heart' },
            'FILM_UNWATCHED': { bg: 'bg-secondary bg-opacity-25', text: 'text-secondary', icon: 'bi-eye-slash' },

            'FILM_UPDATED': { bg: 'bg-warning bg-opacity-25', text: 'text-warning', icon: 'bi-pencil' },
            'GENRE_UPDATED': { bg: 'bg-warning bg-opacity-25', text: 'text-warning', icon: 'bi-tag' },
            'PASSWORD_CHANGED': { bg: 'bg-warning bg-opacity-25', text: 'text-warning', icon: 'bi-key' },

            'PASSWORD_RESET_REQUESTED': { bg: 'bg-info bg-opacity-25', text: 'text-info', icon: 'bi-envelope' },
            'USERNAME_CHANGED': { bg: 'bg-info bg-opacity-25', text: 'text-info', icon: 'bi-person' },
            'BIO_UPDATED': { bg: 'bg-info bg-opacity-25', text: 'text-info', icon: 'bi-card-text' },
            'LANGUAGE_CHANGED': { bg: 'bg-info bg-opacity-25', text: 'text-info', icon: 'bi-translate' },
            'AVATAR_UPDATED': { bg: 'bg-info bg-opacity-25', text: 'text-info', icon: 'bi-image' },
            'PROFILE_UPDATED': { bg: 'bg-info bg-opacity-25', text: 'text-info', icon: 'bi-person-gear' }
        };
        return styles[action] || { bg: 'bg-secondary bg-opacity-25', text: 'text-secondary', icon: 'bi-question-circle' };
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading && logs.length === 0) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                    <span className="visually-hidden">{t('loading')}</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger" style={{backgroundColor: 'rgba(220, 38, 38, 0.1)', border: '1px solid rgba(220, 38, 38, 0.3)', borderRadius: '12px', color: '#fca5a5'}}>
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {error}
            </div>
        );
    }

    return (
        <div className="row g-4">
            <div className="col-12">
                <div style={{backgroundColor: 'rgba(15, 15, 28, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(99, 102, 241, 0.1)', borderRadius: '16px', padding: '24px', marginBottom: '24px'}}>
                    <h5 className="text-white fw-bold mb-4">
                        <i className="bi bi-funnel me-2"></i>
                        {t('filters')}
                    </h5>
                    <div className="row g-3">
                        <div className="col-lg-6">
                            <label className="form-label text-white-50" style={{ fontSize: '14px' }}>
                                {t('action_type')}
                            </label>
                            <select className="form-select" value={filters.action} onChange={(e) => handleFilterChange('action', e.target.value)} style={{backgroundColor: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)', color: '#ffffff', borderRadius: '8px'}}>
                                <option value="" style={{ backgroundColor: '#1a1a24', color: '#ffffff' }}>{t('all_actions')}</option>
                                {actionTypes.map(type => (
                                    <option key={type} value={type} style={{ backgroundColor: '#1a1a24', color: '#ffffff' }}>{t(type)}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-lg-6">
                            <label className="form-label text-white-50" style={{ fontSize: '14px' }}>
                                {t('username')}
                            </label>
                            <input type="text" className="form-control" placeholder={t('search_by_username')} value={filters.username} onChange={(e) => handleFilterChange('username', e.target.value)} style={{backgroundColor: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)', color: '#ffffff', borderRadius: '8px'}}/>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-12">
                <div style={{backgroundColor: 'rgba(15, 15, 28, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(99, 102, 241, 0.1)', borderRadius: '16px', overflow: 'hidden'}}>
                    <div style={{ padding: '24px', borderBottom: '1px solid rgba(99, 102, 241, 0.1)' }}>
                        <div className="d-flex justify-content-between align-items-center">
                            <h5 className="text-white fw-bold mb-0">
                                <i className="bi bi-list-ul me-2"></i>
                                {t('audit_logs')}
                            </h5>
                            <span className="badge bg-primary bg-opacity-25 text-primary" style={{ fontSize: '13px', padding: '8px 12px' }}>
                                {pagination.totalRows} {t('total_records')}
                            </span>
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-dark table-hover mb-0" style={{ backgroundColor: 'transparent' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(99, 102, 241, 0.1)' }}>
                                    <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: '600', color: '#a5b4fc' }}>ID</th>
                                    <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: '600', color: '#a5b4fc' }}>{t('user')}</th>
                                    <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: '600', color: '#a5b4fc' }}>{t('action')}</th>
                                    <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: '600', color: '#a5b4fc' }}>{t('timestamp')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="4" className="text-center py-5">
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="visually-hidden">{t('loading')}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : logs.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="text-center py-5 text-white-50">
                                            <i className="bi bi-inbox" style={{ fontSize: '48px', opacity: 0.3 }}></i>
                                            <p className="mt-3 mb-0">{t('no_audit_logs_found')}</p>
                                        </td>
                                    </tr>
                                ) : (
                                    logs.map((log) => {
                                        const badgeStyle = getActionBadgeStyle(log.action);
                                        return (
                                            <tr key={log.id} style={{ borderBottom: '1px solid rgba(99, 102, 241, 0.05)' }}>
                                                <td style={{ padding: '16px 24px', color: '#a5b4fc', fontSize: '14px' }}>
                                                    #{log.id}
                                                </td>
                                                <td style={{ padding: '16px 24px', color: '#ffffff', fontSize: '14px' }}>
                                                    <div className="d-flex align-items-center">
                                                        <div style={{width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(99, 102, 241, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px'}}>
                                                            <i className="bi bi-person" style={{ color: '#6366f1', fontSize: '16px' }}></i>
                                                        </div>
                                                        <span>{log.username}</span>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '16px 24px' }}>
                                                    <span className={`badge ${badgeStyle.bg} ${badgeStyle.text}`} style={{ fontSize: '12px', padding: '6px 12px', fontWeight: '600' }}>
                                                        <i className={`bi ${badgeStyle.icon} me-1`}></i>
                                                        {t(log.action)}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '16px 24px', color: '#a5b4fc', fontSize: '14px' }}>
                                                    <i className="bi bi-clock me-2"></i>
                                                    {formatDate(log.created_at)}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div style={{padding: '24px', borderTop: '1px solid rgba(99, 102, 241, 0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <span className="text-white-50" style={{ fontSize: '14px' }}>
                            {t('page')} {pagination.currentPage} {t('of')} {pagination.totalPages}
                        </span>
                        <div className="btn-group">
                            <button className="btn btn-sm" onClick={() => handlePageChange(pagination.currentPage - 1)} disabled={pagination.currentPage === 1} style={{backgroundColor: pagination.currentPage === 1 ? 'rgba(99, 102, 241, 0.1)' : '#6366f1', color: pagination.currentPage === 1 ? '#6b7280' : '#ffffff', border: 'none', padding: '8px 16px', borderRadius: '8px 0 0 8px', cursor: pagination.currentPage === 1 ? 'not-allowed' : 'pointer'}}>
                                <i className="bi bi-chevron-left"></i> {t('previous')}
                            </button>
                            <button className="btn btn-sm" onClick={() => handlePageChange(pagination.currentPage + 1)} disabled={pagination.currentPage >= pagination.totalPages || pagination.totalPages === 0 || logs.length === 0} style={{backgroundColor: (pagination.currentPage >= pagination.totalPages || pagination.totalPages === 0 || logs.length === 0) ? 'rgba(99, 102, 241, 0.1)' : '#6366f1', color: (pagination.currentPage >= pagination.totalPages || pagination.totalPages === 0 || logs.length === 0) ? '#6b7280' : '#ffffff', border: 'none', padding: '8px 16px', borderRadius: '0 8px 8px 0', cursor: (pagination.currentPage >= pagination.totalPages || pagination.totalPages === 0 || logs.length === 0) ? 'not-allowed' : 'pointer'}}>
                                {t('next')} <i className="bi bi-chevron-right"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuditLogs;
