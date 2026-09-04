import { useState, useEffect } from 'react';
import { BarChart, Bar, PieChart, Pie, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import config from "../../config/api.js";

const FilmAnalytics = () => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState({topPopularFilms: [], averageRating: { average_rating: 0, min_rating: 0, max_rating: 0 }, recentFilms: { last_week: 0, last_month: 0, last_year: 0 }, genreDistribution: []});

    useEffect(() => {
        // eslint-disable-next-line react-hooks/immutability
        fetchFilmAnalytics();
    }, []);

    const fetchFilmAnalytics = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${config.apiUrl}/api/admin/dashboard/films-analytics`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                const sortedGenreDistribution = [...response.data.genreDistribution].sort((a, b) => b.value - a.value);

                setData({
                    ...response.data,
                    genreDistribution: sortedGenreDistribution
                });
            } else {
                setError(t('failed_to_load_films_analytics'));
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message;
            setError(t(errorMessage || 'server_connection_error'));
            console.error('Film analytics error:', err);
        } finally {
            setLoading(false);
        }
    };

    const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#14b8a6', '#f97316', '#a855f7'];

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{backgroundColor: '#1a1a24', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: '8px', padding: '12px', color: '#ffffff'}}>
                    <p className="mb-1" style={{ fontSize: '13px', fontWeight: '600' }}>
                        {payload[0].payload.title || payload[0].payload.name || payload[0].name}
                    </p>
                    <p className="mb-0" style={{ fontSize: '12px', color: '#a5b4fc' }}>
                        {t('value')}: {payload[0].value}
                    </p>
                </div>
            );
        }
        return null;
    };

    const formatedData = data.genreDistribution.map((entry, index) => ({
        ...entry,
        fill: COLORS[index % COLORS.length]
    }));

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

    const ratingPercentage = data.averageRating.average_rating
        ? ((data.averageRating.average_rating / 10) * 100).toFixed(1)
        : 0;

    return (
        <div className="row g-4">
            <div className="col-lg-4 col-md-6">
                <div style={{backgroundColor: 'rgba(15, 15, 28, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(99, 102, 241, 0.1)', borderRadius: '16px', padding: '24px', height: '100%'}}>
                    <div className="d-flex align-items-center mb-3">
                        <div style={{width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(99, 102, 241, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <i className="bi bi-calendar-week" style={{ fontSize: '24px', color: '#6366f1' }}></i>
                        </div>
                    </div>
                    <p className="text-white-50 mb-1" style={{ fontSize: '14px' }}>{t('films_added_last_week')}</p>
                    <h2 className="text-white fw-bold mb-0">{data.recentFilms.last_week}</h2>
                </div>
            </div>

            <div className="col-lg-4 col-md-6">
                <div style={{backgroundColor: 'rgba(15, 15, 28, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(139, 92, 246, 0.1)', borderRadius: '16px', padding: '24px', height: '100%'}}>
                    <div className="d-flex align-items-center mb-3">
                        <div style={{width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(139, 92, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <i className="bi bi-calendar-month" style={{ fontSize: '24px', color: '#8b5cf6' }}></i>
                        </div>
                    </div>
                    <p className="text-white-50 mb-1" style={{ fontSize: '14px' }}>{t('films_added_last_month')}</p>
                    <h2 className="text-white fw-bold mb-0">{data.recentFilms.last_month}</h2>
                </div>
            </div>

            <div className="col-lg-4 col-md-6">
                <div style={{backgroundColor: 'rgba(15, 15, 28, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(236, 72, 153, 0.1)', borderRadius: '16px', padding: '24px', height: '100%'}}>
                    <div className="d-flex align-items-center mb-3">
                        <div style={{width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(236, 72, 153, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <i className="bi bi-calendar-range" style={{ fontSize: '24px', color: '#ec4899' }}></i>
                        </div>
                    </div>
                    <p className="text-white-50 mb-1" style={{ fontSize: '14px' }}>{t('films_added_last_year')}</p>
                    <h2 className="text-white fw-bold mb-0">{data.recentFilms.last_year}</h2>
                </div>
            </div>

            <div className="col-lg-4">
                <div style={{backgroundColor: 'rgba(15, 15, 28, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(99, 102, 241, 0.1)', borderRadius: '16px', padding: '24px', height: '100%'}}>
                    <h5 className="text-white fw-bold mb-4">{t('average_film_rating')}</h5>
                    <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '200px' }}>
                        <div style={{ position: 'relative', width: '180px', height: '180px' }}>
                            <svg width="180" height="180" style={{ transform: 'rotate(-90deg)' }}>

                                <circle cx="90" cy="90" r="70" fill="none" stroke="rgba(99, 102, 241, 0.1)" strokeWidth="20"/>
                                <circle cx="90" cy="90" r="70" fill="none" stroke="#6366f1" strokeWidth="20" strokeDasharray={`${(ratingPercentage / 100) * 440} 440`} strokeLinecap="round"/>
                            </svg>
                            <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center'}}>
                                <h2 className="text-white fw-bold mb-0" style={{ fontSize: '36px' }}>
                                    {data.averageRating.average_rating ? data.averageRating.average_rating.toFixed(1) : '0.0'}
                                </h2>
                                <p className="text-white-50 mb-0" style={{ fontSize: '12px' }}>{t('out_of_10')}</p>
                            </div>
                        </div>
                        <div className="mt-3 text-center">
                            <p className="text-white-50 mb-0" style={{ fontSize: '13px' }}>
                                {t('range')}: {data.averageRating.min_rating ? data.averageRating.min_rating.toFixed(1) : '0.0'} - {data.averageRating.max_rating ? data.averageRating.max_rating.toFixed(1) : '0.0'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-lg-8 col-md-12">
                <div style={{backgroundColor: 'rgba(15, 15, 28, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(99, 102, 241, 0.1)', borderRadius: '16px', padding: '24px'}}>
                    <h5 className="text-white fw-bold mb-4">{t('genre_distribution')}</h5>
                    {data.genreDistribution.length > 0 ? (
                        <ResponsiveContainer width="100%" height={350}>
                            <PieChart>
                                <Pie data={formatedData} cx="50%" cy="50%" labelLine={false} label={false} outerRadius={window.innerWidth < 768 ? 80 : 120} innerRadius={window.innerWidth < 768 ? 40 : 60} fill="#8884d8" dataKey="value" paddingAngle={2}>
                                </Pie>
                                {/* eslint-disable-next-line react-hooks/static-components */}
                                <Tooltip content={<CustomTooltip />} />
                                <Legend layout={window.innerWidth < 992 ? "horizontal" : "vertical"} align={window.innerWidth < 992 ? "center" : "right"} verticalAlign={window.innerWidth < 992 ? "bottom" : "middle"} wrapperStyle={{
                                        paddingLeft: window.innerWidth < 992 ? '0' : '20px',
                                        paddingTop: window.innerWidth < 992 ? '20px' : '0',
                                        fontSize: '12px',
                                        color: '#a5b4fc',
                                        maxHeight: window.innerWidth < 992 ? 'none' : '300px',
                                        overflowY: window.innerWidth < 992 ? 'visible' : 'auto'
                                    }}
                                    formatter={(value, entry) => {
                                        const percentage = ((entry.payload.value / data.genreDistribution.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1);
                                        return window.innerWidth < 576
                                            ? `${entry.payload.name} (${entry.payload.value})`
                                            : `${entry.payload.name} (${entry.payload.value}) - ${percentage}%`;
                                    }}
                                    iconType="circle"
                                    iconSize={8}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="text-center text-white-50 py-5">
                            <i className="bi bi-inbox" style={{ fontSize: '48px', opacity: 0.3 }}></i>
                            <p className="mt-3 mb-0">{t('no_data_available')}</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="col-12">
                <div style={{backgroundColor: 'rgba(15, 15, 28, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(99, 102, 241, 0.1)', borderRadius: '16px', padding: '24px'}}>
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
                        <h5 className="text-white fw-bold mb-0">{t('top_popular_films')}</h5>
                        <div className="d-flex gap-3">
                            <div className="d-flex align-items-center gap-2">
                                <div style={{width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#6366f1'}}></div>
                                <span style={{ fontSize: '12px', color: '#a5b4fc' }}>{t('likes')}</span>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                                <div style={{width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#8b5cf6'}}></div>
                                <span style={{ fontSize: '12px', color: '#a5b4fc' }}>{t('watched')}</span>
                            </div>
                        </div>
                    </div>
                    {data.topPopularFilms.length > 0 ? (
                        <ResponsiveContainer width="100%" height={window.innerWidth < 768 ? 600 : 500}>
                            <BarChart data={data.topPopularFilms} layout="vertical" margin={{top: 5, right: window.innerWidth < 576 ? 10 : 30, left: window.innerWidth < 576 ? 10 : 20, bottom: 5}}>
                                <defs>
                                    <linearGradient id="likesGradient" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor="#6366f1" stopOpacity={0.8}/>
                                        <stop offset="100%" stopColor="#6366f1" stopOpacity={1}/>
                                    </linearGradient>
                                    <linearGradient id="watchedGradient" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity={1}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(99, 102, 241, 0.1)" horizontal={false}/>
                                <XAxis type="number" stroke="#a5b4fc" tick={{ fill: '#a5b4fc', fontSize: window.innerWidth < 576 ? 10 : 12 }}/>
                                <YAxis type="category" dataKey="title" stroke="#a5b4fc" tick={{ fill: '#a5b4fc', fontSize: window.innerWidth < 576 ? 10 : 12 }} width={window.innerWidth < 576 ? 100 : window.innerWidth < 768 ? 150 : 200}
                                    tickFormatter={(value) => {
                                        if (window.innerWidth < 576 && value.length > 15) {
                                            return value.substring(0, 15) + '...';
                                        }
                                        if (window.innerWidth < 768 && value.length > 20) {
                                            return value.substring(0, 20) + '...';
                                        }
                                        return value;
                                    }}
                                />
                                {/* eslint-disable-next-line react-hooks/static-components */}
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }} />
                                <Bar dataKey="likes_count" fill="url(#likesGradient)" name={t('likes')} radius={[0, 8, 8, 0]} maxBarSize={window.innerWidth < 576 ? 20 : 30}/>
                                <Bar dataKey="watched_count" fill="url(#watchedGradient)" name={t('watched')} radius={[0, 8, 8, 0]} maxBarSize={window.innerWidth < 576 ? 20 : 30}/>
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="text-center text-white-50 py-5">
                            <i className="bi bi-inbox" style={{ fontSize: '48px', opacity: 0.3 }}></i>
                            <p className="mt-3 mb-0">{t('no_data_available')}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FilmAnalytics;
