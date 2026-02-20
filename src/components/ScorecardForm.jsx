import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Calculator } from 'lucide-react';

// Helper Components defined outside to prevent re-renders losing focus
const MetricSection = ({ title, children }) => (
    <div className="metric-group fade-in">
        <h3>{title}</h3>
        <div className="grid grid-2">{children}</div>
    </div>
);

const InputGroup = ({ label, name, value, onChange, type = "number", step = "0.1" }) => (
    <div>
        <label>{label}</label>
        <input
            type={type}
            step={step}
            name={name}
            value={value}
            onChange={onChange}
            required
            placeholder="0"
        />
    </div>
);

const ScorecardForm = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Initial State matching Backend Pydantic Model
    const [formData, setFormData] = useState({
        manager_name: '',
        mall_name: '',
        selectedMonth: new Date().toLocaleString('default', { month: 'long' }),
        selectedYear: new Date().getFullYear(),

        google_rating_amritsari: '',
        google_rating_chennai: '',
        google_rating_chaat_masala: '',

        zomato_rating_amritsari: '',
        swiggy_rating_amritsari: '',
        zomato_rating_chennai: '',
        swiggy_rating_chennai: '',
        zomato_rating_chaat_masala: '',
        swiggy_rating_chaat_masala: '',

        food_cost_amritsari: '',
        food_cost_chennai: '',
        food_cost_chaat_masala: '',

        online_activity_amritsari_zomato: '',
        online_activity_amritsari_swiggy: '',
        online_activity_chennai_zomato: '',
        online_activity_chennai_swiggy: '',
        online_activity_chaat_masala_zomato: '',
        online_activity_chaat_masala_swiggy: '',

        kitchen_prep_amritsari_zomato: '',
        kitchen_prep_amritsari_swiggy: '',
        kitchen_prep_chennai_zomato: '',
        kitchen_prep_chennai_swiggy: '',
        kitchen_prep_chaat_masala_zomato: '',
        kitchen_prep_chaat_masala_swiggy: '',

        bad_order_amritsari_zomato: '',
        bad_order_chennai_zomato: '',
        bad_order_chaat_masala_zomato: '',

        delay_order_amritsari_swiggy: '',
        delay_order_chennai_swiggy: '',
        delay_order_chaat_masala_swiggy: '',

        mistakes_amritsari: '',
        mistakes_chennai: '',
        mistakes_chaat_masala: '',

        total_sale_amritsari: '',
        add_on_sale_amritsari: '',
        total_sale_chennai: '',
        add_on_sale_chennai: '',
        total_sale_chaat_masala: '',
        add_on_sale_chaat_masala: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Convert strings to numbers where appropriate
            const payload = {
                manager_name: formData.manager_name,
                mall_name: formData.mall_name,
                month: `${formData.selectedMonth} ${formData.selectedYear}`,
                metrics: {
                    google_rating_amritsari: parseFloat(formData.google_rating_amritsari) || 0,
                    google_rating_chennai: parseFloat(formData.google_rating_chennai) || 0,
                    google_rating_chaat_masala: parseFloat(formData.google_rating_chaat_masala) || 0,

                    zomato_rating_amritsari: parseFloat(formData.zomato_rating_amritsari) || 0,
                    swiggy_rating_amritsari: parseFloat(formData.swiggy_rating_amritsari) || 0,
                    zomato_rating_chennai: parseFloat(formData.zomato_rating_chennai) || 0,
                    swiggy_rating_chennai: parseFloat(formData.swiggy_rating_chennai) || 0,
                    zomato_rating_chaat_masala: parseFloat(formData.zomato_rating_chaat_masala) || 0,
                    swiggy_rating_chaat_masala: parseFloat(formData.swiggy_rating_chaat_masala) || 0,

                    food_cost_amritsari: parseFloat(formData.food_cost_amritsari) || 0,
                    food_cost_chennai: parseFloat(formData.food_cost_chennai) || 0,
                    food_cost_chaat_masala: parseFloat(formData.food_cost_chaat_masala) || 0,

                    online_activity_amritsari_zomato: parseFloat(formData.online_activity_amritsari_zomato) || 0,
                    online_activity_amritsari_swiggy: parseFloat(formData.online_activity_amritsari_swiggy) || 0,
                    online_activity_chennai_zomato: parseFloat(formData.online_activity_chennai_zomato) || 0,
                    online_activity_chennai_swiggy: parseFloat(formData.online_activity_chennai_swiggy) || 0,
                    online_activity_chaat_masala_zomato: parseFloat(formData.online_activity_chaat_masala_zomato) || 0,
                    online_activity_chaat_masala_swiggy: parseFloat(formData.online_activity_chaat_masala_swiggy) || 0,

                    kitchen_prep_amritsari_zomato: parseFloat(formData.kitchen_prep_amritsari_zomato) || 0,
                    kitchen_prep_amritsari_swiggy: parseFloat(formData.kitchen_prep_amritsari_swiggy) || 0,
                    kitchen_prep_chennai_zomato: parseFloat(formData.kitchen_prep_chennai_zomato) || 0,
                    kitchen_prep_chennai_swiggy: parseFloat(formData.kitchen_prep_chennai_swiggy) || 0,
                    kitchen_prep_chaat_masala_zomato: parseFloat(formData.kitchen_prep_chaat_masala_zomato) || 0,
                    kitchen_prep_chaat_masala_swiggy: parseFloat(formData.kitchen_prep_chaat_masala_swiggy) || 0,

                    bad_order_amritsari_zomato: parseFloat(formData.bad_order_amritsari_zomato) || 0,
                    bad_order_chennai_zomato: parseFloat(formData.bad_order_chennai_zomato) || 0,
                    bad_order_chaat_masala_zomato: parseFloat(formData.bad_order_chaat_masala_zomato) || 0,

                    delay_order_amritsari_swiggy: parseFloat(formData.delay_order_amritsari_swiggy) || 0,
                    delay_order_chennai_swiggy: parseFloat(formData.delay_order_chennai_swiggy) || 0,
                    delay_order_chaat_masala_swiggy: parseFloat(formData.delay_order_chaat_masala_swiggy) || 0,

                    mistakes_amritsari: parseInt(formData.mistakes_amritsari) || 0,
                    mistakes_chennai: parseInt(formData.mistakes_chennai) || 0,
                    mistakes_chaat_masala: parseInt(formData.mistakes_chaat_masala) || 0,

                    total_sale_amritsari: parseFloat(formData.total_sale_amritsari) || 0,
                    add_on_sale_amritsari: parseFloat(formData.add_on_sale_amritsari) || 0,
                    total_sale_chennai: parseFloat(formData.total_sale_chennai) || 0,
                    add_on_sale_chennai: parseFloat(formData.add_on_sale_chennai) || 0,
                    total_sale_chaat_masala: parseFloat(formData.total_sale_chaat_masala) || 0,
                    add_on_sale_chaat_masala: parseFloat(formData.add_on_sale_chaat_masala) || 0,
                }
            };

            const response = await api.post('/scorecards', payload);
            navigate('/result', { state: { result: response.data } });

        } catch (error) {
            console.error(error);
            alert("Error calculating score. Please check inputs.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container animate-fade-in">
            <header className="nav-header">
                <div>
                    <h1>New Scorecard</h1>
                    <p className="text-sm">Enter metrics for {formData.selectedMonth} {formData.selectedYear}</p>
                </div>
                <button className="btn-secondary" onClick={() => navigate('/')}>Dashboard</button>
            </header>

            <form onSubmit={handleSubmit} className="card">
                <div className="grid grid-2" style={{ marginBottom: '2rem' }}>
                    <div>
                        <label>Manager Name</label>
                        <input type="text" name="manager_name" value={formData.manager_name} onChange={handleChange} required placeholder="John Doe" />
                    </div>
                    <div>
                        <label>Mall Name</label>
                        <input type="text" name="mall_name" value={formData.mall_name} onChange={handleChange} required placeholder="Mall/Outlet" />
                    </div>
                    <div>
                        <label>Month</label>
                        <select name="selectedMonth" value={formData.selectedMonth} onChange={handleChange}>
                            {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Year</label>
                        <select name="selectedYear" value={formData.selectedYear} onChange={handleChange}>
                            {Array.from({ length: 25 }, (_, i) => 2026 + i).map(y => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <MetricSection title="Google Rating">
                    <InputGroup label="Amritsari Express" name="google_rating_amritsari" value={formData.google_rating_amritsari} onChange={handleChange} />
                    <InputGroup label="Cafe Chennai" name="google_rating_chennai" value={formData.google_rating_chennai} onChange={handleChange} />
                    <InputGroup label="Chaat Masala" name="google_rating_chaat_masala" value={formData.google_rating_chaat_masala} onChange={handleChange} />
                </MetricSection>

                <MetricSection title="Zomato & Swiggy Rating">
                    <InputGroup label="Amritsari Zomato" name="zomato_rating_amritsari" value={formData.zomato_rating_amritsari} onChange={handleChange} />
                    <InputGroup label="Amritsari Swiggy" name="swiggy_rating_amritsari" value={formData.swiggy_rating_amritsari} onChange={handleChange} />
                    <InputGroup label="Chennai Zomato" name="zomato_rating_chennai" value={formData.zomato_rating_chennai} onChange={handleChange} />
                    <InputGroup label="Chennai Swiggy" name="swiggy_rating_chennai" value={formData.swiggy_rating_chennai} onChange={handleChange} />
                    <InputGroup label="CM Zomato" name="zomato_rating_chaat_masala" value={formData.zomato_rating_chaat_masala} onChange={handleChange} />
                    <InputGroup label="CM Swiggy" name="swiggy_rating_chaat_masala" value={formData.swiggy_rating_chaat_masala} onChange={handleChange} />
                </MetricSection>

                <MetricSection title="Food Cost %">
                    <InputGroup label="Amritsari %" name="food_cost_amritsari" value={formData.food_cost_amritsari} onChange={handleChange} />
                    <InputGroup label="Chennai %" name="food_cost_chennai" value={formData.food_cost_chennai} onChange={handleChange} />
                    <InputGroup label="Chaat Masala %" name="food_cost_chaat_masala" value={formData.food_cost_chaat_masala} onChange={handleChange} />
                </MetricSection>

                <MetricSection title="Online Activity %">
                    <InputGroup label="Amritsari Zomato %" name="online_activity_amritsari_zomato" value={formData.online_activity_amritsari_zomato} onChange={handleChange} />
                    <InputGroup label="Amritsari Swiggy %" name="online_activity_amritsari_swiggy" value={formData.online_activity_amritsari_swiggy} onChange={handleChange} />
                    <InputGroup label="Chennai Zomato %" name="online_activity_chennai_zomato" value={formData.online_activity_chennai_zomato} onChange={handleChange} />
                    <InputGroup label="Chennai Swiggy %" name="online_activity_chennai_swiggy" value={formData.online_activity_chennai_swiggy} onChange={handleChange} />
                    <InputGroup label="CM Zomato %" name="online_activity_chaat_masala_zomato" value={formData.online_activity_chaat_masala_zomato} onChange={handleChange} />
                    <InputGroup label="CM Swiggy %" name="online_activity_chaat_masala_swiggy" value={formData.online_activity_chaat_masala_swiggy} onChange={handleChange} />
                </MetricSection>

                <MetricSection title="Kitchen Prep Time (mins)">
                    <InputGroup label="Amritsari Zomato" name="kitchen_prep_amritsari_zomato" value={formData.kitchen_prep_amritsari_zomato} onChange={handleChange} />
                    <InputGroup label="Amritsari Swiggy" name="kitchen_prep_amritsari_swiggy" value={formData.kitchen_prep_amritsari_swiggy} onChange={handleChange} />
                    <InputGroup label="Chennai Zomato" name="kitchen_prep_chennai_zomato" value={formData.kitchen_prep_chennai_zomato} onChange={handleChange} />
                    <InputGroup label="Chennai Swiggy" name="kitchen_prep_chennai_swiggy" value={formData.kitchen_prep_chennai_swiggy} onChange={handleChange} />
                    <InputGroup label="CM Zomato" name="kitchen_prep_chaat_masala_zomato" value={formData.kitchen_prep_chaat_masala_zomato} onChange={handleChange} />
                    <InputGroup label="CM Swiggy" name="kitchen_prep_chaat_masala_swiggy" value={formData.kitchen_prep_chaat_masala_swiggy} onChange={handleChange} />
                </MetricSection>

                <MetricSection title="Bad Order % (Zomato Only)">
                    <InputGroup label="Amritsari %" name="bad_order_amritsari_zomato" value={formData.bad_order_amritsari_zomato} onChange={handleChange} />
                    <InputGroup label="Chennai %" name="bad_order_chennai_zomato" value={formData.bad_order_chennai_zomato} onChange={handleChange} />
                    <InputGroup label="Chaat Masala %" name="bad_order_chaat_masala_zomato" value={formData.bad_order_chaat_masala_zomato} onChange={handleChange} />
                </MetricSection>

                <MetricSection title="Delay Order % (Swiggy Only)">
                    <InputGroup label="Amritsari %" name="delay_order_amritsari_swiggy" value={formData.delay_order_amritsari_swiggy} onChange={handleChange} />
                    <InputGroup label="Chennai %" name="delay_order_chennai_swiggy" value={formData.delay_order_chennai_swiggy} onChange={handleChange} />
                    <InputGroup label="Chaat Masala %" name="delay_order_chaat_masala_swiggy" value={formData.delay_order_chaat_masala_swiggy} onChange={handleChange} />
                </MetricSection>

                <MetricSection title="Outlet Audit (Mistakes)">
                    <InputGroup label="Amritsari Mistakes" name="mistakes_amritsari" value={formData.mistakes_amritsari} onChange={handleChange} type="number" step="1" />
                    <InputGroup label="Chennai Mistakes" name="mistakes_chennai" value={formData.mistakes_chennai} onChange={handleChange} type="number" step="1" />
                    <InputGroup label="Chaat Masala Mistakes" name="mistakes_chaat_masala" value={formData.mistakes_chaat_masala} onChange={handleChange} type="number" step="1" />
                </MetricSection>

                <MetricSection title="Add On Sale">
                    <InputGroup label="Amritsari Total" name="total_sale_amritsari" value={formData.total_sale_amritsari} onChange={handleChange} />
                    <InputGroup label="Amritsari AOS" name="add_on_sale_amritsari" value={formData.add_on_sale_amritsari} onChange={handleChange} />
                    <InputGroup label="Chennai Total" name="total_sale_chennai" value={formData.total_sale_chennai} onChange={handleChange} />
                    <InputGroup label="Chennai AOS" name="add_on_sale_chennai" value={formData.add_on_sale_chennai} onChange={handleChange} />
                    <InputGroup label="CM Total" name="total_sale_chaat_masala" value={formData.total_sale_chaat_masala} onChange={handleChange} />
                    <InputGroup label="CM AOS" name="add_on_sale_chaat_masala" value={formData.add_on_sale_chaat_masala} onChange={handleChange} />
                </MetricSection>

                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', fontSize: '1.2rem' }}>
                        {loading ? 'Calculating...' : 'Generate Scorecard'} <Calculator size={20} />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ScorecardForm;
