import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, IndianRupee, FileText, ArrowLeft } from 'lucide-react';
import axios from 'axios';

const PaymentStatus = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { orderId, amount, success, transactionId } = location.state || {};

    return (
        <div className="max-w-xl mx-auto py-20 px-4">
            <div className={`bg-white rounded-[40px] shadow-2xl p-12 text-center border-t-[12px] ${success ? 'border-emerald-500' : 'border-red-500'}`}>
                <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-10 ${success ? 'bg-emerald-50 text-emerald-500' : 'bg-red-50 text-red-500'}`}>
                    {success ? <CheckCircle size={60} /> : <AlertCircle size={60} />}
                </div>

                <h1 className="text-4xl font-black text-gray-900 mb-2">
                    {success ? 'Payment Successful!' : 'Payment Failed'}
                </h1>
                <p className="text-gray-500 font-medium mb-12">
                    {success ? 'Your medicine request has been sent to the nearest chemist.' : 'Something went wrong with your transaction. Please try again.'}
                </p>

                <div className="bg-gray-50 rounded-3xl p-8 space-y-4 mb-10">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400 font-bold uppercase tracking-widest">Order ID</span>
                        <span className="text-gray-900 font-black">#{orderId}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400 font-bold uppercase tracking-widest">Amount Paid</span>
                        <span className="text-emerald-600 font-black flex items-center gap-1"><IndianRupee size={14} /> {amount}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400 font-bold uppercase tracking-widest">Ref Number</span>
                        <span className="text-gray-900 font-black">{transactionId}</span>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <button onClick={() => navigate('/dashboard')} className="w-full bg-gray-900 text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all">
                        <FileText size={20} /> View Order Invoice
                    </button>
                    <button onClick={() => navigate('/dashboard')} className="w-full text-gray-400 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:text-gray-900 transition-all text-sm">
                        <ArrowLeft size={16} /> Return to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentStatus;
