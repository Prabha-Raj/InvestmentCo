import { useAuth } from '../context/AuthContext';

const Settings = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-3xl font-black text-white tracking-tight">Settings</h2>
        <p className="text-text-secondary">Manage your profile and preferences.</p>
      </div>

      <div className="bg-surface-dark border border-[#29382d] rounded-xl p-6">
        <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">person</span>
          Profile Details
        </h3>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-text-secondary uppercase font-bold">Username</label>
              <p className="text-white bg-[#111813] px-3 py-2 rounded border border-[#29382d] mt-1">{user?.username}</p>
            </div>
            <div>
              <label className="text-xs text-text-secondary uppercase font-bold">Email</label>
              <p className="text-white bg-[#111813] px-3 py-2 rounded border border-[#29382d] mt-1">{user?.email}</p>
            </div>
          </div>

          <div>
            <label className="text-xs text-text-secondary uppercase font-bold">Referral Code</label>
            <p className="text-white bg-[#111813] px-3 py-2 rounded border border-[#29382d] mt-1 font-mono">{user?.referralCode}</p>
          </div>

          <div>
            <label className="text-xs text-text-secondary uppercase font-bold">Account Status</label>
            <div className="mt-1">
              <span className="bg-primary/20 text-primary px-3 py-1 rounded text-sm font-bold border border-primary/20">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
