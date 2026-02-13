import { Link } from 'react-router-dom';
import { Shield, Activity, Truck, Lock, ChevronRight } from 'lucide-react';

const Landing = () => {
    return (
        <div className="bg-white">
            {/* Hero Section */}
            <section className="relative overflow-hidden pt-16 pb-32">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap items-center">
                        <div className="w-full lg:w-1/2 mb-12 lg:mb-0">
                            <span className="inline-block py-1 px-3 mb-4 text-xs font-semibold text-primary bg-emerald-50 rounded-full">New Rural Health Initiative</span>
                            <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 leading-tight mb-6">
                                Bridging the Gap in <span className="text-primary">Rural Healthcare.</span>
                            </h1>
                            <p className="text-xl text-gray-600 mb-10 max-w-lg">
                                MediLink+ connects village kiosks to certified chemists, ensuring medicine delivery and health wellbeing for everyone.
                            </p>
                            <div className="flex gap-4">
                                <Link to="/register" className="bg-primary text-white px-8 py-4 rounded-2xl font-bold hover:bg-emerald-600 transition-all flex items-center gap-2">
                                    Get Started <ChevronRight size={20} />
                                </Link>
                                <Link to="/login" className="border-2 border-gray-100 px-8 py-4 rounded-2xl font-bold hover:bg-gray-50 transition-all">
                                    Sign In
                                </Link>
                            </div>
                        </div>
                        <div className="w-full lg:w-1/2">
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl animate-float">
                                <img src="https://images.unsplash.com/photo-1576091160550-217359f4ecf8?auto=format&fit=crop&w=800&q=80" alt="Rural Health" className="w-full h-auto" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-gray-50">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl font-bold mb-16 text-gray-900">System Modules</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <FeatureCard
                            icon={<Shield className="text-primary" size={32} />}
                            title="Kiosk Management"
                            description="Digital prescription uploads and patient details entry."
                        />
                        <FeatureCard
                            icon={<Truck className="text-secondary" size={32} />}
                            title="Chemist Network"
                            description="Verify prescriptions and manage medicine stock."
                        />
                        <FeatureCard
                            icon={<Activity className="text-accent" size={32} />}
                            title="Wellbeing Integration"
                            description="Track BMI and health trends for village patients."
                        />
                        <FeatureCard
                            icon={<Lock className="text-red-500" size={32} />}
                            title="Role-Based Auth"
                            description="Secure access for Admin, Chemist, and Kiosk roles."
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }) => (
    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition-all">
        <div className="mb-6 flex justify-center">{icon}</div>
        <h3 className="text-xl font-bold mb-4">{title}</h3>
        <p className="text-gray-600">{description}</p>
    </div>
);

export default Landing;
