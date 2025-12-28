import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        toast.success('Login Successful! Redirecting...');
        navigate('/dashboard');
      } else {
        toast.error(result.message || 'Login Failed');
      }
    } catch (error) {
      toast.error(error.message || 'Login Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background-dark font-display">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20 z-0"></div>
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[100px] animate-float"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[100px] animate-float" style={{ animationDelay: '-10s' }}></div>

      <div className="w-full max-w-md p-8 relative z-10">
        <div className="bg-surface-dark/80 backdrop-blur-xl border border-[#29382d] rounded-2xl p-8 shadow-2xl animate-glow">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center size-12 rounded-xl bg-primary/20 text-primary mb-4">
              <span className="material-symbols-outlined text-3xl">savings</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">Welcome Back</h1>
            <p className="text-text-secondary mt-2">Sign in to access your investment portfolio</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary material-symbols-outlined text-[20px]">mail</span>
                <input
                  type="email"
                  required
                  className="w-full bg-[#111813] border border-[#29382d] text-white rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-gray-600"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Password</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary material-symbols-outlined text-[20px]">lock</span>
                <input
                  type="password"
                  required
                  className="w-full bg-[#111813] border border-[#29382d] text-white rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-gray-600"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-hover text-[#111813] font-bold py-3.5 rounded-xl transition-all transform hover:scale-[1.02] shadow-[0_0_20px_rgba(25,230,77,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="size-5 border-2 border-[#111813] border-t-transparent rounded-full animate-spin"></span>
                  Signing In...
                </>
              ) : (
                'Sign In to Dashboard'
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-text-secondary text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-bold hover:underline">
              Create Account
            </Link>
          </p>
        </div>

        <p className="text-center text-gray-600 text-xs mt-8">
          © {new Date().getFullYear()} InvestmentCo. Secure & Encrypted.
        </p>
      </div>
    </div>
  );
};

export default Login;

