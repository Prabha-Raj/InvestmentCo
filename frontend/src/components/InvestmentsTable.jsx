const InvestmentsTable = ({ investments }) => {
  const getPlanIcon = (plan) => {
    switch (plan.toLowerCase()) {
      case 'gold': return { icon: 'workspace_premium', color: 'text-yellow-400', bg: 'bg-yellow-400/10' };
      case 'silver': return { icon: 'verified', color: 'text-gray-300', bg: 'bg-gray-300/10' };
      default: return { icon: 'paid', color: 'text-primary', bg: 'bg-primary/10' };
    }
  };

  return (
    <table className="w-full text-left border-collapse">
      <thead className="text-xs text-text-secondary uppercase bg-[#29382d]/30 sticky top-0 backdrop-blur-sm">
        <tr>
          <th className="px-4 py-3 font-medium rounded-l-lg">Plan</th>
          <th className="px-4 py-3 font-medium">Date(s)</th>
          <th className="px-4 py-3 font-medium">Status</th>
          <th className="px-4 py-3 font-medium text-right rounded-r-lg">Amount</th>
        </tr>
      </thead>
      <tbody className="text-sm">
        {(!investments || investments.length === 0) ? (
          <tr>
            <td colSpan="4" className="px-4 py-8 text-center text-text-secondary">No investments found</td>
          </tr>
        ) : (
          investments.map((inv) => {
            const styles = getPlanIcon(inv.plan);
            return (
              <tr key={inv.id} className="hover:bg-[#29382d]/50 transition-colors border-b border-[#29382d]/30 last:border-0">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded ${styles.bg} ${styles.color}`}>
                      <span className="material-symbols-outlined text-lg">{styles.icon}</span>
                    </div>
                    <div>
                      <span className="text-white font-medium block capitalize">{inv.plan} Plan</span>
                      <span className="text-xs text-text-secondary">{inv.totalROIEarned ? `Earned: ₹${inv.totalROIEarned.toFixed(2)}` : 'Just started'}</span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-col text-xs text-text-secondary">
                    <span>Start: {new Date(inv.startDate).toLocaleDateString()}</span>
                    <span>End: {new Date(inv.endDate).toLocaleDateString()}</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${inv.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                    }`}>
                    {inv.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-right text-white font-bold">
                  ₹{inv.amount.toFixed(2)}
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );
};

export default InvestmentsTable;

