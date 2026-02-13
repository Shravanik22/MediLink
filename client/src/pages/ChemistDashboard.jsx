import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    AlertCircle, CheckCircle, Truck, Package, Clock,
    TrendingUp, ShoppingBag, AlertTriangle, IndianRupee
} from 'lucide-react';
import { format } from 'date-fns';

const ChemistDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [stats, setStats] = useState({
        pending: 0,
        delivered: 0,
        totalSales: 0,
        emergencyCount: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/orders/chemist');
            setOrders(res.data);

            // Calculate Stats
            const pending = res.data.filter(o => o.status === 'pending').length;
            const delivered = res.data.filter(o => o.status === 'delivered' || o.status === 'completed').length;
            const emergencyCount = res.data.filter(o => o.isEmergency && o.status === 'pending').length;
            const totalSales = res.data
                .filter(o => o.paymentStatus === 'paid')
                .reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);

            setStats({ pending, delivered, totalSales, emergencyCount });
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const updateStatus = async (id, status, comment) => {
        try {
            await axios.patch(`http://localhost:5000/api/orders/${id}/status`, { status, comment });
            fetchOrders();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="space-y-8 pb-12">
            {/* Header & Quick Stats */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 leading-tight">Chemist Control Center</h1>
                    <p className="text-gray-500 font-medium">Monitoring regional prescriptions & sales performance</p>
                </div>
                <div className="grid grid-cols-2 sm:flex gap-4 w-full md:w-auto">
                    <SummaryCard icon={<Clock className="text-amber-500" size={16} />} label="Pending" value={stats.pending} color="amber" />
                    <SummaryCard icon={<IndianRupee className="text-emerald-500" size={16} />} label="Revenue" value={`₹${stats.totalSales}`} color="emerald" />
                </div>
            </div>

            {/* Sales Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-5">
                    <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                        <ShoppingBag size={28} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Orders</p>
                        <p className="text-2xl font-black text-gray-900">{orders.length}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-5">
                    <div className={`w-14 h-14 ${stats.emergencyCount > 0 ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-gray-50 text-gray-400'} rounded-2xl flex items-center justify-center`}>
                        <AlertTriangle size={28} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Urgent Actions</p>
                        <p className={`text-2xl font-black ${stats.emergencyCount > 0 ? 'text-red-600' : 'text-gray-900'}`}>{stats.emergencyCount}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-5">
                    <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                        <CheckCircle size={28} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Completed</p>
                        <p className="text-2xl font-black text-gray-900">{stats.delivered}</p>
                    </div>
                </div>
            </div>

            {/* Main Order Queue */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">Incoming Medicine Requests</h2>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-100 px-3 py-1 rounded-full">{orders.length} Active</span>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {orders.sort((a, b) => (b.isEmergency - a.isEmergency)).map(order => (
                        <div key={order._id} className={`bg-white p-6 rounded-[2.5rem] shadow-sm border ${order.isEmergency ? 'border-red-200 bg-red-50/10' : 'border-gray-100'} transition-all hover:shadow-lg`}>
                            <div className="flex flex-wrap justify-between items-start gap-4">
                                <div className="flex gap-4">
                                    <div className={`w-16 h-16 rounded-3xl flex items-center justify-center ${order.isEmergency ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-400'}`}>
                                        <Package size={30} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-xl font-black text-gray-900">{order.orderId}</h3>
                                            {order.isEmergency && (
                                                <span className="bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest animate-pulse border-2 border-white shadow-sm">Emergency</span>
                                            )}
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-bold text-gray-500 flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
                                                Patient: <span className="text-gray-900">{order.patientDetails.name}</span>
                                            </p>
                                            <p className="text-xs font-bold text-gray-400 flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
                                                Phone: <span className="text-gray-600 font-medium">{order.patientDetails.phone}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    {order.prescriptionPath && (
                                        <button className="px-5 py-2.5 bg-gray-900 text-white rounded-2xl font-bold flex items-center gap-2 text-sm hover:scale-105 transition-all">
                                            View Rx
                                        </button>
                                    )}
                                    <div className="flex gap-2">
                                        {order.status === 'pending' && (
                                            <>
                                                <button onClick={() => updateStatus(order._id, 'accepted', 'Verification complete')} className="px-6 py-2.5 bg-emerald-500 text-white rounded-2xl font-bold hover:bg-emerald-600 transition-all text-sm shadow-md shadow-emerald-100">Accept</button>
                                                <button onClick={() => updateStatus(order._id, 'rejected', 'Out of stock')} className="px-6 py-2.5 bg-red-100 text-red-600 rounded-2xl font-bold hover:bg-red-200 transition-all text-sm">Reject</button>
                                            </>
                                        )}
                                        {order.status === 'accepted' && (
                                            <button onClick={() => updateStatus(order._id, 'packed', 'Medication ready')} className="px-6 py-2.5 bg-blue-500 text-white rounded-2xl font-bold hover:bg-blue-600 transition-all text-sm shadow-md shadow-blue-100">Ready to Ship</button>
                                        )}
                                        {order.status === 'packed' && (
                                            <button onClick={() => updateStatus(order._id, 'out_for_delivery', 'Handed to courier')} className="px-6 py-2.5 bg-indigo-500 text-white rounded-2xl font-bold hover:bg-indigo-600 transition-all text-sm shadow-md shadow-indigo-100">Dispatch</button>
                                        )}
                                        {order.status === 'out_for_delivery' && (
                                            <button onClick={() => updateStatus(order._id, 'delivered', 'Hand delivered')} className="px-6 py-2.5 bg-primary text-white rounded-2xl font-bold hover:bg-emerald-600 transition-all text-sm shadow-md shadow-emerald-200">Delivered</button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Timeline with details */}
                            <div className="mt-8 pt-6 border-t border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex items-center gap-6 overflow-x-auto pb-2 md:pb-0">
                                    <TimelineStep icon={<Clock size={12} />} active={true} label="Incoming" time={format(new Date(order.createdAt), 'HH:mm')} />
                                    <TimelineStep icon={<CheckCircle size={12} />} active={['accepted', 'packed', 'out_for_delivery', 'delivered'].includes(order.status)} label="Verified" />
                                    <TimelineStep icon={<Package size={12} />} active={['packed', 'out_for_delivery', 'delivered'].includes(order.status)} label="Packed" />
                                    <TimelineStep icon={<Truck size={12} />} active={['out_for_delivery', 'delivered'].includes(order.status)} label="Transit" />
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Payment Status</p>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-sm ${order.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                                        {order.paymentStatus === 'paid' ? 'Paid - Digital' : 'Unpaid - COD'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {orders.length === 0 && (
                        <div className="p-20 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
                            <TrendingUp className="mx-auto text-gray-300 mb-4" size={48} />
                            <p className="text-gray-500 font-bold text-lg">Your queue is empty.</p>
                            <p className="text-gray-400 text-sm">New orders from village kiosks will appear here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const TimelineStep = ({ icon, active, label, time }) => (
    <div className={`flex items-center gap-3 ${active ? 'opacity-100' : 'opacity-30'}`}>
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${active ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}>
            {icon}
        </div>
        <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-900 leading-none mb-1">{label}</p>
            {time && <p className="text-[9px] font-bold text-gray-400">{time}</p>}
        </div>
    </div>
);

const SummaryCard = ({ icon, label, value, color }) => (
    <div className={`bg-white border border-gray-100 px-5 py-3 rounded-2xl flex items-center gap-4 shadow-sm hover:shadow-md transition-all`}>
        <div className={`w-8 h-8 bg-${color}-50 rounded-lg flex items-center justify-center`}>
            {icon}
        </div>
        <div>
            <p className="text-lg font-black text-gray-900 leading-none">{value}</p>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">{label}</p>
        </div>
    </div>
);

export default ChemistDashboard;
