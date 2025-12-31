import { useState, useEffect } from 'react';
import axiosInstance from '../config/axiosConfig';
import ReferralTree from '../components/ReferralTree';
import { useAuth } from '../context/AuthContext';

const Referral = () => {
    const { user } = useAuth();
    const [tree, setTree] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTree = async () => {
            try {
                const response = await axiosInstance.get('/api/referral/tree');
                setTree(response.data.tree);
            } catch (error) {
                console.error('Error fetching tree:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchTree();
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-black text-white tracking-tight">Referral Network</h2>
                <p className="text-text-secondary">Visualize and manage your team.</p>
            </div>

            {/* Referral Link Card */}
            <div className="bg-gradient-to-br from-[#1c2920] to-[#111813] border border-primary/30 rounded-xl p-6 shadow-lg shadow-primary/5 max-w-xl">
                <div className="flex items-center gap-2 mb-2 text-primary">
                    <span className="material-symbols-outlined">share</span>
                    <h3 className="font-bold">Referral Link</h3>
                </div>
                <p className="text-text-secondary text-sm mb-4">Share this link to earn 5% level income.</p>
                <div className="flex gap-2">
                    <div className="flex-1 bg-black/30 rounded-lg border border-[#29382d] px-3 py-2 text-sm text-text-secondary truncate font-mono select-all">
                        {user?.referralCode || 'CODE'}
                    </div>
                    <button
                        onClick={() => navigator.clipboard.writeText(user?.referralCode)}
                        className="bg-primary hover:bg-primary-hover text-[#111813] rounded-lg px-3 flex items-center justify-center transition-colors"
                    >
                        <span className="material-symbols-outlined text-lg">content_copy</span>
                    </button>
                </div>
            </div>

            <div className="bg-surface-dark border border-[#29382d] rounded-xl p-6">
                {loading ? (
                    <div className="text-center text-text-secondary">Loading network...</div>
                ) : (
                    <ReferralTree tree={tree} />
                )}
            </div>
        </div>
    );
};

export default Referral;
