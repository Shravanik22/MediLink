import { useState, useEffect } from 'react';
import axios from 'axios';
import { Activity, Heart, Thermometer, User, Plus, RefreshCcw } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const WellbeingTracker = () => {
    const [patientData, setPatientData] = useState({
        weight: '', height: '', bpSystolic: '', bpDiastolic: '', sugar: ''
    });
    const [history, setHistory] = useState([]);
    const [bmi, setBmi] = useState(null);
    const [risk, setRisk] = useState(null);

    const calculateBMI = (w, h) => {
        if (!w || !h) return null;
        const heightInMeters = h / 100;
        return (w / (heightInMeters * heightInMeters)).toFixed(1);
    };

    const handleSave = async () => {
        const currentBmi = calculateBMI(patientData.weight, patientData.height);
        setBmi(currentBmi);

        // Mock health flag logic
        let flags = [];
        if (currentBmi > 25) flags.push('Overweight');
        if (patientData.bpSystolic > 140) flags.push('High BP');
        if (patientData.sugar > 140) flags.push('High Sugar');

        setRisk(flags.length > 0 ? flags : null);

        // Add to local history for visualization
        const newRecord = {
            date: new Date().toLocaleDateString(),
            bmi: parseFloat(currentBmi),
            sugar: parseFloat(patientData.sugar)
        };
        setHistory([...history, newRecord]);
    };

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 leading-tight">Biometric Vital Tracker</h2>
                    <p className="text-gray-500 font-medium">Record and monitor village patient health metrics</p>
                </div>
                <button onClick={handleSave} className="bg-primary text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-emerald-600 transition-all">
                    <RefreshCcw size={18} /> Re-Calculate & Save
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Inputs */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
                        <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Plus size={18} className="text-primary" /> Entry Panel
                        </h3>
                        <div className="space-y-4">
                            <InputField label="Weight (kg)" value={patientData.weight} onChange={(e) => setPatientData({ ...patientData, weight: e.target.value })} placeholder="e.g. 70" />
                            <InputField label="Height (cm)" value={patientData.height} onChange={(e) => setPatientData({ ...patientData, height: e.target.value })} placeholder="e.g. 175" />
                            <div className="grid grid-cols-2 gap-4">
                                <InputField label="BP (Systolic)" value={patientData.bpSystolic} onChange={(e) => setPatientData({ ...patientData, bpSystolic: e.target.value })} placeholder="120" />
                                <InputField label="BP (Diastolic)" value={patientData.bpDiastolic} onChange={(e) => setPatientData({ ...patientData, bpDiastolic: e.target.value })} placeholder="80" />
                            </div>
                            <InputField label="Sugar Level (mg/dL)" value={patientData.sugar} onChange={(e) => setPatientData({ ...patientData, sugar: e.target.value })} placeholder="e.g. 100" />
                        </div>
                    </div>

                    {risk && (
                        <div className="bg-red-50 p-6 rounded-3xl border border-red-100 animate-pulse">
                            <h4 className="text-red-600 font-black text-xs uppercase mb-2 tracking-widest">Health Risk Flags</h4>
                            <div className="flex flex-wrap gap-2">
                                {risk.map((r, i) => (
                                    <span key={i} className="bg-red-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase">{r}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Analysis & Chart */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <HealthCard icon={<Activity />} label="Current BMI" value={bmi || '--'} color="emerald" sub={bmi ? (bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal" : "Overweight") : "Pending Data"} />
                        <HealthCard icon={<Heart />} label="Blood Pressure" value={patientData.bpSystolic ? `${patientData.bpSystolic}/${patientData.bpDiastolic}` : '--'} color="blue" sub="Target: 120/80" />
                    </div>

                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-900 mb-6 italic">Historical Health Trends</h3>
                        {history.length > 0 ? (
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={history}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="bmi" stroke="#10b981" strokeWidth={3} dot={{ r: 6 }} />
                                        <Line type="monotone" dataKey="sugar" stroke="#3b82f6" strokeWidth={3} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                <p className="text-gray-400 font-medium">Add first record to visualize patterns</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const InputField = ({ label, value, onChange, placeholder }) => (
    <div>
        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">{label}</label>
        <input
            type="number"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full bg-white border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm transition-all"
        />
    </div>
);

const HealthCard = ({ icon, label, value, color, sub }) => (
    <div className={`p-8 bg-white border border-${color}-100 rounded-3xl shadow-sm hover:translate-y-[-4px] transition-all`}>
        <div className={`text-${color}-500 mb-4`}>{icon}</div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-4xl font-black text-gray-900 leading-none mb-2">{value}</p>
        <p className={`text-xs font-bold text-${color}-600`}>{sub}</p>
    </div>
);

export default WellbeingTracker;
