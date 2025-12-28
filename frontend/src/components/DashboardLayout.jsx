import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import axios from 'axios';

const DashboardLayout = () => {
    const { user, logout } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();

    // Function to simulate passing time (moved from Dashboard.jsx)
    const handleSimulate = async () => {
        if (!confirm('Simulate 1 Day Passing?')) return;
        try {
            await axios.post('/api/dashboard/simulate-roi');
            alert('Simulation complete! Page will reload.');
            window.location.reload();
        } catch (e) {
            alert(e.message);
        }
    };

    return (
        <div className="flex h-screen w-full overflow-hidden bg-background-dark text-white font-display antialiased">
            <Sidebar
                user={user}
                logout={logout}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            {/* Main Content Wrapper */}
            <main className="flex-1 flex flex-col h-full overflow-hidden relative">

                {/* Top Header */}
                <header className="h-16 flex items-center justify-between px-6 lg:px-10 border-b border-[#29382d] bg-surface-darker/80 backdrop-blur-md sticky top-0 z-20">
                    <div className="flex items-center gap-4 lg:hidden">
                        <button
                            className="text-white hover:text-primary transition-colors"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                        <span className="font-bold text-white">InvestmentCo</span>
                    </div>

                    <div className="hidden lg:flex items-center text-text-secondary text-sm">
                        <span className="material-symbols-outlined mr-2 text-lg">calendar_today</span>
                        <span>{new Date().toLocaleDateString()}</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleSimulate}
                            className="size-10 flex items-center justify-center rounded-lg hover:bg-[#29382d] text-yellow-500 transition-colors"
                            title="Simulate 1 Day"
                        >
                            <span className="material-symbols-outlined">bolt</span>
                        </button>
                        <button className="size-10 flex items-center justify-center rounded-lg hover:bg-[#29382d] text-white transition-colors relative">
                            <span className="absolute top-2.5 right-2.5 size-2 bg-red-500 rounded-full border border-[#111813]"></span>
                            <span className="material-symbols-outlined">notifications</span>
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto p-6 lg:p-10 scroll-smooth">
                    <Outlet />
                </div>

            </main>
        </div>
    );
};

export default DashboardLayout;
