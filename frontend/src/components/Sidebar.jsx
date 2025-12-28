import { Link, useNavigate, useLocation } from 'react-router-dom';

const Sidebar = ({ user, logout, isOpen, onClose }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path ? 'bg-primary/10 border-primary/20 text-primary' : 'hover:bg-[#29382d] text-text-secondary hover:text-white border-transparent';
    };

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={`fixed inset-0 bg-black/50 z-30 lg:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* Sidebar Container */}
            <aside
                className={`
          fixed lg:static inset-y-0 left-0 z-40 w-72 flex-col bg-surface-darker border-r border-[#29382d] h-full flex-shrink-0 transition-transform duration-300 transform
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
            >
                <div className="p-6">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="bg-primary/20 aspect-square rounded-full size-10 flex items-center justify-center text-primary">
                                <span className="material-symbols-outlined">savings</span>
                            </div>
                            <div className="flex flex-col">
                                <h1 className="text-white text-lg font-bold leading-none">InvestmentCo</h1>
                                <p className="text-text-secondary text-xs mt-1 font-medium">User Dashboard</p>
                            </div>
                        </div>
                        {/* Mobile Close Button */}
                        <button onClick={onClose} className="lg:hidden text-text-secondary hover:text-white">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                </div>
                <nav className="flex-1 overflow-y-auto px-4 space-y-2 py-4">
                    <Link to="/dashboard" className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${isActive('/dashboard')}`}>
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
                        <span className="text-sm font-bold">Dashboard</span>
                    </Link>
                    <Link to="/investments" className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${isActive('/investments')}`}>
                        <span className="material-symbols-outlined">trending_up</span>
                        <span className="text-sm font-medium">Investments</span>
                    </Link>
                    <Link to="/referral" className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${isActive('/referral')}`}>
                        <span className="material-symbols-outlined">hub</span>
                        <span className="text-sm font-medium">Referral Tree</span>
                    </Link>
                    <Link to="/wallet" className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${isActive('/wallet')}`}>
                        <span className="material-symbols-outlined">wallet</span>
                        <span className="text-sm font-medium">Wallet</span>
                    <div className="pt-4 pb-2 px-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                        {/* Network */}
                    </div>
                    </Link>
                    <div className="pt-10 pb-2 px-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                        System
                    </div>
                    <Link to="/settings" className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${isActive('/settings')}`}>
                        <span className="material-symbols-outlined">settings</span>
                        <span className="text-sm font-medium">Settings</span>
                    </Link>
                    <button
                        onClick={() => { logout(); navigate('/login'); }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#29382d] text-text-secondary hover:text-white transition-all"
                    >
                        <span className="material-symbols-outlined">logout</span>
                        <span className="text-sm font-medium">Log Out</span>
                    </button>
                </nav>
                <div className="p-4 border-t border-[#29382d]">
                    <div className="bg-[#1c2920] rounded-xl p-4 flex items-center gap-3">
                        <div
                            className="size-10 rounded-full bg-cover bg-center shrink-0"
                            style={{ backgroundImage: 'url("https://api.dicebear.com/7.x/avataaars/svg?seed=' + (user?.username || 'User') + '")' }}
                        ></div>
                        <div className="flex flex-col min-w-0">
                            <p className="text-white text-sm font-bold truncate">{user?.username || 'User'}</p>
                            <p className="text-primary text-xs truncate">Premium Investor</p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
