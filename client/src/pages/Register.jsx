import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, ArrowRight, ShieldCheck, UserCircle, Store, Settings } from 'lucide-react';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState('kiosk');
    const [businessName, setBusinessName] = useState('');
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register({ name, email, password, role, businessName });
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="max-w-2xl w-full">
                <div className="text-center mb-8">
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-2">Create Account</h2>
                    <p className="text-gray-600">Join the MediLink+ Integrated Network</p>
                </div>

                <div className="bg-white rounded-3xl shadow-xl p-10 border border-gray-100">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-medium">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <input
                                        type="text"
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                        placeholder="John Doe"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <input
                                        type="email"
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                        placeholder="your@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <input
                                        type="password"
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        minLength={6}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Business/Kiosk Name</label>
                                <div className="relative">
                                    <Store className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <input
                                        type="text"
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                        placeholder="Village Health Kiosk"
                                        value={businessName}
                                        onChange={(e) => setBusinessName(e.target.value)}
                                        required={role !== 'admin'}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-4 ml-1">Register As</label>
                            <div className="grid grid-cols-3 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setRole('kiosk')}
                                    className={`flex flex-col items-center p-4 rounded-2xl border-2 transition-all ${role === 'kiosk' ? 'border-primary bg-emerald-50 text-primary' : 'border-gray-100 text-gray-500 hover:bg-gray-50'}`}
                                >
                                    <UserCircle size={32} className="mb-2" />
                                    <span className="font-bold text-sm">Kiosk</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole('chemist')}
                                    className={`flex flex-col items-center p-4 rounded-2xl border-2 transition-all ${role === 'chemist' ? 'border-primary bg-emerald-50 text-primary' : 'border-gray-100 text-gray-500 hover:bg-gray-50'}`}
                                >
                                    <Store size={32} className="mb-2" />
                                    <span className="font-bold text-sm">Chemist</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole('admin')}
                                    className={`flex flex-col items-center p-4 rounded-2xl border-2 transition-all ${role === 'admin' ? 'border-primary bg-emerald-50 text-primary' : 'border-gray-100 text-gray-500 hover:bg-gray-50'}`}
                                >
                                    <Settings size={32} className="mb-2" />
                                    <span className="font-bold text-sm">Admin</span>
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg hover:bg-emerald-600 transition-all shadow-lg flex items-center justify-center gap-2 group"
                        >
                            Sign Up
                            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-gray-500">
                            Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Log in</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
