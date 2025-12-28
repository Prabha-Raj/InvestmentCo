import { useState } from 'react';
import axios from 'axios';

const CreateInvestmentModal = ({ onClose, onSuccess }) => {
  const [amount, setAmount] = useState('');
  const [plan, setPlan] = useState('Basic');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const plans = [
    { name: 'Basic', dailyROI: 2, duration: 30 },
    { name: 'Premium', dailyROI: 3, duration: 45 },
    { name: 'Gold', dailyROI: 4, duration: 60 },
    { name: 'Platinum', dailyROI: 5, duration: 90 }
  ];

  const selectedPlan = plans.find(p => p.name === plan);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axios.post('/api/investment/create', {
        amount: parseFloat(amount),
        plan
      });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create investment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-surface-dark border border-[#29382d] rounded-2xl p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-white tracking-tight">New Investment</h2>
          <button onClick={onClose} className="text-text-secondary hover:text-white transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">error</span>
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">
              Investment Amount (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary material-symbols-outlined text-[20px]">currency_rupee</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                min="1"
                step="0.01"
                placeholder="0.00"
                className="w-full bg-[#111813] border border-[#29382d] text-white rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-gray-600 font-mono"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">
              Select Plan
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary material-symbols-outlined text-[20px]">rocket_launch</span>
              <select
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
                className="w-full bg-[#111813] border border-[#29382d] text-white rounded-xl py-3 pl-10 pr-10 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none cursor-pointer"
              >
                {plans.map((p) => (
                  <option key={p.name} value={p.name}>
                    {p.name} (ROI: {p.dailyROI}%)
                  </option>
                ))}
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary material-symbols-outlined pointer-events-none">expand_more</span>
            </div>
          </div>

          {selectedPlan && (
            <div className="bg-[#111813] border border-[#29382d] rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-text-secondary">Daily ROI</span>
                <span className="text-primary font-bold">{selectedPlan.dailyROI}%</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-text-secondary">Duration</span>
                <span className="text-white font-bold">{selectedPlan.duration} Days</span>
              </div>
              <div className="pt-3 border-t border-[#29382d] flex justify-between items-center">
                <span className="text-text-secondary font-medium">Estimated Returns</span>
                <span className="text-primary font-bold text-lg">
                  ₹{(amount ? (parseFloat(amount) * selectedPlan.dailyROI * selectedPlan.duration / 100) : 0).toFixed(2)}
                </span>
              </div>
            </div>
          )}

          <div className="flex gap-4 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-[#111813] border border-[#29382d] text-white font-bold rounded-xl hover:bg-[#1c2920] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-primary hover:bg-primary-hover text-[#111813] font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(25,230,77,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="size-4 border-2 border-[#111813] border-t-transparent rounded-full animate-spin"></span>
                  Processing...
                </>
              ) : (
                'Confirm Investment'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateInvestmentModal;

