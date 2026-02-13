import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    LineChart, Line
} from 'recharts';
import {
    TrendingUp, Users, ShoppingBag, AlertTriangle, IndianRupee,
    ShieldCheck, UserPlus, ShieldAlert, CheckCircle2, XCircle, Search
} from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('analytics');
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [statsRes, usersRes] = await Promise.all([
                axios.get('http://localhost:5000/api/admin/dashboard'),
                axios.get('http://localhost:5000/api/users')
            ]);
            setStats(statsRes.data);
            setUsers(usersRes.data);
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

    if (loading) return <div className="p-20 text-center font-bold text-gray-400 animate-pulse">Initializing Master Console...</div>;

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 leading-tight">Master Analytics & Control</h1>
                    <p className="text-gray-500 font-medium">Monitoring rural distribution & system integrity</p>
                </div>
                <div className="bg-gray-100 p-1.5 rounded-[1.5rem] flex gap-2">
                    <button
                        onClick={() => setActiveTab('analytics')}
                        className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all ${activeTab === 'analytics' ? 'bg-white shadow-lg text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                        Analytics
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all ${activeTab === 'users' ? 'bg-white shadow-lg text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                        Users & Verification
                    </button>
                </div>
            </div>

            {activeTab === 'analytics' ? (
                <div className="space-y-10 animate-fadeIn">
                    {/* Top Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard icon={<IndianRupee />} label="Gross Revenue" value={`₹${stats?.stats.totalRevenue}`} color="emerald" />
                        <StatCard icon={<ShoppingBag />} label="Completed Orders" value={stats?.stats.totalOrders} color="blue" />
                        <StatCard icon={<AlertTriangle />} label="Emergency Alerts" value={stats?.stats.emergencyOrders} color="red" />
                        <StatCard icon={<Users />} label="Total Population" value={stats?.stats.totalUsers} color="amber" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Revenue Chart */}
                        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
                            <h3 className="text-xl font-bold mb-8">Monthly Growth (Paid Transactions)</h3>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={stats?.revenueByMonth}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                        <XAxis dataKey="_id" tickFormatter={(val) => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][val - 1]} axisLine={false} tickLine={false} />
                                        <YAxis axisLine={false} tickLine={false} />
                                        <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                                        <Bar dataKey="revenue" fill="#10b981" radius={[6, 6, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Critical Inventory alerts */}
                        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
                            <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                                <ShieldAlert className="text-red-500" size={24} /> Distribution Alert Center
                            </h3>
                            <div className="space-y-4 max-h-80 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-gray-200">
                                {stats?.lowStockMedicines.length > 0 ? stats.lowStockMedicines.map(med => (
                                    <div key={med._id} className="group flex items-center justify-between p-6 bg-gray-50 rounded-[2rem] border border-gray-100 hover:bg-red-50 hover:border-red-100 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-red-500 shadow-sm group-hover:scale-110 transition-transform">
                                                <TrendingUp size={24} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 leading-none mb-1">{med.name}</p>
                                                <p className="text-[10px] font-black text-red-600 uppercase tracking-widest">{med.chemist.businessName}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-black text-gray-900">{med.stockQuantity}</p>
                                            <p className="text-[9px] text-gray-400 font-bold uppercase">Critical Level</p>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center py-20 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-100">
                                        <CheckCircle2 className="mx-auto text-emerald-300 mb-4" size={48} />
                                        <p className="text-gray-400 font-bold italic text-sm">System Healthy. No stock criticalities.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="animate-fadeIn space-y-6">
                    {/* User Management */}
                    <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                            <div className="relative w-full max-w-md">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search by name, email, or role..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-16 pr-6 py-4 bg-white border border-gray-100 rounded-2xl focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                                />
                            </div>
                            <div className="flex gap-4">
                                <div className="text-right">
                                    <p className="text-xl font-black text-gray-900 leading-none">{users.length}</p>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Active Nodes</p>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50/50">
                                    <tr>
                                        <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">User Entity</th>
                                        <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Account Node</th>
                                        <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                                        <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Node Controls</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.role.toLowerCase().includes(search.toLowerCase())).map(user => (
                                        <tr key={user._id} className="hover:bg-gray-50/50 transition-all">
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-5">
                                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg ${user.role === 'admin' ? 'bg-indigo-100 text-indigo-600' :
                                                            user.role === 'chemist' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'
                                                        }`}>
                                                        {user.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900 leading-none mb-1.5">{user.name}</p>
                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{user.businessName || 'Rural Citizen'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <p className="text-sm font-bold text-gray-900">{user.email}</p>
                                                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${user.role === 'admin' ? 'bg-indigo-50 text-indigo-600' :
                                                        user.role === 'chemist' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
                                                    }`}>
                                                    {user.role} role
                                                </span>
                                            </td>
                                            <td className="px-10 py-8 text-center">
                                                <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tighter shadow-sm border ${user.status === 'blocked' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                    }`}>
                                                    {user.status || 'Active'}
                                                </span>
                                            </td>
                                            <td className="px-10 py-8 text-right">
                                                <div className="flex justify-end gap-3">
                                                    {user.role === 'chemist' && !user.isVerified && (
                                                        <button onClick={() => verifyChemist(user._id)} className="p-3 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                                                            <ShieldCheck size={20} />
                                                        </button>
                                                    )}
                                                    {user.status === 'blocked' ? (
                                                        <button onClick={() => updateUserStatus(user._id, 'active')} className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm">
                                                            <CheckCircle2 size={20} />
                                                        </button>
                                                    ) : (
                                                        <button onClick={() => updateUserStatus(user._id, 'blocked')} className="p-3 bg-red-50 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-sm">
                                                            <XCircle size={20} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const StatCard = ({ icon, label, value, color }) => (
    <div className={`p-10 bg-white rounded-[3rem] shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-xl transition-all`}>
        <div className={`absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform text-${color}-600`}>
            {icon}
        </div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-3">{label}</p>
        <p className="text-5xl font-black text-gray-900 tabular-nums">{value}</p>
    </div>
);

export default AdminDashboard;
