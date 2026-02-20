import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Trophy, Eye, ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react';

const Leaderboard = () => {
    const navigate = useNavigate();
    const [scorecards, setScorecards] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    const fetchScores = useCallback(async (isRefresh = false) => {
        // On refresh: show spinner in button but keep existing data visible
        // On initial load: show full loading screen
        if (isRefresh) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }
        setError(null);

        try {
            const params = new URLSearchParams();
            if (selectedMonth) params.append('month', selectedMonth);
            if (selectedYear) params.append('year', selectedYear);

            const response = await api.get(`/leaderboard?${params.toString()}`);

            if (!Array.isArray(response.data)) {
                throw new Error('Unexpected response from server');
            }

            // Data is already sorted DESC by the backend
            setScorecards(response.data);
        } catch (err) {
            console.error('Leaderboard fetch error:', err);
            const msg = err.response?.data?.detail
                || err.message
                || 'Could not connect to server. Is the backend running?';
            setError(msg);
            // Do NOT clear scorecards — keep previous data visible if we have it
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [selectedMonth, selectedYear]);

    // Fetch on mount and whenever filters change
    useEffect(() => {
        fetchScores();
    }, [fetchScores]);

    const handleView = (item) => {
        navigate('/result', { state: { result: item, mode: 'view' } });
    };

    const getRankCell = (index) => {
        if (index === 0) return <Trophy size={20} color="#fbbf24" title="1st Place" />;
        if (index === 1) return <Trophy size={20} color="#94a3b8" title="2nd Place" />;
        if (index === 2) return <Trophy size={20} color="#b45309" title="3rd Place" />;
        return <span>{index + 1}</span>;
    };

    return (
        <div className="container animate-fade-in">
            <header className="nav-header">
                <div>
                    <h1>Leaderboard</h1>
                    <p className="text-sm">
                        Top performing managers
                        {scorecards.length > 0 && !loading && (
                            <span style={{ marginLeft: '0.5rem', opacity: 0.6 }}>
                                ({scorecards.length} record{scorecards.length !== 1 ? 's' : ''})
                            </span>
                        )}
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                        className="btn-secondary"
                        onClick={() => fetchScores(true)}
                        disabled={refreshing || loading}
                        title="Refresh leaderboard"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                    >
                        <RefreshCw
                            size={16}
                            style={{
                                animation: refreshing ? 'spin 1s linear infinite' : 'none'
                            }}
                        />
                        {refreshing ? 'Refreshing...' : 'Refresh'}
                    </button>
                    <button className="btn-secondary" onClick={() => navigate('/')}>
                        <ArrowLeft size={16} /> Home
                    </button>
                </div>
            </header>

            <div className="card">
                {/* Filters */}
                <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <label style={{ marginBottom: 0 }}>Month:</label>
                        <select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            style={{ width: '150px' }}
                        >
                            <option value="">All Months</option>
                            {['January', 'February', 'March', 'April', 'May', 'June',
                                'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                                    <option key={m} value={m}>{m}</option>
                                ))}
                        </select>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <label style={{ marginBottom: 0 }}>Year:</label>
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            style={{ width: '100px' }}
                        >
                            <option value="">All</option>
                            {Array.from({ length: 25 }, (_, i) => 2026 + i).map(y => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Error Banner — shown on top of stale data if present */}
                {error && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.85rem 1.1rem',
                        marginBottom: '1rem',
                        background: 'rgba(239, 68, 68, 0.12)',
                        border: '1px solid rgba(239, 68, 68, 0.35)',
                        borderRadius: '8px',
                        color: '#fca5a5',
                        fontSize: '0.9rem',
                    }}>
                        <AlertCircle size={18} style={{ flexShrink: 0 }} />
                        <span>{error}</span>
                        <button
                            className="btn-secondary"
                            style={{ marginLeft: 'auto', padding: '0.3rem 0.7rem', fontSize: '0.8rem' }}
                            onClick={() => fetchScores(true)}
                        >
                            Retry
                        </button>
                    </div>
                )}

                {/* Initial loading state */}
                {loading ? (
                    <div className="text-center" style={{ padding: '3rem 0', opacity: 0.6 }}>
                        Loading leaderboard...
                    </div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Manager</th>
                                <th>Mall</th>
                                <th>Month</th>
                                <th>Score</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {scorecards.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center" style={{ padding: '2rem', opacity: 0.6 }}>
                                        {error ? 'Could not load records.' : 'No records found.'}
                                    </td>
                                </tr>
                            ) : (
                                scorecards.map((item, index) => (
                                    <tr key={item.id}>
                                        <td>{getRankCell(index)}</td>
                                        <td style={{ fontWeight: 500 }}>{item.manager_name}</td>
                                        <td>{item.mall_name}</td>
                                        <td>{item.month}</td>
                                        <td style={{ fontWeight: 'bold', color: 'var(--accent)' }}>
                                            {typeof item.total_score === 'number'
                                                ? item.total_score.toFixed(2)
                                                : item.total_score}
                                        </td>
                                        <td>
                                            <button
                                                className="btn-secondary"
                                                style={{ padding: '0.4rem 0.8rem' }}
                                                onClick={() => handleView(item)}
                                            >
                                                <Eye size={16} /> View
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Spin animation for refresh icon */}
            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default Leaderboard;
