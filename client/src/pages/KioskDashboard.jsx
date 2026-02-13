import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard, FileUp, Search, Activity,
    TrendingUp, AlertCircle, ShoppingBag,
    Star, MapPin, Truck, ChevronRight, X, Minus, Plus, CreditCard,
    Download, MessageCircle, Heart, Bell, Package, Clock, Map, CheckCircle2
} from 'lucide-react';

import WellbeingTracker from '../components/WellbeingTracker';

const KioskDashboard = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('orders');
    const [cart, setCart] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [healthSummary, setHealthSummary] = useState(null);

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            const [healthRes, userRes] = await Promise.all([
                axios.get('http://localhost:5000/api/health/history'),
                axios.get('http://localhost:5000/api/users/profile')
            ]);
            if (healthRes.data.metrics?.length > 0) {
                setHealthSummary(healthRes.data.metrics[healthRes.data.metrics.length - 1]);
            }
            setNotifications(userRes.data.notifications || []);
        } catch (err) {
            console.error('Data sync failed', err);
        }
    };

    const addToCart = (medicine, chemist) => {
        const item = { ...medicine, chemistName: chemist.businessName, chemistId: chemist._id };
        setCart([...cart, item]);
    };

    const removeFromCart = (id) => {
        setCart(cart.filter((_, i) => i !== id));
    };

    return (
        <div className="flex flex-col lg:flex-row gap-10 pb-20">
            {/* Sidebar with Notification Center */}
            <aside className="w-full lg:w-80 space-y-6">
                <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                            <Activity size={24} />
                        </div>
                        <div>
                            <p className="font-black text-gray-900 leading-none">Status: Active</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Village Node #{user?.id?.slice(-4)}</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <NavButton active={activeTab === 'orders'} icon={<LayoutDashboard size={20} />} label="Tracking & History" onClick={() => setActiveTab('orders')} />
                        <NavButton active={activeTab === 'search'} icon={<Search size={20} />} label="Pharmacy Market" onClick={() => setActiveTab('search')} />
                        <NavButton active={activeTab === 'map'} icon={<Map size={20} />} label="Nearby Nodes" onClick={() => setActiveTab('map')} />
                        <NavButton active={activeTab === 'prescription'} icon={<FileUp size={20} />} label="Scan Prescription" onClick={() => setActiveTab('prescription')} />
                        <NavButton active={activeTab === 'wellbeing'} icon={<Heart size={20} />} label="Vital Monitoring" onClick={() => setActiveTab('wellbeing')} />
                    </div>
                </div>

                {/* Patient Vitals Quick Peek */}
                {healthSummary && (
                    <div className="bg-emerald-50 p-6 rounded-[2.5rem] border border-emerald-100 shadow-sm">
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-4">Latest Patient Vitals</p>
                        <div className="grid grid-cols-2 gap-4">
                            <VitalMini label="BMI" value={healthSummary.bmi} color="emerald" />
                            <VitalMini label="BP" value={`${healthSummary.bloodPressure.systolic}/${healthSummary.bloodPressure.diastolic}`} color="blue" />
                        </div>
                    </div>
                )}

                {/* Notifications */}
                <div className="bg-gray-900 p-6 rounded-[2.5rem] shadow-xl text-white">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                            <Bell size={14} className="text-amber-400" /> Notifications
                        </p>
                        <span className="bg-white/10 px-2 py-0.5 rounded-lg text-[10px] font-black">{notifications.filter(n => !n.read).length}</span>
                    </div>
                    <div className="space-y-3 max-h-40 overflow-y-auto pr-2 scrollbar-hide">
                        {notifications.length > 0 ? notifications.slice(-3).reverse().map((n, i) => (
                            <div key={i} className="p-3 bg-white/5 rounded-xl border border-white/10">
                                <p className="text-[10px] font-bold text-amber-400 uppercase mb-1">{n.title}</p>
                                <p className="text-[11px] text-gray-400 leading-snug">{n.message}</p>
                            </div>
                        )) : (
                            <p className="text-[10px] italic text-gray-500 text-center py-4">All caught up.</p>
                        )}
                    </div>
                </div>

                {cart.length > 0 && (
                    <div className="p-6 bg-primary rounded-[2.5rem] text-white shadow-xl shadow-emerald-100 animate-slideUp">
                        <div className="flex justify-between items-center mb-4">
                            <p className="text-xs font-black uppercase tracking-widest italic">Order Draft</p>
                            <ShoppingBag size={20} />
                        </div>
                        <p className="text-2xl font-black mb-6">₹{cart.reduce((a, c) => a + c.price, 0)}</p>
                        <button onClick={() => setActiveTab('checkout')} className="w-full bg-white text-primary py-4 rounded-2xl font-black text-sm hover:scale-105 transition-all shadow-lg">
                            Checkout ({cart.length} Items)
                        </button>
                    </div>
                )}
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 bg-white rounded-[4rem] shadow-2xl p-12 border border-blue-50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>

                {activeTab === 'orders' && <ActiveOrders />}
                {activeTab === 'prescription' && <PrescriptionUpload />}
                {activeTab === 'search' && <MedicineSearch addToCart={addToCart} />}
                {activeTab === 'map' && <NetworkMap />}
                {activeTab === 'wellbeing' && <WellbeingTracker onUpdate={fetchInitialData} />}
                {activeTab === 'checkout' && <Checkout cart={cart} clearCart={() => setCart([])} healthSummary={healthSummary} onComplete={() => setActiveTab('orders')} />}
            </main>
        </div>
    );
};

