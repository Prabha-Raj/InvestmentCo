import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../config/axiosConfig';
import StatsCard from '../components/StatsCard';
import InvestmentsTable from '../components/InvestmentsTable';
import ROIChat from '../components/ROIChart';
import ReferralTree from '../components/ReferralTree';
import CreateInvestmentModal from '../components/CreateInvestmentModal';

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [referralTree, setReferralTree] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchDashboardData();
    fetchReferralTree();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axiosInstance.get('/api/dashboard');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReferralTree = async () => {
    try {
      const response = await axiosInstance.get('/api/referral/tree');
      setReferralTree(response.data.tree);
    } catch (error) {
      console.error('Error fetching referral tree:', error);
    }
  };

  const handleInvestmentCreated = () => {
    fetchDashboardData();
    setShowModal(false);
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-xl font-bold animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-8">

      {/* Heading & Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl md:text-3xl font-black text-white tracking-tight">Welcome back, {user?.username}</h2>
          <p className="text-text-secondary">Here is your financial overview for today.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-hover text-[#111813] font-bold rounded-lg transition-colors shadow-[0_0_15px_rgba(25,230,77,0.3)]"
          >
            <span className="material-symbols-outlined text-[20px]">add_circle</span>
            <span>Invest Now</span>
          </button>
          <button className="flex items-center gap-2 px-6 py-2.5 bg-[#29382d] hover:bg-[#35473a] text-white font-bold rounded-lg transition-colors border border-white/10">
            <span className="material-symbols-outlined text-[20px]">payments</span>
            <span>Withdraw</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard
          title="Total Investment"
          value={`₹${dashboardData?.totalInvestments?.toFixed(2) || '0.00'}`}
          type="primary"
          icon="monetization_on"
          trend="+5.2%"
        />
        <StatsCard
          title="Daily ROI"
          value={`₹${dashboardData?.dailyROI?.toFixed(2) || '0.00'}`}
          type="blue"
          icon="percent"
          trend="Stable"
        />
        <StatsCard
          title="Level Income"
          value={`₹${dashboardData?.levelIncome?.toFixed(2) || '0.00'}`}
          type="purple"
          icon="group_add"
          trend="+12.4%"
        />
        <StatsCard
          title="Wallet Balance"
          value={`₹${dashboardData?.balance?.toFixed(2) || '0.00'}`}
          type="white"
          icon="account_balance_wallet"
          trend="+2.1%"
        />
      </div>

      {/* Main Grid Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Chart + Tree) */}
        <div className="lg:col-span-2 flex flex-col gap-6">

          {/* Earnings Chart Area */}
          <div className="bg-surface-dark border border-[#29382d] rounded-xl p-6 flex flex-col h-[400px]">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-white font-bold text-lg">Earnings Performance</h3>
                <p className="text-text-secondary text-sm">ROI vs Referral Income (Last 7 Days)</p>
              </div>
              <select className="bg-[#29382d] text-white text-sm rounded-lg border-none focus:ring-1 focus:ring-primary px-3 py-1.5 cursor-pointer outline-none">
                <option>Last 7 Days</option>
              </select>
            </div>
            <ROIChat dashboardData={dashboardData} />
          </div>

          {/* Nested Referral Tree Widget */}
          <div className="bg-surface-dark border border-[#29382d] rounded-xl p-6 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white font-bold text-lg">My Network</h3>
            </div>
            <ReferralTree tree={referralTree} />
          </div>
        </div>

        {/* Right Column (Link + Transactions) */}
        <div className="lg:col-span-1 flex flex-col gap-6">

          {/* Referral Link Card */}
          <div className="bg-gradient-to-br from-[#1c2920] to-[#111813] border border-primary/30 rounded-xl p-6 shadow-lg shadow-primary/5">
            <div className="flex items-center gap-2 mb-2 text-primary">
              <span className="material-symbols-outlined">share</span>
              <h3 className="font-bold">Referral Link</h3>
            </div>
            <p className="text-text-secondary text-sm mb-4">Share this link to earn 5% level income.</p>
            <div className="flex gap-2">
              <div className="flex-1 bg-black/30 rounded-lg border border-[#29382d] px-3 py-2 text-sm text-text-secondary truncate font-mono select-all">
                {user?.referralCode || 'CODE'}
              </div>
              <button className="bg-primary hover:bg-primary-hover text-[#111813] rounded-lg px-3 flex items-center justify-center transition-colors">
                <span className="material-symbols-outlined text-lg">content_copy</span>
              </button>
            </div>
          </div>

          {/* Recent Activity Table (Replacing InvestmentsTable logic) */}
          <div className="bg-surface-dark border border-[#29382d] rounded-xl p-0 flex flex-col flex-1 overflow-hidden min-h-[400px]">
            <div className="p-5 border-b border-[#29382d]">
              <h3 className="text-white font-bold text-lg">Active Investments</h3>
            </div>
            <div className="overflow-y-auto max-h-[500px] p-2">
              <InvestmentsTable investments={dashboardData?.investments || []} />
            </div>
          </div>
        </div>

      </div> {/* End Grid */}

      {showModal && (
        <CreateInvestmentModal
          onClose={() => setShowModal(false)}
          onSuccess={handleInvestmentCreated}
        />
      )}
    </div>
  );
};

export default Dashboard;
