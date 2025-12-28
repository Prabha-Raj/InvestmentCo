import { useState, useEffect } from 'react';
import axios from 'axios';
import StatsCard from '../components/StatsCard';
import { useAuth } from '../context/AuthContext';

const Wallet = () => {
    const { user } = useAuth();
    const [data, setData] = useState(null);

    useEffect(() => {
        // Fetch dashboard data to get wallet stats
        axios.get('/api/dashboard').then(res => setData(res.data)).catch(console.error);
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-black text-white tracking-tight">My Wallet</h2>
                <p className="text-text-secondary">Overview of your earnings and balance.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                <StatsCard
                    title="Total Investment"
                    value={`₹${data?.totalInvestments?.toFixed(2) || '0.00'}`}
                    type="primary"
                    icon="monetization_on"
                    trend="+5.2%"
                />
                <StatsCard
                    title="Daily ROI"
                    value={`₹${data?.dailyROI?.toFixed(2) || '0.00'}`}
                    type="blue"
                    icon="percent"
                    trend="Stable"
                />
                <StatsCard
                    title="Level Income"
                    value={`₹${data?.levelIncome?.toFixed(2) || '0.00'}`}
                    type="purple"
                    icon="group_add"
                    trend="Lifetime"
                />
                <StatsCard
                    title="Wallet Balance"
                    value={`₹${data?.balance?.toFixed(2) || '0.00'}`}
                    type="white"
                    icon="account_balance_wallet"
                    trend="+2.1%"
                />
            </div>

            {/* Withdrawal Section Placeholder */}
            {/* <div className="bg-surface-dark border border-[#29382d] rounded-xl p-6">
                <h3 className="text-white font-bold text-lg mb-4">Quick Actions</h3>
                <div className="flex gap-4">
                    <button className=" bg-primary text-[#111813] font-bold px-6 py-3 rounded-xl hover:bg-primary-hover transition-colors">
                        Withdraw Funds
                    </button>
                    <button className="bg-[#111813] text-white font-bold px-6 py-3 rounded-xl border border-[#29382d] hover:bg-[#1c2920] transition-colors">
                        View Transaction History
                    </button>
                </div>
            </div> */}

        </div>
    );
};

export default Wallet;
