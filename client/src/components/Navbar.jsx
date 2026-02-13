import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Activity, ShieldCheck, PieChart, MessageSquare, Package } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white border-b border-gray-100 py-4 px-8 sticky top-0 z-50 backdrop-blur-md bg-white/80">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="bg-primary p-2 rounded-xl text-white group-hover:scale-110 transition-transform">
                        <ShieldCheck size={24} />
                    </div>
                    <span className="text-2xl font-black text-gray-900 tracking-tight">MediLink<span className="text-primary">+</span></span>
                </Link>

                <div className="flex items-center gap-8">
                    {user && (
                        <div className="hidden md:flex items-center gap-6">
                            <Link to="/dashboard" className="text-sm font-bold text-gray-500 hover:text-primary transition-all">Overview</Link>
                            {user.role === 'admin' && (
                                <>
                                    <Link to="/dashboard" className="text-sm font-bold text-gray-500 hover:text-primary flex items-center gap-1 transition-all"><PieChart size={14} /> Analytics</Link>
                                    <Link to="/complaints" className="text-sm font-bold text-gray-500 hover:text-primary flex items-center gap-1 transition-all"><MessageSquare size={14} /> Tickets</Link>
                                </>
                            )}
                            {user.role === 'chemist' && (
                                <Link to="/inventory" className="text-sm font-bold text-gray-500 hover:text-primary flex items-center gap-1 transition-all"><Package size={14} /> Inventory</Link>
                            )}
                        </div>
                    )}

                    <div className="flex items-center gap-6">
                        {user ? (
                            <>
                                <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100">
                                    <div className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                                        <User size={18} />
                                    </div>
                                    <div className="hidden sm:block">
                                        <p className="text-xs font-black text-gray-900 leading-none">{user.name}</p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{user.role}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="p-3 bg-red-50 text-red-600 rounded-2xl hover:bg-red-100 transition-all flex items-center gap-2 font-bold text-sm"
                                >
                                    <LogOut size={18} />
                                    <span className="hidden md:inline">Sign Out</span>
                                </button>
                            </>
                        ) : (
                            <div className="flex gap-4">
                                <Link to="/login" className="text-gray-500 font-bold hover:text-primary transition-all">Sign In</Link>
                                <Link to="/register" className="bg-primary text-white px-6 py-2 rounded-xl font-bold hover:bg-emerald-600 transition-all shadow-md shadow-emerald-100">Join Now</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
