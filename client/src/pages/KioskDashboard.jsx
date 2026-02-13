import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard, FileUp, Search, Activity,
    TrendingUp, AlertCircle, ShoppingBag,
    Star, MapPin, Truck, ChevronRight, X, Minus, Plus, CreditCard
} from 'lucide-react';

import WellbeingTracker from '../components/WellbeingTracker';

const KioskDashboard = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('orders');
    const [cart, setCart] = useState([]);

    const addToCart = (medicine, chemist) => {
        const item = { ...medicine, chemistName: chemist.businessName, chemistId: chemist._id };
        setCart([...cart, item]);
    };

    const removeFromCart = (id) => {
        setCart(cart.filter((_, i) => i !== id));
    };

    return (
        <div className="flex flex-col lg:flex-row gap-10 pb-20">
            {/* Sidebar */}
            <aside className="w-full lg:w-72 space-y-3">
                <NavButton active={activeTab === 'orders'} icon={<LayoutDashboard size={22} />} label="Patient Orders" onClick={() => setActiveTab('orders')} />
                <NavButton active={activeTab === 'search'} icon={<Search size={22} />} label="Find Medicine" onClick={() => setActiveTab('search')} />
                <NavButton active={activeTab === 'prescription'} icon={<FileUp size={22} />} label="Scan Prescription" onClick={() => setActiveTab('prescription')} />

                <div className="pt-8 pb-3 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-5">Vitals & Care</div>
                <NavButton active={activeTab === 'wellbeing'} icon={<Activity size={22} />} label="Biometric Status" onClick={() => setActiveTab('wellbeing')} />

                {cart.length > 0 && (
                    <div className="mt-8 p-6 bg-gray-900 rounded-[2rem] text-white shadow-2xl">
                        <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3">Your Selection</p>
                        <div className="space-y-3 max-h-40 overflow-y-auto mb-6 pr-2">
                            {cart.map((item, i) => (
                                <div key={i} className="flex justify-between items-center text-sm">
                                    <span className="truncate flex-1 pr-2 font-medium">{item.name}</span>
                                    <button onClick={() => removeFromCart(i)} className="text-red-400 p-1 hover:bg-gray-800 rounded-lg">
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => setActiveTab('checkout')} className="w-full bg-primary py-3 rounded-2xl font-bold text-sm hover:bg-emerald-600 transition-all">
                            Finalize Order ({cart.length})
                        </button>
                    </div>
                )}
            </aside>

            {/* Main Content */}
            <div className="flex-1 bg-white rounded-[3rem] shadow-xl p-10 border border-gray-100 min-h-[700px]">
                {activeTab === 'orders' && <ActiveOrders />}
                {activeTab === 'prescription' && <PrescriptionUpload />}
                {activeTab === 'search' && <MedicineSearch addToCart={addToCart} />}
                {activeTab === 'wellbeing' && <WellbeingTracker />}
                {activeTab === 'checkout' && <Checkout cart={cart} clearCart={() => setCart([])} onComplete={() => setActiveTab('orders')} />}
            </div>
        </div>
    );
};

const NavButton = ({ active, icon, label, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-4 px-6 py-4 rounded-3xl font-bold transition-all ${active ? 'bg-gray-900 text-white shadow-2xl scale-[1.02]' : 'text-gray-500 hover:bg-gray-100'
            }`}
    >
        {icon} <span className="text-sm">{label}</span>
    </button>
);

const Checkout = ({ cart, clearCart, onComplete }) => {
    const [submitting, setSubmitting] = useState(false);
    const total = cart.reduce((acc, curr) => acc + (curr.price || 0), 0);

    const handleConfirm = async () => {
        setSubmitting(true);
        // Mocking order creation loop for each chemist
        setTimeout(() => {
            clearCart();
            setSubmitting(false);
            onComplete();
            alert('Orders placed successfully!');
        }, 1500);
    };

    return (
        <div className="max-w-2xl mx-auto py-6">
            <h2 className="text-3xl font-black mb-8">Confirm Medication Request</h2>
            <div className="space-y-4 mb-10">
                {cart.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm">
                                <Package size={24} />
                            </div>
                            <div>
                                <p className="font-bold text-gray-900">{item.name}</p>
                                <p className="text-xs text-gray-400 font-bold uppercase">Seller: {item.chemistName}</p>
                            </div>
                        </div>
                        <p className="font-black text-gray-900 text-lg">₹{item.price}</p>
                    </div>
                ))}
            </div>

            <div className="p-8 bg-gray-900 rounded-[2.5rem] text-white space-y-6">
                <div className="flex justify-between items-center text-gray-400 font-bold uppercase tracking-widest text-xs">
                    <span>Subtotal</span>
                    <span className="text-white">₹{total}</span>
                </div>
                <div className="flex justify-between items-center text-gray-400 font-bold uppercase tracking-widest text-xs">
                    <span>Delivery (Rural Service)</span>
                    <span className="text-emerald-400">FREE</span>
                </div>
                <div className="pt-6 border-t border-gray-800 flex justify-between items-center">
                    <span className="text-xl font-bold">Total Amount</span>
                    <span className="text-3xl font-black text-emerald-400">₹{total}</span>
                </div>
                <button
                    onClick={handleConfirm}
                    disabled={submitting}
                    className="w-full bg-primary text-white py-5 rounded-2xl font-black text-lg hover:bg-emerald-600 transition-all flex items-center justify-center gap-3 mt-4"
                >
                    {submitting ? 'Processing...' : <><CreditCard size={24} /> Place Orders Now</>}
                </button>
            </div>
        </div>
    );
};

const ActiveOrders = () => (
    <div>
        <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-black">History & Tracking</h2>
            <div className="flex gap-2">
                <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black uppercase">2 Moving</span>
            </div>
        </div>
        <div className="space-y-4">
            {[1, 2].map(i => (
                <div key={i} className="flex flex-wrap items-center justify-between p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 group hover:bg-white hover:shadow-xl transition-all cursor-pointer">
                    <div className="flex gap-6 items-center">
                        <div className="w-16 h-16 bg-white text-primary rounded-[1.5rem] flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                            <Truck size={32} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <p className="font-black text-xl text-gray-900">Order #ORD-92837</p>
                                <span className="bg-amber-100 text-amber-700 text-[10px] font-black px-2 py-0.5 rounded-lg uppercase italic">Transit</span>
                            </div>
                            <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">En route to: Village Center #4</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-8">
                        <div className="text-right">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Est. Arrival</p>
                            <p className="font-black text-gray-900">Today, 4:00 PM</p>
                        </div>
                        <ChevronRight className="text-gray-300 group-hover:text-primary transition-colors" size={32} />
                    </div>
                </div>
            ))}
        </div>
    </div>
);

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
        <div className="max-w-2xl mx-auto text-center space-y-10">
            <div className="w-24 h-24 bg-emerald-50 text-primary rounded-full flex items-center justify-center mx-auto shadow-inner shadow-emerald-100/50">
                <FileUp size={48} />
            </div>
            <div>
                <h2 className="text-4xl font-black mb-3">Health Scanner</h2>
                <p className="text-gray-500 font-medium">Digitalizing prescriptions for rapid fulfillment</p>
            </div>

            {!preview ? (
                <label className="block border-4 border-dashed border-gray-100 rounded-[3rem] p-20 hover:border-primary transition-all cursor-pointer group bg-gray-50/50">
                    <input type="file" className="hidden" onChange={handleFileChange} accept="image/*,application/pdf" />
                    <div className="space-y-4">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto text-gray-300 group-hover:text-primary shadow-sm transition-colors">
                            <Plus size={32} />
                        </div>
                        <p className="text-lg font-bold text-gray-400 group-hover:text-gray-600 transition-colors">Tap to scan or select file</p>
                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Max 10MB (PDF, PNG, JPG)</p>
                    </div>
                </label>
            ) : (
                <div className="space-y-8 animate-fadeIn">
                    <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white bg-white">
                        <img src={preview} alt="Preview" className="w-full h-auto max-h-[400px] object-contain px-4 py-8" />
                        <button onClick={() => { setFile(null); setPreview(null); }} className="absolute top-6 right-6 p-4 bg-gray-900/10 backdrop-blur-md text-white rounded-2xl hover:bg-gray-900/30 transition-all">
                            <X size={24} />
                        </button>
                    </div>
                    <button className="w-full bg-gray-900 text-white py-5 rounded-[2rem] font-black text-xl hover:scale-[1.02] transition-all shadow-2xl shadow-gray-200">
                        Confirm & Digitize Prescription
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
        fetchMeds();
    }, [query]);

    return (
        <div className="space-y-10">
            <div className="relative group">
                <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors" size={28} />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by brand name, formula, or chemist..."
                    className="w-full pl-20 pr-10 py-7 bg-gray-50 border-none rounded-[2.5rem] focus:ring-4 focus:ring-primary/10 focus:bg-white text-xl font-bold transition-all outline-none"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {results.map((med, i) => (
                    <MedicineCard key={i} med={med} onAdd={() => addToCart(med, med.chemist)} />
                ))}
                {query && results.length === 0 && (
                    <div className="col-span-full py-20 text-center text-gray-400 italic">No medicine matches your search criteria.</div>
                )}
            </div>
        </div>
    );
};

const MedicineCard = ({ med, onAdd }) => (
    <div className="group bg-white border border-gray-100 rounded-[2.5rem] p-8 hover:shadow-2xl hover:translate-y-[-8px] transition-all relative overflow-hidden">
        <div className="flex items-start justify-between mb-8">
            <div className="space-y-1">
                <h3 className="font-black text-2xl text-gray-900 leading-none">{med.name}</h3>
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{med.genericName}</p>
            </div>
            <div className="bg-emerald-50 text-primary p-2 rounded-xl">
                <Package size={20} />
            </div>
        </div>

        <div className="space-y-4 mb-8">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                    <MapPin size={14} />
                </div>
                <div>
                    <p className="text-xs font-bold text-gray-900 leading-none">{med.chemist?.businessName || 'Local Chemist'}</p>
                    <div className="flex items-center gap-1 mt-1">
                        <Star size={10} className="text-amber-400 fill-amber-400" />
                        <span className="text-[10px] font-black text-gray-400">4.8 (Verified)</span>
                    </div>
                </div>
            </div>
        </div>

        <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl">
            <span className="text-2xl font-black text-gray-900">₹{med.price}</span>
            <button
                onClick={onAdd}
                className="bg-primary text-white w-12 h-12 rounded-xl flex items-center justify-center hover:bg-emerald-600 shadow-lg shadow-emerald-100 group-hover:scale-110 transition-all"
            >
                <Plus size={20} />
            </button>
        </div>
    </div>
);

export default KioskDashboard;
