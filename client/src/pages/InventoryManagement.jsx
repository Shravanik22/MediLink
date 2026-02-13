import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Package, Plus, Search, Edit2, Trash2,
    AlertTriangle, Calendar, X, Check, Info, ShieldCheck
} from 'lucide-react';
import { format } from 'date-fns';

const InventoryManagement = () => {
    const [medicines, setMedicines] = useState([]);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '', genericName: '', price: '', stockQuantity: '',
        lowStockThreshold: 10, expiryDate: '', category: '',
        prescriptionRequired: false, supplierName: '', batchNumber: ''
    });

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/medicines/chemist');
            setMedicines(res.data.filter(m => !m.isDeleted));
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await axios.patch(`http://localhost:5000/api/medicines/${editingId}`, formData);
            } else {
                await axios.post('http://localhost:5000/api/medicines', formData);
            }
            closeModal();
            fetchInventory();
        } catch (err) {
            console.error(err);
        }
    };

    const toggleStockStatus = async (id, currentStatus) => {
        try {
            await axios.patch(`http://localhost:5000/api/medicines/${id}`, { isOutOfStock: !currentStatus });
            fetchInventory();
        } catch (err) {
            console.error(err);
        }
    };

    const softDelete = async (id) => {
        if (!window.confirm('Are you sure you want to remove this medicine? It will be permanently archived.')) return;
        try {
            await axios.patch(`http://localhost:5000/api/medicines/${id}`, { isDeleted: true });
            fetchInventory();
        } catch (err) {
            console.error(err);
        }
    };

    const openEdit = (med) => {
        setFormData({
            name: med.name,
            genericName: med.genericName,
            price: med.price,
            stockQuantity: med.stockQuantity,
            lowStockThreshold: med.lowStockThreshold || 10,
            expiryDate: med.expiryDate ? med.expiryDate.split('T')[0] : '',
            category: med.category || '',
            prescriptionRequired: med.prescriptionRequired || false,
            supplierName: med.supplierName || '',
            batchNumber: med.batchNumber || ''
        });
        setEditingId(med._id);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingId(null);
        setFormData({
            name: '', genericName: '', price: '', stockQuantity: '',
            lowStockThreshold: 10, expiryDate: '', category: '',
            prescriptionRequired: false, supplierName: '', batchNumber: ''
        });
    };

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 leading-tight">Pharma Inventory</h1>
                    <p className="text-gray-500 font-medium">Add, update, and monitor your medicine stock</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-primary text-white px-8 py-4 rounded-[2rem] font-bold flex items-center gap-2 shadow-xl shadow-emerald-100 hover:scale-105 transition-all"
                >
                    <Plus size={20} /> New Entry
                </button>
            </div>

            {/* Alert Panel */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-amber-50 border border-amber-100 p-6 rounded-[2rem] flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-amber-500 shadow-sm">
                        <AlertTriangle size={24} />
                    </div>
                    <div>
                        <p className="text-lg font-black text-amber-900">{medicines.filter(m => m.stockQuantity <= m.lowStockThreshold).length} Low Stock Items</p>
                        <p className="text-xs font-bold text-amber-700">Refill required soon</p>
                    </div>
                </div>
                <div className="bg-red-50 border border-red-100 p-6 rounded-[2rem] flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-red-500 shadow-sm">
                        <Calendar size={24} />
                    </div>
                    <div>
                        <p className="text-lg font-black text-red-900">3 Expiring batches</p>
                        <p className="text-xs font-bold text-red-700">Within next 30 days</p>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by brand or generic name..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-16 pr-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary outline-none text-sm transition-all"
                        />
                    </div>
                    <div className="flex gap-2">
                        <span className="bg-gray-50 px-4 py-2 rounded-xl text-xs font-bold text-gray-500 border border-gray-100">{medicines.length} Total</span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Product</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">In Stock</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Batch/Expiry</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Prescription</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {medicines.filter(m => m.name.toLowerCase().includes(search.toLowerCase()) || m.genericName.toLowerCase().includes(search.toLowerCase())).map(med => (
                                <tr key={med._id} className={`hover:bg-gray-50/50 transition-all ${med.isOutOfStock ? 'opacity-50 grayscale' : ''}`}>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-2 h-10 bg-primary/20 rounded-full"></div>
                                            <div>
                                                <p className="font-bold text-gray-900 leading-none mb-1">{med.name}</p>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{med.genericName}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <div className="inline-block px-4 py-1.5 bg-gray-50 rounded-xl border border-gray-100">
                                            <span className={`text-lg font-black ${med.stockQuantity <= med.lowStockThreshold ? 'text-red-600' : 'text-gray-900'}`}>{med.stockQuantity}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold text-gray-500 flex items-center gap-1.5"><Package size={12} className="text-gray-300" /> {med.batchNumber || 'N/A'}</p>
                                            <p className="text-xs font-bold text-emerald-600 flex items-center gap-1.5"><Calendar size={12} className="text-emerald-300" /> {med.expiryDate ? format(new Date(med.expiryDate), 'MMM yyyy') : 'No Expiry'}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        {med.prescriptionRequired ? (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase rounded-full border border-blue-100">
                                                <ShieldCheck size={12} /> Required
                                            </span>
                                        ) : (
                                            <span className="text-[10px] font-bold text-gray-300 uppercase">Not Required</span>
                                        )}
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex justify-end gap-3">
                                            <button onClick={() => toggleStockStatus(med._id, med.isOutOfStock)} className={`p-2 rounded-xl transition-all border ${med.isOutOfStock ? 'text-emerald-600 border-emerald-100 bg-emerald-50' : 'text-amber-600 border-amber-100 bg-amber-50'}`} title={med.isOutOfStock ? 'Mark In Stock' : 'Mark Out of Stock'}>
                                                <Check size={16} />
                                            </button>
                                            <button onClick={() => openEdit(med)} className="p-2 text-blue-600 border border-blue-100 bg-blue-50 rounded-xl transition-all hover:bg-blue-600 hover:text-white">
                                                <Edit2 size={16} />
                                            </button>
                                            <button onClick={() => softDelete(med._id)} className="p-2 text-red-600 border border-red-100 bg-red-50 rounded-xl transition-all hover:bg-red-600 hover:text-white">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden animate-slideUp">
                        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <div>
                                <h2 className="text-2xl font-black text-gray-900">{editingId ? 'Refine Product' : 'Add New Medicine'}</h2>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Inventory Management Terminal</p>
                            </div>
                            <button onClick={closeModal} className="p-3 bg-white text-gray-400 hover:text-gray-900 rounded-2xl shadow-sm border border-gray-100 transition-all">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSave} className="p-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
                                <Input label="Brand Name" value={formData.name} onChange={(val) => setFormData({ ...formData, name: val })} placeholder="e.g. Panadol" required />
                                <Input label="Generic Name" value={formData.genericName} onChange={(val) => setFormData({ ...formData, genericName: val })} placeholder="e.g. Paracetamol" required />
                                <Input label="Category" value={formData.category} onChange={(val) => setFormData({ ...formData, category: val })} placeholder="e.g. Analgesic" />

                                <Input label="Price (₹)" type="number" value={formData.price} onChange={(val) => setFormData({ ...formData, price: val })} placeholder="0.00" required />
                                <Input label="Initial Stock" type="number" value={formData.stockQuantity} onChange={(val) => setFormData({ ...formData, stockQuantity: val })} placeholder="0" required />
                                <Input label="Low Stock Alert" type="number" value={formData.lowStockThreshold} onChange={(val) => setFormData({ ...formData, lowStockThreshold: val })} placeholder="10" />

                                <Input label="Batch Number" value={formData.batchNumber} onChange={(val) => setFormData({ ...formData, batchNumber: val })} placeholder="BTCH-829" />
                                <Input label="Expiry Date" type="date" value={formData.expiryDate} onChange={(val) => setFormData({ ...formData, expiryDate: val })} required />
                                <Input label="Supplier" value={formData.supplierName} onChange={(val) => setFormData({ ...formData, supplierName: val })} placeholder="Distributor Name" />
                            </div>

                            <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-gray-50">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${formData.prescriptionRequired ? 'bg-primary border-primary text-white blur-0' : 'bg-gray-100 border-gray-200'}`}>
                                        {formData.prescriptionRequired && <Check size={14} />}
                                    </div>
                                    <input type="checkbox" className="hidden" checked={formData.prescriptionRequired} onChange={(e) => setFormData({ ...formData, prescriptionRequired: e.target.checked })} />
                                    <span className="text-sm font-bold text-gray-600 group-hover:text-primary transition-colors">Prescription Required?</span>
                                </label>

                                <div className="flex gap-4 w-full md:w-auto">
                                    <button type="button" onClick={closeModal} className="px-8 py-4 text-gray-400 font-bold hover:text-gray-600 transition-all text-sm">Discard Changes</button>
                                    <button type="submit" className="flex-1 md:flex-none bg-primary text-white px-10 py-4 rounded-2xl font-bold shadow-lg shadow-emerald-100 hover:scale-105 transition-all">
                                        {editingId ? 'Save Updates' : 'Confirm Entry'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const Input = ({ label, value, onChange, placeholder, type = "text", required = false }) => (
    <div className="space-y-1.5">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{label} {required && '*'}</label>
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            className="w-full bg-gray-50/50 border border-gray-100 px-5 py-3.5 rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary outline-none text-sm transition-all"
        />
    </div>
);

export default InventoryManagement;
