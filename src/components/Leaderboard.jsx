import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Trophy, Eye, ArrowLeft } from 'lucide-react';

const Leaderboard = () => {
    const navigate = useNavigate();
    const [scorecards, setScorecards] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchScores = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (selectedMonth) params.append('month', selectedMonth);
            if (selectedYear) params.append('year', selectedYear);

            const response = await api.get(`/scorecards?${params.toString()}`);
            // Sort by score desc
            const sorted = response.data.sort((a, b) => b.total_score - a.total_score);
            setScorecards(sorted);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchScores();
    }, [selectedMonth, selectedYear]);

    const handleView = (item) => {
        navigate('/result', { state: { result: item, mode: 'view' } });
    };

    return (
        <div className="container animate-fade-in">
            <header className="nav-header">
                <div>
                    <h1>Leaderboard</h1>
                    <p className="text-sm">Top performing managers</p>
                </div>
                <button className="btn-secondary" onClick={() => navigate('/')}>
                    <ArrowLeft size={16} /> Home
                </button>
            </header>

            <div className="card">
                <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <label style={{ marginBottom: 0 }}>Month:</label>
                        <select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            style={{ width: '150px' }}
                        >
                            <option value="">All Months</option>
                            {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
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

                {loading ? (
                    <div className="text-center">Loading...</div>
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
                                    <td colSpan="6" className="text-center">No records found</td>
                                </tr>
                            ) : (
                                scorecards.map((item, index) => (
                                    <tr key={item.id}>
                                        <td>
                                            {index === 0 && <Trophy size={20} color="#fbbf24" />}
                                            {index === 1 && <Trophy size={20} color="#94a3b8" />}
                                            {index === 2 && <Trophy size={20} color="#b45309" />}
                                            {index > 2 && index + 1}
                                        </td>
                                        <td style={{ fontWeight: 500 }}>{item.manager_name}</td>
                                        <td>{item.mall_name}</td>
                                        <td>{item.month}</td>
                                        <td style={{ fontWeight: 'bold', color: 'var(--accent)' }}>{item.total_score}</td>
                                        <td>
                                            <button className="btn-secondary" style={{ padding: '0.4rem 0.8rem' }} onClick={() => handleView(item)}>
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
        </div>
    );
};

export default Leaderboard;
