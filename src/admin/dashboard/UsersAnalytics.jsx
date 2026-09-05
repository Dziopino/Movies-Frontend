import { useState, useEffect } from 'react';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useTranslation } from 'react-i18next';
import axios from '../../utils/axiosConfig';
import config from "../../config/api.js";

const UsersAnalytics = () => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState({moderationStats: { bannedCount: 0, suspendedCount: 0 }, registrationChartData: []});

    useEffect(() => {
        // eslint-disable-next-line react-hooks/immutability
        fetchUsersAnalytics();
    }, []);

    const fetchUsersAnalytics = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${config.apiUrl}/api/admin/dashboard/users-analytics`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setData(response.data);
            } else {
                setError(t('failed_to_load_users_analytics'));
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message;
            setError(t(errorMessage || 'server_connection_error'));
            console.error('Users analytics error:', err);
        } finally {
            setLoading(false);
        }
    };

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{backgroundColor: '#1a1a24', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: '8px', padding: '12px', color: '#ffffff'}}>
                    <p className="mb-1" style={{ fontSize: '13px', fontWeight: '600' }}>
                        {payload[0].payload.date}
                    </p>
                    <p className="mb-0" style={{ fontSize: '12px', color: '#a5b4fc' }}>
                        {t('registrations')}: {payload[0].value}
                    </p>
                </div>
            );
        }
        return null;
    };

    if (loading) {
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
            <div className="col-lg-6">
                <div style={{backgroundColor: 'rgba(15, 15, 28, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(220, 38, 38, 0.2)', borderRadius: '16px', padding: '32px', height: '100%', position: 'relative', overflow: 'hidden'}}>
                    <div style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(circle at 50% 50%, rgba(220, 38, 38, 0.15) 0%, transparent 70%)', pointerEvents: 'none'}}></div>
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <div className="d-flex align-items-center mb-4">
                            <div style={{width: '56px', height: '56px', borderRadius: '14px', backgroundColor: 'rgba(220, 38, 38, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                <i className="bi bi-shield-x" style={{ fontSize: '28px', color: '#ef4444' }}></i>
                            </div>
                        </div>
                        <p className="text-white-50 mb-2" style={{ fontSize: '16px', fontWeight: '500' }}>
                            {t('total_banned_users')}
                        </p>
                        <h1 className="text-white fw-bold mb-0" style={{ fontSize: '48px' }}>
                            {data.moderationStats.bannedCount}
                        </h1>
                        <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(220, 38, 38, 0.2)' }}>
                            <span className="badge bg-danger bg-opacity-25 text-danger" style={{ fontSize: '12px', padding: '6px 12px' }}>
                                <i className="bi bi-exclamation-triangle-fill me-1"></i>
                                {t('permanent_action')}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-lg-6">
                <div style={{backgroundColor: 'rgba(15, 15, 28, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '16px', padding: '32px', height: '100%', position: 'relative', overflow: 'hidden'}}>
                    <div style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(circle at 50% 50%, rgba(245, 158, 11, 0.15) 0%, transparent 70%)', pointerEvents: 'none'}}></div>
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <div className="d-flex align-items-center mb-4">
                            <div style={{width: '56px', height: '56px', borderRadius: '14px', backgroundColor: 'rgba(245, 158, 11, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                <i className="bi bi-pause-circle" style={{ fontSize: '28px', color: '#f59e0b' }}></i>
                            </div>
                        </div>
                        <p className="text-white-50 mb-2" style={{ fontSize: '16px', fontWeight: '500' }}>
                            {t('total_suspended_users')}
                        </p>
                        <h1 className="text-white fw-bold mb-0" style={{ fontSize: '48px' }}>
                            {data.moderationStats.suspendedCount}
                        </h1>
                        <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(245, 158, 11, 0.2)' }}>
                            <span className="badge bg-warning bg-opacity-25 text-warning" style={{ fontSize: '12px', padding: '6px 12px' }}>
                                <i className="bi bi-clock-fill me-1"></i>
                                {t('temporary_action')}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-12">
                <div style={{backgroundColor: 'rgba(15, 15, 28, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(99, 102, 241, 0.1)', borderRadius: '16px', padding: '24px'}}>
                    <div className="d-flex align-items-center justify-content-between mb-4">
                        <div>
                            <h5 className="text-white fw-bold mb-1">{t('user_registration_trend')}</h5>
                            <p className="text-white-50 mb-0" style={{ fontSize: '14px' }}>
                                {t('new_user_signups_last_7_days')}
                            </p>
                        </div>
                        <div style={{padding: '8px 16px', backgroundColor: 'rgba(99, 102, 241, 0.1)', borderRadius: '8px', border: '1px solid rgba(99, 102, 241, 0.2)'}}>
                            <span className="text-white" style={{ fontSize: '14px', fontWeight: '600' }}>
                                <i className="bi bi-calendar-week me-2"></i>
                                {t('last_7_days')}
                            </span>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={data.registrationChartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(99, 102, 241, 0.1)" />
                            <XAxis dataKey="date" stroke="#a5b4fc" style={{ fontSize: '12px' }}/>
                            <YAxis stroke="#a5b4fc" style={{ fontSize: '12px' }}/>
                            {/* eslint-disable-next-line react-hooks/static-components */}
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }} />
                            <Bar dataKey="value" fill="#6366f1" radius={[8, 8, 0, 0]} barSize={40}/>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default UsersAnalytics;
