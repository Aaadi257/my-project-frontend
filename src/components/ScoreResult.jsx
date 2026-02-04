import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api';
import { Save, ArrowLeft, Download, Trash2 } from 'lucide-react';

const ScoreResult = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [saving, setSaving] = useState(false);

    if (!state || !state.result) {
        return <div className="container">No data. <button onClick={() => navigate('/')}>Go Home</button></div>;
    }

    const { result, mode } = state; // mode='preview' or 'view'
    const breakdown = result.breakdown;

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.post('/scorecards', result);
            navigate('/leaderboard');
        } catch (error) {
            console.error(error);
            alert('Failed to save');
        } finally {
            setSaving(false);
        }
    };

    const handleDownload = async () => {
        if (!result.id) return;
        try {
            const response = await api.get(`/export/${result.id}`, { responseType: 'blob' });
            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Scorecard_${result.manager_name}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Download failed", error);
        }
    };

    const handleDelete = async () => {
        if (!result.id || !window.confirm("Are you sure you want to delete this scorecard?")) return;
        try {
            await api.delete(`/scorecards/${result.id}`);
            navigate('/leaderboard');
        } catch (error) {
            console.error(error);
        }
    };

    const BreakdownRow = ({ label, value, max }) => (
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <span>{label}</span>
            <span style={{ fontWeight: 'bold' }}>{value} <span className="text-sm">/ {max}</span></span>
        </div>
    );

    return (
        <div className="container animate-fade-in">
            <header className="nav-header">
                <div>
                    <h1>Scorecard Result</h1>
                    <p className="text-sm">{result.manager_name} - {result.mall_name}</p>
                </div>
                <button className="btn-secondary" onClick={() => navigate(mode === 'view' ? '/leaderboard' : '/')}>
                    <ArrowLeft size={16} /> {mode === 'view' ? 'Leaderboard' : 'Back'}
                </button>
            </header>

            <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div className="text-sm">Total Score</div>
                    <div className="score-badge">{result.total_score}</div>
                </div>

                <div className="grid grid-2">
                    <div>
                        <h3>Metrics Breakdown</h3>
                        <BreakdownRow label="Google Rating" value={breakdown.google_score} max="10" />
                        <BreakdownRow label="Zomato + Swiggy" value={breakdown.zomato_swiggy_score} max="10" />
                        <BreakdownRow label="Food Cost" value={breakdown.food_cost_score} max="20" />
                        <BreakdownRow label="Online Activity" value={breakdown.online_activity_score} max="10" />
                        <BreakdownRow label="Kitchen Prep" value={breakdown.kitchen_prep_score} max="12" />
                        <BreakdownRow label="Bad & Delay Order" value={breakdown.bad_delay_score} max="10" />
                        <BreakdownRow label="Outlet Audit" value={breakdown.outlet_audit_score} max="20" />
                        <BreakdownRow label="Add On Sale" value={breakdown.add_on_sale_score} max="12" />
                    </div>
                    <div>
                        <h3>Details</h3>
                        <p><strong>Month:</strong> {result.month}</p>
                        <p><strong>Manager:</strong> {result.manager_name}</p>
                        <p><strong>Mall:</strong> {result.mall_name}</p>
                        <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {mode === 'preview' ? (
                                <>
                                    <button className="btn-primary" onClick={handleSave} disabled={saving}>
                                        <Save size={18} /> {saving ? 'Saving...' : 'Save to Leaderboard'}
                                    </button>
                                    <button className="btn-secondary" style={{ color: '#ef4444' }} onClick={() => navigate('/')}>
                                        Discard & Exit
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button className="btn-primary" onClick={handleDownload}>
                                        <Download size={18} /> Download Excel
                                    </button>
                                    <button className="btn-danger" onClick={handleDelete}>
                                        <Trash2 size={18} /> Delete Scorecard
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScoreResult;
