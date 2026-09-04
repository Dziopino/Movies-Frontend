import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DashboardOverview from './dashboard/DashboardOverview';
import UsersAnalytics from './dashboard/UsersAnalytics';
import FilmAnalytics from './dashboard/FilmAnalytics';
import AuditLogs from './dashboard/AuditLogs';

function AdminDashboard() {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('overview');

    return (
        <div className="container-fluid py-4" style={{ backgroundColor: '#0a0a12', minHeight: '100vh' }}>
            <div className="row mb-4">
                <div className="col-12">
                    <h1 className="text-white fw-bold mb-4">{t('admin_dashboard')}</h1>

                    <ul className="nav nav-pills mb-4" style={{ gap: '12px' }}>
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
                                onClick={() => setActiveTab('overview')}
                                style={{
                                    backgroundColor: activeTab === 'overview' ? '#6366f1' : 'rgba(99, 102, 241, 0.1)',
                                    color: activeTab === 'overview' ? '#ffffff' : '#a5b4fc',
                                    border: 'none',
                                    borderRadius: '12px',
                                    padding: '12px 24px',
                                    fontWeight: '600',
                                    transition: 'all 0.3s ease',
                                    backdropFilter: 'blur(10px)'
                                }}
                            >
                                <i className="bi bi-grid-3x3-gap-fill me-2"></i>
                                {t('overview')}
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
                                onClick={() => setActiveTab('users')}
                                style={{
                                    backgroundColor: activeTab === 'users' ? '#6366f1' : 'rgba(99, 102, 241, 0.1)',
                                    color: activeTab === 'users' ? '#ffffff' : '#a5b4fc',
                                    border: 'none',
                                    borderRadius: '12px',
                                    padding: '12px 24px',
                                    fontWeight: '600',
                                    transition: 'all 0.3s ease',
                                    backdropFilter: 'blur(10px)'
                                }}
                            >
                                <i className="bi bi-people-fill me-2"></i>
                                {t('users_analytics')}
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === 'films' ? 'active' : ''}`}
                                onClick={() => setActiveTab('films')}
                                style={{
                                    backgroundColor: activeTab === 'films' ? '#6366f1' : 'rgba(99, 102, 241, 0.1)',
                                    color: activeTab === 'films' ? '#ffffff' : '#a5b4fc',
                                    border: 'none',
                                    borderRadius: '12px',
                                    padding: '12px 24px',
                                    fontWeight: '600',
                                    transition: 'all 0.3s ease',
                                    backdropFilter: 'blur(10px)'
                                }}
                            >
                                <i className="bi bi-film me-2"></i>
                                {t('films_analytics')}
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === 'audit' ? 'active' : ''}`}
                                onClick={() => setActiveTab('audit')}
                                style={{
                                    backgroundColor: activeTab === 'audit' ? '#6366f1' : 'rgba(99, 102, 241, 0.1)',
                                    color: activeTab === 'audit' ? '#ffffff' : '#a5b4fc',
                                    border: 'none',
                                    borderRadius: '12px',
                                    padding: '12px 24px',
                                    fontWeight: '600',
                                    transition: 'all 0.3s ease',
                                    backdropFilter: 'blur(10px)'
                                }}
                            >
                                <i className="bi bi-clock-history me-2"></i>
                                {t('audit_logs')}
                            </button>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="row">
                <div className="col-12">
                    {activeTab === 'overview' && <DashboardOverview />}
                    {activeTab === 'users' && <UsersAnalytics />}
                    {activeTab === 'films' && <FilmAnalytics />}
                    {activeTab === 'audit' && <AuditLogs />}
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;