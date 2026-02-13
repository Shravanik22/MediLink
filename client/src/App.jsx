import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import KioskDashboard from './pages/KioskDashboard';
import ChemistDashboard from './pages/ChemistDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ComplaintDashboard from './pages/ComplaintDashboard';
import InventoryManagement from './pages/InventoryManagement';
import PaymentStatus from './pages/PaymentStatus';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/payment-status" element={<ProtectedRoute><PaymentStatus /></ProtectedRoute>} />

                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            {user?.role === 'kiosk' && <KioskDashboard />}
                            {user?.role === 'chemist' && <ChemistDashboard />}
                            {user?.role === 'admin' && <AdminDashboard />}
                        </ProtectedRoute>
                    } />

                    <Route path="/complaints" element={
                        <ProtectedRoute>
                            <ComplaintDashboard />
                        </ProtectedRoute>
                    } />

                    <Route path="/inventory" element={
                        <ProtectedRoute>
                            <InventoryManagement />
                        </ProtectedRoute>
                    } />

                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </main>
        </div>
    );
}

export default App;
