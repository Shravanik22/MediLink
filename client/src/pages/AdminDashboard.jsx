import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import {
    TrendingUp, Users, ShoppingBag, AlertTriangle, IndianRupee,
    ShieldCheck, UserPlus, ShieldAlert, CheckCircle2, XCircle, Search,
    Heart, Activity, Map as MapIcon
} from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [healthAnalytics, setHealthAnalytics] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('analytics');
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [statsRes, usersRes, healthRes] = await Promise.all([
                axios.get('http://localhost:5000/api/admin/dashboard'),
                axios.get('http://localhost:5000/api/users'),
                axios.get('http://localhost:5000/api/health/analytics')
            ]);
            setStats(statsRes.data);
            setUsers(usersRes.data);
            setHealthAnalytics(healthRes.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const updateUserStatus = async (id, status) => {
        try {
            await axios.patch(`http://localhost:5000/api/users/${id}/status`, { status });
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const verifyChemist = async (id) => {
        try {
            await axios.patch(`http://localhost:5000/api/users/${id}/verify`);
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="font-black text-gray-400 uppercase tracking-widest animate-pulse">Syncing Master Database...</p>
        </div>
    );

    const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

    return (
        <div className="space-y-12 pb-20">
            {/* Master Header */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-8 bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/20">System Integrity Level: High</span>
                    </div>
                    <h1 className="text-5xl font-black text-gray-900 tracking-tighter leading-none mb-2">Master Console <span className="text-primary">+</span></h1>
                    <p className="text-gray-400 font-medium">Monitoring {users.length} nodes across the regional health distribution network</p>
                </div>

                <div className="flex bg-gray-50 p-2 rounded-[2rem] border border-gray-100 w-full xl:w-auto">
                    <TabButton active={activeTab === 'analytics'} label="Finances & Stock" onClick={() => setActiveTab('analytics')} />
                    <TabButton active={activeTab === 'health'} label="Population Health" onClick={() => setActiveTab('health')} />
                    <TabButton active={activeTab === 'users'} label="Verification" onClick={() => setActiveTab('users')} />
                </div>
            </div>

            {activeTab === 'analytics' && (
                <div className="space-y-12 animate-fadeIn">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <StatCard icon={<IndianRupee />} label="Gross Network Revenue" value={`₹${stats?.stats.totalRevenue}`} trend="+12.4%" color="emerald" />
                        <StatCard icon={<ShoppingBag />} label="Successful Fulfillments" value={stats?.stats.totalOrders} trend="+8%" color="blue" />
                        <StatCard icon={<AlertTriangle />} label="Emergency Priority" value={stats?.stats.emergencyOrders} trend="High Priority" color="red" />
                        <StatCard icon={<Users />} label="Registered Population" value={stats?.stats.totalUsers} trend="Active Nodes" color="amber" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        <div className="bg-white p-12 rounded-[4rem] shadow-2xl border border-gray-50 relative">
                            <h3 className="text-2xl font-black text-gray-900 mb-10 flex items-center justify-between">
                                Network Growth <TrendingUp className="text-emerald-500" />
                            </h3>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={stats?.revenueByMonth}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                        <XAxis dataKey="_id" tickFormatter={(val) => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][val - 1]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900 }} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900 }} />
                                        <Tooltip cursor={{ fill: 'rgba(0,0,0,0.02)' }} contentStyle={{ borderRadius: '2rem', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)' }} />
                                        <Bar dataKey="revenue" fill="#10b981" radius={[12, 12, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="bg-white p-12 rounded-[4rem] shadow-2xl border border-gray-50">
                            <h3 className="text-2xl font-black text-gray-900 mb-10 flex items-center justify-between">
                                Supply Chain Risks <ShieldAlert className="text-red-500" />
                            </h3>
                            <div className="space-y-6 max-h-[350px] overflow-y-auto pr-4 custom-scrollbar">
                                {stats?.lowStockMedicines.length > 0 ? stats.lowStockMedicines.map(med => (
                                    <div key={med._id} className="group flex items-center justify-between p-8 bg-gray-50 rounded-[2.5rem] border border-gray-50 hover:bg-red-50/50 hover:border-red-100 transition-all">
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-red-500 shadow-sm group-hover:scale-110 transition-transform">
                                                <TrendingUp size={32} />
                                            </div>
                                            <div>
                                                <p className="text-xl font-black text-gray-900 leading-tight mb-1">{med.name}</p>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">{med.chemist.businessName}</span>
                                                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                                    <span className="text-[10px] font-bold text-gray-400">Node ID: {med.chemist._id.slice(-6)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-3xl font-black text-gray-900">{med.stockQuantity}</p>
                                            <p className="text-[9px] text-red-400 font-black uppercase tracking-widest">Qty Left</p>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-4 border-dashed border-gray-100 text-gray-300">
                                        <CheckCircle2 size={48} className="mx-auto mb-4" />
                                        <p className="font-black italic">Supply Chain Optimized.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'health' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-fadeIn">
                    <div className="bg-white p-14 rounded-[4rem] shadow-2xl border border-gray-50">
                        <h3 className="text-3xl font-black text-gray-900 mb-12">Population BMI Distribution</h3>
                        <div className="h-96">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={healthAnalytics} dataKey="count" nameKey="_id" cx="50%" cy="50%" innerRadius={80} outerRadius={140} paddingAngle={10} stroke="none">
                                        {healthAnalytics.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: '2rem', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white p-14 rounded-[4rem] shadow-2xl border border-gray-50">
                        <h3 className="text-3xl font-black text-gray-900 mb-12">Mean Glucose Levels (by Risk Group)</h3>
                        <div className="h-96">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={healthAnalytics} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                                    <XAxis type="number" axisLine={false} tickLine={false} />
                                    <YAxis dataKey="_id" type="category" axisLine={false} tickLine={false} width={120} tick={{ fontSize: 10, fontWeight: 900 }} />
                                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '1.5rem', border: 'none' }} />
                                    <Bar dataKey="avgSugar" fill="#3b82f6" radius={[0, 20, 20, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'users' && (
                <div className="bg-white rounded-[4rem] shadow-2xl border border-gray-100 overflow-hidden animate-fadeIn">
                    <div className="p-12 border-b border-gray-50 bg-gray-50/20 flex flex-col xl:flex-row justify-between items-center gap-8">
                        <div className="relative w-full max-w-2xl">
                            <Search className="absolute left-10 top-1/2 -translate-y-1/2 text-gray-300" size={32} />
                            <input
                                type="text"
                                placeholder="Filter secure nodes by name, role, or credentials..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-28 pr-10 py-8 bg-white border-none rounded-[2.5rem] shadow-xl shadow-gray-100/50 focus:ring-8 focus:ring-primary/5 transition-all outline-none italic font-bold text-xl"
                            />
                        </div>
                        <div className="flex gap-10">
                            <div className="text-right">
                                <p className="text-4xl font-black text-gray-900 tabular-nums">{users.filter(u => u.role === 'chemist' && !u.isVerified).length}</p>
                                <p className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em] mt-1">Pending Verifications</p>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-100/30">
                                <tr>
                                    <th className="px-12 py-8 text-[11px] font-black text-gray-400 uppercase tracking-widest">Entity Signature</th>
                                    <th className="px-12 py-8 text-[11px] font-black text-gray-400 uppercase tracking-widest">Access Node</th>
                                    <th className="px-12 py-8 text-[11px] font-black text-gray-400 uppercase tracking-widest text-center">Fulfillment Status</th>
                                    <th className="px-12 py-8 text-[11px] font-black text-gray-400 uppercase tracking-widest text-right">Master Controls</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.role.toLowerCase().includes(search.toLowerCase())).map(user => (
                                    <tr key={user._id} className="hover:bg-gray-50/50 transition-all duration-300 group">
                                        <td className="px-12 py-10">
                                            <div className="flex items-center gap-8">
                                                <div className={`w-20 h-20 rounded-[1.8rem] flex items-center justify-center font-black text-2xl shadow-xl transition-all group-hover:rotate-6 ${user.role === 'admin' ? 'bg-indigo-600 text-white' :
                                                        user.role === 'chemist' ? 'bg-blue-600 text-white' : 'bg-emerald-500 text-white'
                                                    }`}>
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-2xl font-black text-gray-900 tracking-tighter mb-1 group-hover:text-primary transition-colors">{user.name}</p>
                                                    <div className="flex items-center gap-2">
                                                        <Activity size={10} className="text-gray-300" />
                                                        <p className="text-[11px] font-black text-gray-400 uppercase tracking-tighter">{user.businessName || 'Rural Citizen Profile'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-12 py-10">
                                            <p className="font-bold text-gray-700 mb-1">{user.email}</p>
                                            <span className="bg-gray-100 px-3 py-1 rounded-lg text-[9px] font-black text-gray-500 uppercase">Node ID: {user._id.slice(-8)}</span>
                                        </td>
                                        <td className="px-12 py-10 text-center">
                                            <div className="flex flex-col items-center gap-2">
                                                <StatusBadge status={user.status} />
                                                {user.role === 'chemist' && (
                                                    <span className={`text-[9px] font-black uppercase ${user.isVerified ? 'text-emerald-500' : 'text-amber-500'}`}>
                                                        {user.isVerified ? '✓ Identity Verified' : '⚠ Validation Required'}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-12 py-10 text-right">
                                            <div className="flex justify-end gap-4 opacity-0 group-hover:opacity-100 transition-all">
                                                {user.role === 'chemist' && !user.isVerified && (
                                                    <ControlButton onClick={() => verifyChemist(user._id)} icon={<ShieldCheck size={24} />} color="blue" />
                                                )}
                                                {user.status === 'blocked' ? (
                                                    <ControlButton onClick={() => updateUserStatus(user._id, 'active')} icon={<CheckCircle2 size={24} />} color="emerald" />
                                                ) : (
                                                    <ControlButton onClick={() => updateUserStatus(user._id, 'blocked')} icon={<XCircle size={24} />} color="red" />
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

const TabButton = ({ active, label, onClick }) => (
    <button
        onClick={onClick}
        className={`px-10 py-5 rounded-[1.5rem] font-black text-sm transition-all duration-500 ${active ? 'bg-white shadow-2xl shadow-gray-200 text-gray-900 scale-105' : 'text-gray-400 hover:text-gray-700'
            }`}
    >
        {label}
    </button>
);

const StatCard = ({ icon, label, value, trend, color }) => (
    <div className={`p-10 bg-white rounded-[3.5rem] shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-2xl transition-all`}>
        <div className={`absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 group-hover:scale-150 transition-all text-${color}-600`}>
            {icon}
        </div>
        <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4">{label}</p>
        <p className="text-5xl font-black text-gray-900 tabular-nums mb-3 tracking-tighter">{value}</p>
        <span className={`text-[10px] font-black px-3 py-1 rounded-full bg-${color}-50 text-${color}-600 border border-${color}-100`}>{trend}</span>
    </div>
);

const StatusBadge = ({ status }) => {
    const active = status !== 'blocked';
    return (
        <span className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-inner ${active ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
            }`}>
            {active ? 'Secure Node' : 'Blocked Node'}
        </span>
    );
};

const ControlButton = ({ icon, onClick, color }) => (
    <button
        onClick={onClick}
        className={`p-5 bg-${color}-50 text-${color}-600 rounded-[1.5rem] hover:bg-${color}-600 hover:text-white transition-all shadow-xl shadow-${color}-100/20 active:scale-95`}
    >
        {icon}
    </button>
);

export default AdminDashboard;