const NavButton = ({ active, icon, label, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black transition-all group ${active ? 'bg-gray-900 text-white shadow-xl scale-[1.02]' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-900'
            }`}
    >
        <span className={`${active ? 'text-primary' : 'group-hover:text-primary'}`}>{icon}</span>
        <span className="text-xs uppercase tracking-widest">{label}</span>
    </button>
);

const VitalMini = ({ label, value, color }) => (
    <div className={`bg-white rounded-2xl p-3 border border-${color}-100 shadow-sm text-center`}>
        <p className={`text-[8px] font-black text-${color}-600 uppercase mb-1`}>{label}</p>
        <p className="text-xs font-black text-gray-900 leading-none">{value}</p>
    </div>
);

const Checkout = ({ cart, clearCart, healthSummary, onComplete }) => {
    const [submitting, setSubmitting] = useState(false);
    const [isEmergency, setIsEmergency] = useState(false);
    const [paymentMode, setPaymentMode] = useState('COD');

    const total = cart.reduce((acc, curr) => acc + (curr.price || 0), 0);

    const handleConfirm = async () => {
        setSubmitting(true);
        try {
            // Simplified order creation for all items
            const orderData = {
                patientDetails: { name: 'Kiosk Patient', phone: '000-000-0000' },
                medicines: cart.map(m => ({ medicineId: m._id, name: m.name, price: m.price, quantity: 1 })),
                totalAmount: total,
                paymentMode,
                isEmergency
            };
            await axios.post('http://localhost:5000/api/orders', orderData);
            clearCart();
            onComplete();
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-4">
            <h2 className="text-4xl font-black mb-2">Final Review</h2>
            <p className="text-gray-400 font-medium mb-10">Confirm items and health context before dispatch</p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-4">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Medical Draft</p>
                    {cart.map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm">
                                    <Package size={24} />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 leading-none mb-1">{item.name}</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">{item.chemistName}</p>
                                </div>
                            </div>
                            <p className="font-black text-gray-900">₹{item.price}</p>
                        </div>
                    ))}

                    <div className="pt-6">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Payment Method</p>
                        <div className="flex gap-4">
                            <PaymentOption active={paymentMode === 'COD'} label="Cash on Delivery" onClick={() => setPaymentMode('COD')} icon={<Truck size={18} />} />
                            <PaymentOption active={paymentMode === 'UPI'} label="Digital UPI" onClick={() => setPaymentMode('UPI')} icon={<TrendingUp size={18} />} />
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Health Warning integration */}
                    {healthSummary?.healthRiskFlag === 'High' && (
                        <div className="bg-red-50 p-6 rounded-[2rem] border border-red-100 flex items-start gap-4 animate-shake">
                            <AlertCircle className="text-red-500 shrink-0" size={24} />
                            <div>
                                <p className="text-red-900 font-black text-sm">Critical Health Risk Detected</p>
                                <p className="text-red-700 text-[11px] font-medium leading-snug">Patient has abnormal BP/Sugar. Chemist will be notified to prioritize and review prescription.</p>
                            </div>
                        </div>
                    )}

                    <div className="p-8 bg-gray-900 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-black">Order Summary</h3>
                            <ShoppingBag className="text-emerald-400" size={24} />
                        </div>

                        <div className="space-y-4 mb-10">
                            <div className="flex justify-between text-xs text-gray-400 font-bold uppercase tracking-widest">
                                <span>Cart Subtotal</span>
                                <span className="text-white">₹{total}</span>
                            </div>
                            <div className="flex justify-between text-xs text-gray-400 font-bold uppercase tracking-widest">
                                <span>Emergency Priority</span>
                                <span className={isEmergency ? 'text-red-400' : 'text-emerald-400'}>
                                    {isEmergency ? '+ ₹50 Urgent Charge' : 'STANDARD'}
                                </span>
                            </div>
                            <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                                <span className="text-xl font-bold">Payable</span>
                                <span className="text-4xl font-black text-emerald-400">₹{total + (isEmergency ? 50 : 0)}</span>
                            </div>
                        </div>

                        <label className={`flex items-center gap-4 p-4 rounded-2xl mb-6 cursor-pointer border-2 transition-all ${isEmergency ? 'bg-red-900/40 border-red-500/50 shadow-lg shadow-red-900/50' : 'bg-white/5 border-white/10'}`}>
                            <input type="checkbox" className="hidden" checked={isEmergency} onChange={(e) => setIsEmergency(e.target.checked)} />
                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${isEmergency ? 'bg-red-500 text-white' : 'bg-white/10'}`}>
                                {isEmergency && <AlertCircle size={14} />}
                            </div>
                            <div>
                                <p className="text-xs font-black uppercase tracking-widest">Emergency Priority?</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase">Dispatch within 15 Minutes</p>
                            </div>
                        </label>

                        <button
                            onClick={handleConfirm}
                            disabled={submitting}
                            className="w-full bg-primary text-white py-6 rounded-[1.5rem] font-black text-xl hover:scale-105 transition-all flex items-center justify-center gap-4 shadow-2xl shadow-emerald-900/50"
                        >
                            {submitting ? 'Authenticating...' : <><CreditCard size={28} /> Final Confirmation</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const PaymentOption = ({ active, label, onClick, icon }) => (
    <button onClick={onClick} className={`flex-1 p-5 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${active ? 'bg-white border-primary shadow-lg shadow-emerald-50' : 'bg-gray-50 border-gray-100 grayscale opacity-40 hover:grayscale-0'}`}>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${active ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'}`}>
            {icon}
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-center">{label}</span>
    </button>
);

const ActiveOrders = () => {
    const [orders, setOrders] = useState([]);

    const [trackingOrder, setTrackingOrder] = useState(null);

    const handlePrintInvoice = (order) => {
        const printWindow = window.open('', '_blank');
        const itemsHtml = order.medicines.map(m => `
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${m.name}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${m.quantity || 1}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${m.price}</td>
            </tr>
        `).join('');

        printWindow.document.write(`
            <html>
                <head>
                    <title>Invoice #${order.orderId}</title>
                    <style>
                        body { font-family: 'Inter', sans-serif; color: #333; padding: 40px; }
                        .header { border-bottom: 2px solid #10b981; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-end; }
                        table { width: 100%; border-collapse: collapse; }
                        .footer { margin-top: 50px; font-size: 12px; color: #999; text-align: center; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <div>
                            <h1 style="color: #10b981; margin: 0;">MediLink+</h1>
                            <p style="margin: 5px 0 0 0;">Rural Health Distribution Network</p>
                        </div>
                        <div style="text-align: right;">
                            <h2 style="margin: 0;">INVOICE</h2>
                            <p style="margin: 5px 0 0 0;">ID: ${order.orderId}</p>
                        </div>
                    </div>
                    <div style="margin-bottom: 30px;">
                        <p><b>Date:</b> ${new Date(order.createdAt).toLocaleDateString()}</p>
                        <p><b>Patient:</b> ${order.patientDetails?.name || 'Kiosk Patient'}</p>
                    </div>
                    <table>
                        <thead>
                            <tr style="background: #f9f9f9;">
                                <th style="padding: 10px; text-align: left;">Medicine</th>
                                <th style="padding: 10px;">Qty</th>
                                <th style="padding: 10px; text-align: right;">Price</th>
                            </tr>
                        </thead>
                        <tbody>${itemsHtml}</tbody>
                        <tfoot>
                            <tr>
                                <td colspan="2" style="padding: 20px 10px; text-align: right;"><b>Grand Total</b></td>
                                <td style="padding: 20px 10px; text-align: right; color: #10b981; font-size: 20px;"><b>₹${order.totalAmount}</b></td>
                            </tr>
                        </tfoot>
                    </table>
                    <div class="footer">
                        <p>This is a computer-generated invoice from MediLink Kiosk Node.</p>
                        <p>Thank you for using our regional healthcare network.</p>
                    </div>
                    <script>window.print();</script>
                </body>
            </html>
        `);
        printWindow.document.close();
    };

    useEffect(() => {
        axios.get('http://localhost:5000/api/orders/kiosk').then(res => setOrders(res.data));
    }, []);

    return (
        <div>
            <div className="flex justify-between items-center mb-12">
                <div>
                    <h2 className="text-3xl font-black italic">Active Monitoring</h2>
                    <p className="text-gray-400 text-sm font-medium">Real-time status of village medical logs</p>
                </div>
                <button className="bg-gray-900 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase flex items-center gap-2">
                    <Download size={16} /> Bulk Invoice
                </button>
            </div>

            <div className="space-y-4">
                {orders.map((order, i) => (
                    <div key={i} className="group bg-white p-8 rounded-[3rem] border border-gray-100 hover:shadow-2xl hover:border-blue-50 transition-all flex flex-wrap items-center justify-between gap-6 cursor-pointer">
                        <div className="flex gap-6 items-center">
                            <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center text-white shadow-xl transition-transform group-hover:rotate-12 ${order.isEmergency ? 'bg-red-500' : 'bg-primary'}`}>
                                <ShoppingBag size={38} />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-2xl font-black text-gray-900 tracking-tighter">#{order.orderId}</h3>
                                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase ${order.status === 'delivered' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                                        {order.status}
                                    </span>
                                </div>
                                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                    <Clock size={12} /> Updated {new Date(order.updatedAt).toLocaleTimeString()}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-10">
                            <div className="text-right">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Fulfillment Node</p>
                                <p className="font-black text-gray-900 text-sm">Main City Pharma</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setTrackingOrder(order)}
                                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all shadow-sm ${order.status === 'out_for_delivery' ? 'bg-amber-400 text-white animate-pulse' : 'bg-gray-50 text-gray-400 opacity-50 cursor-not-allowed'}`}
                                    disabled={order.status !== 'out_for_delivery'}
                                >
                                    <MapPin size={20} />
                                </button>
                                <button
                                    onClick={() => handlePrintInvoice(order)}
                                    className="w-12 h-12 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm"
                                >
                                    <Download size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {orders.length === 0 && <div className="text-center py-40 italic text-gray-300 font-bold border-4 border-dashed border-gray-100 rounded-[4rem]">No history generated yet.</div>}
            </div>

            {/* GPS Tracking Modal */}
            {trackingOrder && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-6 animate-fadeIn">
                    <div className="bg-white w-full max-w-4xl rounded-[4rem] overflow-hidden shadow-2xl relative">
                        <button onClick={() => setTrackingOrder(null)} className="absolute top-10 right-10 z-10 p-5 bg-gray-100 rounded-[1.5rem] hover:bg-red-500 hover:text-white transition-all">
                            <X size={24} />
                        </button>

                        <div className="grid grid-cols-1 lg:grid-cols-2">
                            <div className="h-[500px] bg-blue-50 relative overflow-hidden">
                                {/* Simulated Moving Map */}
                                <svg className="w-full h-full p-20" viewBox="0 0 100 100">
                                    <path d="M 20 20 Q 50 10 80 80" fill="none" stroke="#ddd" strokeWidth="2" strokeDasharray="5 5" />
                                    <circle cx="20" cy="20" r="3" fill="#10b981" /> {/* Chemist */}
                                    <circle cx="80" cy="80" r="3" fill="#ef4444" /> {/* Kiosk */}

                                    <g className="animate-tracking-move">
                                        <circle r="4" fill="#3b82f6" className="animate-ping opacity-25" />
                                        <path d="M -2 -2 L 2 0 L -2 2 Z" fill="#3b82f6" transform="rotate(-45)" />
                                    </g>
                                </svg>
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/80 pointer-events-none"></div>
                                <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end">
                                    <div className="bg-white/90 p-4 rounded-2xl shadow-xl border border-white">
                                        <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Estimated Arrival</p>
                                        <p className="text-2xl font-black text-primary">12 Minutes</p>
                                    </div>
                                    <div className="bg-primary text-white p-4 rounded-2xl shadow-xl flex items-center gap-3">
                                        <Truck size={20} />
                                        <span className="font-black text-xs uppercase italic">In Transit</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-16 flex flex-col justify-center">
                                <h2 className="text-4xl font-black mb-2 tracking-tighter">Live Tracker</h2>
                                <p className="text-gray-400 font-medium mb-12 italic">Dispatched from {trackingOrder.chemist?.businessName || 'City Central Pharma'}</p>

                                <div className="space-y-8">
                                    <TrackingStep icon={<CheckCircle2 className="text-emerald-500" />} label="Order Dispatched" time="14:02 PM" done />
                                    <TrackingStep icon={<Truck className="text-blue-500" />} label="Picked by Delivery Partner" time="14:10 PM" done />
                                    <TrackingStep icon={<Activity className="text-gray-300" />} label="Out for Delivery" time="In Progress..." active />
                                    <TrackingStep icon={<MapPin className="text-gray-200" />} label="Delivered to Kiosk" time="ETA 14:27 PM" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const TrackingStep = ({ icon, label, time, done, active }) => (
    <div className={`flex items-center gap-6 ${!done && !active ? 'opacity-30' : ''}`}>
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${done ? 'bg-emerald-50' : active ? 'bg-blue-50 animate-pulse' : 'bg-gray-50'}`}>
            {icon}
        </div>
        <div>
            <p className={`font-black text-sm uppercase ${done ? 'text-emerald-600' : active ? 'text-blue-600' : 'text-gray-400'}`}>{label}</p>
            <p className="text-[10px] font-bold text-gray-400">{time}</p>
        </div>
    </div>
);

// PrescriptionUpload and MedicineSearch components remain as defined previously but within this file's scope
const PrescriptionUpload = () => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected) {
            setFile(selected);
            setPreview(URL.createObjectURL(selected));
        }
    };

    return (
        <div className="max-w-2xl mx-auto text-center space-y-10 py-10">
            <div className="w-32 h-32 bg-primary/5 text-primary rounded-[3rem] flex items-center justify-center mx-auto shadow-inner">
                <FileUp size={64} />
            </div>
            <div>
                <h2 className="text-4xl font-black mb-3">Health Scanner</h2>
                <p className="text-gray-400 font-medium">Auto-digitizing prescriptions for local fulfillment</p>
            </div>

            {!preview ? (
                <label className="block border-8 border-dashed border-gray-50 rounded-[4rem] p-24 hover:border-primary/20 transition-all cursor-pointer group bg-gray-50/20">
                    <input type="file" className="hidden" onChange={handleFileChange} accept="image/*,application/pdf" />
                    <div className="space-y-4">
                        <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center mx-auto text-gray-300 group-hover:text-primary shadow-xl transition-all">
                            <Plus size={40} />
                        </div>
                        <p className="text-xl font-black text-gray-400 group-hover:text-gray-600">Scan Prescriptions</p>
                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">Validated OCR Scanning</p>
                    </div>
                </label>
            ) : (
                <div className="space-y-10 animate-scaleUp">
                    <div className="group relative rounded-[4rem] overflow-hidden shadow-2xl border-[12px] border-gray-50 bg-white p-8">
                        <img src={preview} alt="Preview" className="w-full h-auto max-h-[500px] object-contain rounded-3xl" />
                        <button onClick={() => { setFile(null); setPreview(null); }} className="absolute top-12 right-12 p-5 bg-red-500 text-white rounded-[1.5rem] shadow-2xl hover:bg-black transition-all">
                            <X size={28} />
                        </button>
                    </div>
                    <button className="w-full bg-gray-900 text-white py-6 rounded-[2rem] font-black text-2xl hover:scale-[1.05] transition-all shadow-2xl">
                        Continue to Pharmacy Market
                    </button>
                </div>
            )}
        </div>
    );
};

const MedicineSearch = ({ addToCart }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

    useEffect(() => {
        const fetchMeds = async () => {
            if (!query) return setResults([]);
            try {
                const res = await axios.get(`http://localhost:5000/api/medicines?search=${query}`);
                setResults(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        const timer = setTimeout(fetchMeds, 300);
        return () => clearTimeout(timer);
    }, [query]);

    return (
        <div className="space-y-12">
            <div className="max-w-4xl">
                <h2 className="text-4xl font-black mb-4">Finding Medicine</h2>
                <div className="relative group">
                    <Search className="absolute left-10 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors" size={32} />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search generic names or pharmacy nodes..."
                        className="w-full pl-24 pr-12 py-9 bg-gray-50 border-none rounded-[3rem] focus:ring-8 focus:ring-primary/5 focus:bg-white text-2xl font-bold transition-all outline-none italic"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                {results.map((med, i) => (
                    <div key={i} className="group bg-white border border-gray-100 rounded-[3rem] p-10 hover:shadow-2xl hover:translate-y-[-12px] transition-all relative overflow-hidden flex flex-col justify-between">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-[4rem] flex items-center justify-center text-primary/20 group-hover:text-primary transition-colors">
                            <Package size={40} />
                        </div>

                        <div>
                            <div className="space-y-1 mb-8">
                                <h3 className="font-black text-3xl text-gray-900 tracking-tighter">{med.name}</h3>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{med.genericName}</p>
                            </div>

                            <div className="flex items-center gap-3 mb-10 pt-4 border-t border-gray-50">
                                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                                    <MapPin size={18} />
                                </div>
                                <div>
                                    <p className="text-[11px] font-black text-gray-900 leading-none">{med.chemist?.businessName || 'Verified Pharma'}</p>
                                    <div className="flex items-center gap-1 mt-1">
                                        <Star size={10} className="text-amber-400 fill-amber-400" />
                                        <span className="text-[9px] font-black text-emerald-600 uppercase tracking-tighter">Verified Node</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center bg-gray-950 p-6 rounded-[2rem] shadow-xl group-hover:scale-[1.05] transition-transform">
                            <span className="text-3xl font-black text-white">₹{med.price}</span>
                            <button
                                onClick={() => addToCart(med, med.chemist)}
                                className="bg-primary text-white w-14 h-14 rounded-2xl flex items-center justify-center hover:bg-emerald-600 shadow-2xl shadow-emerald-900/40 transition-all active:scale-95"
                            >
                                <Plus size={28} />
                            </button>
                        </div>
                    </div>
                ))}
                {query && results.length === 0 && (
                    <div className="col-span-full py-20 text-center text-gray-300 font-black text-4xl italic opacity-20">NO NODES MATCH.</div>
                )}
            </div>
        </div>
    );
};

const NetworkMap = () => {
    const [selectedChemist, setSelectedChemist] = useState(null);
    const [chemists, setChemists] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/api/users/chemists').then(res => setChemists(res.data));
    }, []);

    const mockLocations = [
        { x: 30, y: 40 }, { x: 70, y: 20 }, { x: 50, y: 70 }, { x: 15, y: 80 }
    ];

    return (
        <div className="h-full space-y-10">
            <div>
                <h2 className="text-4xl font-black mb-2">Regional Health Nodes</h2>
                <p className="text-gray-400 font-medium">Visualizing verified pharmacy distribution in your sector</p>
            </div>

            <div className="flex flex-col xl:flex-row gap-10">
                <div className="flex-1 bg-blue-50/30 rounded-[3rem] border-4 border-white shadow-inner relative overflow-hidden min-h-[500px]">
                    {/* SVG Interactive Map */}
                    <svg className="w-full h-full absolute inset-0" viewBox="0 0 100 100">
                        <defs>
                            <radialGradient id="mapGrad" cx="50%" cy="50%" r="50%">
                                <stop offset="0%" stopColor="#10b981" stopOpacity="0.05" />
                                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                            </radialGradient>
                        </defs>
                        <rect width="100" height="100" fill="url(#mapGrad)" />

                        {/* Grid Lines */}
                        {[...Array(10)].map((_, i) => (
                            <line key={i} x1={i * 10} y1="0" x2={i * 10} y2="100" stroke="#10b981" strokeOpacity="0.03" strokeWidth="0.1" />
                        ))}
                        {[...Array(10)].map((_, i) => (
                            <line key={i} x1="0" y1={i * 10} x2="100" y2={i * 10} stroke="#10b981" strokeOpacity="0.03" strokeWidth="0.1" />
                        ))}

                        {/* Chemist Nodes */}
                        {chemists.map((chem, i) => {
                            const pos = mockLocations[i % mockLocations.length];
                            return (
                                <g
                                    key={chem._id}
                                    className="cursor-pointer group"
                                    onClick={() => setSelectedChemist(chem)}
                                >
                                    <circle
                                        cx={pos.x} cy={pos.y} r="3"
                                        className={`transition-all duration-500 ${selectedChemist?._id === chem._id ? 'fill-primary scale-150' : 'fill-primary/20 group-hover:fill-primary/60'}`}
                                    />
                                    <circle
                                        cx={pos.x} cy={pos.y} r="6"
                                        className={`animate-ping transition-all ${selectedChemist?._id === chem._id ? 'stroke-primary' : 'stroke-transparent opacity-0'}`}
                                        strokeWidth="0.2" fill="none"
                                    />
                                </g>
                            );
                        })}

                        {/* Current Node (Kiosk) */}
                        <g>
                            <circle cx="50" cy="50" r="1.5" fill="#ef4444" />
                            <text x="50" y="55" fontSize="3" fontWeight="bold" fill="#ef4444" textAnchor="middle">Current Node</text>
                            <circle cx="50" cy="50" r="8" stroke="#ef4444" strokeWidth="0.1" fill="none" strokeDasharray="1 1" className="animate-spin-slow" />
                        </g>
                    </svg>

                    <div className="absolute top-8 left-8 bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-white">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-500 mb-2">
                            <MapPin size={10} className="text-primary" /> Operational Coverage
                        </div>
                        <p className="text-xl font-bold tracking-tighter">12.5 KM Radius</p>
                    </div>
                </div>

                <div className="w-full xl:w-96 space-y-6">
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest pl-2">Node Information</p>
                    {selectedChemist ? (
                        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl animate-scaleUp">
                            <div className="flex items-center justify-between mb-8">
                                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                                    <ShieldCheck size={32} />
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-1 justify-end">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={10} className={i < Math.floor(selectedChemist.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'} />
                                        ))}
                                    </div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">{selectedChemist.reviewCount} Reviews</p>
                                </div>
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 leading-tight mb-2">{selectedChemist.businessName}</h3>
                            <p className="text-sm font-medium text-gray-400 mb-6">{selectedChemist.location?.address || 'Verified Distribution Point'}</p>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="p-4 bg-gray-50 rounded-2xl text-center">
                                    <p className="text-[8px] font-black text-gray-400 uppercase mb-1">Response</p>
                                    <p className="text-xs font-black">FAST (15m)</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-2xl text-center">
                                    <p className="text-[8px] font-black text-gray-400 uppercase mb-1">Queue</p>
                                    <p className="text-xs font-black">2 PENDING</p>
                                </div>
                            </div>

                            <button onClick={() => { setActiveTab('search'); setSelectedChemist(null); }} className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black text-sm hover:bg-primary transition-all shadow-lg">
                                Browse Store
                            </button>
                        </div>
                    ) : (
                        <div className="bg-gray-50/50 p-10 rounded-[2.5rem] border-4 border-dashed border-gray-100 text-center flex flex-col items-center justify-center h-full">
                            <Activity size={48} className="text-gray-200 mb-4" />
                            <p className="text-gray-300 font-bold italic text-sm">Select a node on the map to view verification details.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default KioskDashboard;
