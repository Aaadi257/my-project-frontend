import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api';
import { Save, ArrowLeft, Download, Trash2, Edit2 } from 'lucide-react';

const ScoreResult = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [saving, setSaving] = useState(false);

    if (!state || !state.result) {
        return <div className="container">No data. <button onClick={() => navigate('/')}>Go Home</button></div>;
    }

    const { result, mode } = state; // mode='preview' or 'view'
    const breakdown = result.breakdown || {};
    const metrics = result.metrics || {};

    // Use raw values passed directly from the form (most reliable source)
    // Fall back to backend metrics for view/leaderboard mode where rawNeg won't exist
    const rawNeg = state.negativeReviewsRaw || {};
    const negA = isNaN(rawNeg.amritsari) ? (parseInt(metrics.negative_reviews_amritsari) || 0) : (rawNeg.amritsari || 0);
    const negC = isNaN(rawNeg.chennai) ? (parseInt(metrics.negative_reviews_chennai) || 0) : (rawNeg.chennai || 0);
    const negCM = isNaN(rawNeg.chaat_masala) ? (parseInt(metrics.negative_reviews_chaat_masala) || 0) : (rawNeg.chaat_masala || 0);
    const calculatedNegativeScore = (negA + negC + negCM) * -0.25;

    // Use backend value if it's present and non-zero; otherwise use frontend calculation
    const displayNegativeScore = (breakdown.negative_review_score !== undefined && breakdown.negative_review_score !== 0)
        ? breakdown.negative_review_score
        : calculatedNegativeScore;

    const finalTotalScore = (breakdown.negative_review_score !== undefined)
        ? result.total_score
        : parseFloat((result.total_score + calculatedNegativeScore).toFixed(2));

    const handleSave = async () => {
        setSaving(true);
        try {
            // Build a proper ScorecardCreate payload - result.metrics contains the raw metrics
            const createPayload = {
                manager_name: result.manager_name,
                mall_name: result.mall_name,
                month: result.month,
                metrics: result.metrics,
            };
            console.log("[handleSave] Posting to /scorecards:", createPayload);
            const response = await api.post('/scorecards', createPayload);
            console.log("[handleSave] Saved successfully:", response.data);
            navigate('/leaderboard');
        } catch (error) {
            console.error('Save error:', error);
            const msg = error.response?.data?.detail || error.message || 'Failed to save scorecard';
            alert(`Save failed: ${msg}`);
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

    const handleEdit = () => {
        // Split month string back into month + year for the form selectors
        const [selectedMonth = '', selectedYear = ''] = (result.month || '').split(' ');
        const metrics = result.metrics || {};

        navigate('/edit', {
            state: {
                isEdit: true,
                editId: result.id,
                scorecardData: {
                    manager_name: result.manager_name || '',
                    mall_name: result.mall_name || '',
                    selectedMonth,
                    selectedYear: selectedYear ? parseInt(selectedYear, 10) : new Date().getFullYear(),
                    // Spread all metric fields — empty if null so the form shows blank
                    ...Object.fromEntries(
                        Object.entries(metrics).map(([k, v]) => [k, v !== null && v !== undefined ? String(v) : ''])
                    ),
                },
            },
        });
    };

    const BreakdownRow = ({ label, value, max }) => (
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <span>{label}</span>
            <span style={{ fontWeight: 'bold' }}>{value}{max !== undefined && max !== null ? <span className="text-sm"> / {max}</span> : null}</span>
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
                    <div className="score-badge">{Number(finalTotalScore).toFixed(2).replace(/\.00$/, '')}</div>
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
                        <BreakdownRow label="Negative Reviews" value={displayNegativeScore === 0 ? "0" : displayNegativeScore.toFixed(2)} />
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
                                    {result.id && (
                                        <button className="btn-secondary" onClick={handleEdit} style={{ borderColor: 'rgba(245,158,11,0.4)' }}>
                                            <Edit2 size={18} /> Edit Scorecard
                                        </button>
                                    )}
                                    <button className="btn-secondary" style={{ color: '#ef4444' }} onClick={() => navigate('/')}>
                                        Discard &amp; Exit
                                    </button>
                                </>
                            ) : (
                                <>
                                    {result.id && (
                                        <button className="btn-secondary" onClick={handleEdit} style={{ borderColor: 'rgba(245,158,11,0.4)' }}>
                                            <Edit2 size={18} /> Edit Scorecard
                                        </button>
                                    )}
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
