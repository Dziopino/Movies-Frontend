import { useState, useEffect } from 'react';
import { AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useTranslation } from 'react-i18next';
import axios from '../../utils/axiosConfig';
import config from "../../config/api.js";

const DashboardOverview = () => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState({
        kpi: { totalMovies: 0, totalUsers: 0, totalLogs: 0, savedSpace: '74%' },
        lineChartData: [],
        pieChartData: []
    });

    useEffect(() => {
        // eslint-disable-next-line react-hooks/immutability
        fetchOverviewData();
    }, []);

    const mapActionToTranslationKey = (action) => {
        const actionMap = {
            'USER_LOGGED_IN': 'user_logged_in',
            'USER_REGISTERED': 'user_registered',
            'FILM_LIKED': 'film_liked',
            'FILM_UNLIKED': 'film_unliked',
            'FILM_WATCHED': 'film_watched',
            'FILM_UNWATCHED': 'film_unwatched',
            'BIO_UPDATED': 'bio_updated',
            'LANGUAGE_CHANGED': 'language_changed',
            'USERNAME_CHANGED': 'username_changed',
            'AVATAR_UPDATED': 'avatar_updated',
            'PASSWORD_RESET_REQUESTED': 'password_reset_requested',
            'PASSWORD_RESET_COMPLETED': 'password_reset_completed',
            'USER_BANNED': 'user_banned',
            'USER_SUSPENDED': 'user_suspended',
            'USER_UNBANNED': 'user_unbanned',
            'USER_UNSUSPENDED': 'user_unsuspended',
            'USER_PROMOTED': 'user_promoted',
            'GENRE_DELETED': 'genre_deleted',
            'GENRE_UPDATED': 'genre_updated',
            'GENRE_CREATED': 'genre_created',
            'FILM_DELETED': 'film_deleted',
            'FILM_CREATED': 'film_created',
            'FILM_UPDATED': 'film_updated'
        };
        return actionMap[action] || action.toLowerCase();
    };

    const fetchOverviewData = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${config.apiUrl}/api/admin/dashboard/overview`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                const transformedPieChartData = response.data.pieChartData.map(item => ({
                    ...item,
                    name: mapActionToTranslationKey(item.name),
                    originalName: item.name
                }));

                setData({
                    ...response.data,
                    pieChartData: transformedPieChartData
                });
            } else {
                setError(t('failed_to_load_dashboard_data'));
            }
        } catch (err) {
            // Handle rate limiting errors (429) - don't show error, global alert handles it
            if (err.isRateLimitError || err.response?.status === 429) {
                console.warn('[Dashboard] Rate limit hit, global handler active');
                return;
            }

            // Handle other errors
            const errorKey = err.response?.data?.error_key;
            const errorMessage = errorKey ? t(errorKey) : t('server_connection_error');
            setError(errorMessage);
            console.error('Dashboard overview error:', err);
        } finally {
            setLoading(false);
        }
    };

    const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{backgroundColor: '#1a1a24', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: '8px', padding: '12px', color: '#ffffff'}}>
                    <p className="mb-1" style={{ fontSize: '13px', fontWeight: '600' }}>
                        {payload[0].payload.date || payload[0].name}
                    </p>
                    <p className="mb-0" style={{ fontSize: '12px', color: '#a5b4fc' }}>
                        {t('value')}: {payload[0].value}
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
            <div className="col-lg-4 col-md-6">
                <div style={{backgroundColor: 'rgba(15, 15, 28, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(99, 102, 241, 0.1)', borderRadius: '16px', padding: '24px', height: '100%'}}>
                    <div className="d-flex align-items-center mb-3">
                        <div style={{width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(99, 102, 241, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <i className="bi bi-film" style={{ fontSize: '24px', color: '#6366f1' }}></i>
                        </div>
                    </div>
                    <p className="text-white-50 mb-1" style={{ fontSize: '14px' }}>{t('total_movies')}</p>
                    <h2 className="text-white fw-bold mb-0">{data.kpi.totalMovies}</h2>
                </div>
            </div>

            <div className="col-lg-4 col-md-6">
                <div style={{backgroundColor: 'rgba(15, 15, 28, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(139, 92, 246, 0.1)', borderRadius: '16px', padding: '24px', height: '100%'}}>
                    <div className="d-flex align-items-center mb-3">
                        <div style={{width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(139, 92, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <i className="bi bi-people" style={{ fontSize: '24px', color: '#8b5cf6' }}></i>
                        </div>
                    </div>
                    <p className="text-white-50 mb-1" style={{ fontSize: '14px' }}>{t('total_users')}</p>
                    <h2 className="text-white fw-bold mb-0">{data.kpi.totalUsers}</h2>
                </div>
            </div>

            <div className="col-lg-4 col-md-6">
                <div style={{backgroundColor: 'rgba(15, 15, 28, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(236, 72, 153, 0.1)', borderRadius: '16px', padding: '24px', height: '100%'}}>
                    <div className="d-flex align-items-center mb-3">
                        <div style={{width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(236, 72, 153, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <i className="bi bi-activity" style={{ fontSize: '24px', color: '#ec4899' }}></i>
                        </div>
                    </div>
                    <p className="text-white-50 mb-1" style={{ fontSize: '14px' }}>{t('activity_logs')}</p>
                    <h2 className="text-white fw-bold mb-0">{data.kpi.totalLogs}</h2>
                </div>
            </div>

            <div className="col-lg-8">
                <div style={{backgroundColor: 'rgba(15, 15, 28, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(99, 102, 241, 0.1)', borderRadius: '16px', padding: '24px'}}>
                    <h5 className="text-white fw-bold mb-4">{t('activity_trend_last_7_days')}</h5>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={data.lineChartData}>
                            <defs>
                                <linearGradient id="colorIndigo" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
                                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(99, 102, 241, 0.1)" />
                            <XAxis dataKey="date" stroke="#a5b4fc" style={{ fontSize: '12px' }}/>
                            <YAxis stroke="#a5b4fc" style={{ fontSize: '12px' }}/>
                            {/* eslint-disable-next-line react-hooks/static-components */}
                            <Tooltip content={<CustomTooltip />} />
                            <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} fill="url(#colorIndigo)"/>
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="col-lg-4">
                <div style={{backgroundColor: 'rgba(15, 15, 28, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(99, 102, 241, 0.1)', borderRadius: '16px', padding: '24px'}}>
                    <h5 className="text-white fw-bold mb-4">{t('top_actions')}</h5>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={data.pieChartData} cx="50%" cy="50%" labelLine={false} label={(entry) => t(entry.name)} outerRadius={80} fill="#8884d8" dataKey="value">
                                {data.pieChartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            {/* eslint-disable-next-line react-hooks/static-components */}
                            <Tooltip content={<CustomTooltip />} />
                            <Legend
                                wrapperStyle={{ fontSize: '12px', color: '#a5b4fc' }}
                                formatter={(value, entry) => t(entry.payload.name)}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
