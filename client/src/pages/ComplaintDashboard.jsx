import { useState, useEffect } from 'react';
import axios from 'axios';
import { MessageSquare, Clock, CheckCircle2, AlertCircle, User } from 'lucide-react';
import { format } from 'date-fns';

const ComplaintDashboard = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/complaints');
            setComplaints(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const resolveTicket = async (id) => {
        const resolution = prompt('Enter resolution details:');
        if (!resolution) return;

        try {
            await axios.patch(`http://localhost:5000/api/complaints/${id}/resolve`, {
                resolution,
                status: 'resolved'
            });
            fetchComplaints();
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading support tickets...</div>;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-gray-900">Support Terminal</h1>
                    <p className="text-gray-500 font-medium">Manage and resolve system-wide complaints</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {complaints.map(ticket => (
                    <div key={ticket._id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-wrap justify-between items-start gap-4">
                        <div className="flex gap-4 min-w-[300px] flex-1">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${ticket.status === 'resolved' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                <MessageSquare size={24} />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-lg font-bold text-gray-900">{ticket.title}</h3>
                                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${ticket.priority === 'high' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                                        {ticket.priority} Priority
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">{ticket.description}</p>
                                <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                    <span className="flex items-center gap-1"><User size={12} /> {ticket.user.name}</span>
                                    <span className="flex items-center gap-1"><Clock size={12} /> {format(new Date(ticket.createdAt), 'MMM dd, yyyy')}</span>
                                    {ticket.order && <span className="bg-blue-50 text-blue-600 px-2 rounded-lg">Order: {ticket.order.orderId}</span>}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {ticket.status === 'open' ? (
                                <button onClick={() => resolveTicket(ticket._id)} className="bg-primary text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-600 transition-all text-sm">
                                    <CheckCircle2 size={16} /> Mark Resolved
                                </button>
                            ) : (
                                <div className="text-right">
                                    <span className="text-emerald-600 font-black text-xs uppercase flex items-center gap-1 justify-end"><CheckCircle2 size={14} /> Resolved</span>
                                    <p className="text-[10px] text-gray-400 max-w-[200px] truncate">{ticket.resolution}</p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {complaints.length === 0 && <div className="p-20 text-center text-gray-400 italic bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">No active complaints.</div>}
            </div>
        </div>
    );
};

export default ComplaintDashboard;
