import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Trophy } from 'lucide-react';

const Dashboard = () => {
    const navigate = useNavigate();

    return (
        <div className="container animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
            <h1 style={{ fontSize: '3.5rem', marginBottom: '0.5rem', textAlign: 'center', background: 'linear-gradient(to right, #f8fafc, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Manager Reward System
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '4rem', maxWidth: '600px', textAlign: 'center' }}>
                Track metrics, calculate scores, and reward excellence across Amritsari Express and Cafe Chennai.
            </p>

            <div className="grid grid-2" style={{ width: '100%', maxWidth: '800px' }}>
                <div className="card" onClick={() => navigate('/new')} style={{ cursor: 'pointer', textAlign: 'center', padding: '3rem 2rem', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                    <div style={{ background: 'rgba(245, 158, 11, 0.1)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                        <PlusCircle size={40} color="var(--accent)" />
                    </div>
                    <h2>New Scorecard</h2>
                    <p className="text-sm">Enter metrics and calculate scores for an outlet manager.</p>
                </div>

                <div className="card" onClick={() => navigate('/leaderboard')} style={{ cursor: 'pointer', textAlign: 'center', padding: '3rem 2rem', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                    <div style={{ background: 'rgba(16, 185, 129, 0.1)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                        <Trophy size={40} color="var(--success)" />
                    </div>
                    <h2>Leaderboard</h2>
                    <p className="text-sm">View top performers and past records.</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
