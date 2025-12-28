import { useState, useEffect } from 'react';
import axios from 'axios';
import InvestmentsTable from '../components/InvestmentsTable';
import CreateInvestmentModal from '../components/CreateInvestmentModal';

const Investments = () => {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchInvestments();
  }, []);

  const fetchInvestments = async () => {
    try {
      const response = await axios.get('/api/dashboard');
      // Assuming the dashboard endpoint returns investments. 
      // Ideally we would have a dedicated /api/investments endpoint, but I will use dashboard for now to avoid side-tracking.
      setInvestments(response.data.investments || []);
    } catch (error) {
      console.error('Error fetching investments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInvestmentCreated = () => {
    fetchInvestments();
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Investments</h2>
          <p className="text-text-secondary">Manage and track your active plans.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-hover text-[#111813] font-bold rounded-lg transition-colors shadow-[0_0_15px_rgba(25,230,77,0.3)]"
        >
          <span className="material-symbols-outlined text-[20px]">add_circle</span>
          <span>New Investment</span>
        </button>
      </div>

      <div className="bg-surface-dark border border-[#29382d] rounded-xl p-0 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-text-secondary">Loading investments...</div>
        ) : (
          <InvestmentsTable investments={investments} />
        )}
      </div>

      {showModal && (
        <CreateInvestmentModal
          onClose={() => setShowModal(false)}
          onSuccess={handleInvestmentCreated}
        />
      )}
    </div>
  );
};

export default Investments;
