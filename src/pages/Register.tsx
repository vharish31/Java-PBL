import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { Leaf, Eye, EyeOff, Lock, Mail, User, ArrowRight, ShieldCheck, ArrowLeft } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { setCurrentPage, setIsAuthenticated, setUser, showToast } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    country: 'India',
    userType: 'individual' as const,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setUser({
        id: `usr_${Date.now()}`,
        name: formData.name || 'New Member',
        email: formData.email,
        country: formData.country,
        userType: formData.userType,
        unitPreference: 'metric',
        joinedDate: new Date().toISOString().split('T')[0],
        notificationsEnabled: true,
        weeklyDigest: true,
      });
      setIsAuthenticated(true);
      setCurrentPage('calculator');
      showToast('Account created! Welcome to CarbonWise AI', 'success');
    }, 450);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070b14] flex flex-col justify-center py-10 sm:px-6 lg:px-8 transition-colors relative selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Bar with Back Link & Dark Theme Switch */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between max-w-5xl mx-auto w-full">
        <button
          onClick={() => setCurrentPage('landing')}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 px-3 py-1.5 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </button>

        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md pt-6 sm:pt-0">
        <div 
          onClick={() => setCurrentPage('landing')}
          className="flex items-center justify-center gap-2.5 cursor-pointer mb-2.5 group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-600 group-hover:bg-emerald-700 text-white flex items-center justify-center shadow-xs transition-colors">
            <Leaf className="w-5 h-5" />
          </div>
          <span className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            CarbonWise <span className="text-emerald-600 dark:text-emerald-400">AI</span>
          </span>
        </div>
        <h2 className="text-center text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Create your sustainability account
        </h2>
        <p className="mt-1.5 text-center text-xs text-slate-500 dark:text-slate-400">
          Already have an account?{' '}
          <button
            onClick={() => setCurrentPage('login')}
            className="font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 underline"
          >
            Sign in here
          </button>
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white dark:bg-[#0b1120] py-8 px-6 sm:px-10 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm transition-colors">
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">Full Name</label>
              <div className="mt-1 relative rounded-lg">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Alex Morgan"
                  className="block w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-[#11192d] border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">Email Address</label>
              <div className="mt-1 relative rounded-lg">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="you@domain.com"
                  className="block w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-[#11192d] border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">Country</label>
                <div className="mt-1 relative rounded-lg">
                  <select
                    value={formData.country}
                    onChange={e => setFormData({ ...formData, country: e.target.value })}
                    className="block w-full px-2.5 py-2 text-xs border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-[#11192d] focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  >
                    <option value="India">India</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Germany">Germany</option>
                    <option value="Australia">Australia</option>
                    <option value="Canada">Canada</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">User Profile</label>
                <div className="mt-1 relative rounded-lg">
                  <select
                    value={formData.userType}
                    onChange={e => setFormData({ ...formData, userType: e.target.value as any })}
                    className="block w-full px-2.5 py-2 text-xs border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-[#11192d] focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  >
                    <option value="individual">Individual</option>
                    <option value="student">Student</option>
                    <option value="family">Family</option>
                    <option value="small_org">Small Org</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">Create Password</label>
              <div className="mt-1 relative rounded-lg">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  placeholder="At least 8 characters"
                  className="block w-full pl-9 pr-9 py-2 text-xs bg-slate-50 dark:bg-[#11192d] border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">Confirm Password</label>
              <div className="mt-1 relative rounded-lg">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Re-enter password"
                  className="block w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-[#11192d] border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center pt-1">
              <input
                id="terms"
                type="checkbox"
                required
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                className="h-3.5 w-3.5 text-emerald-600 focus:ring-emerald-500 border-slate-300 dark:border-slate-700 dark:bg-[#11192d] rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-[11px] text-slate-600 dark:text-slate-400 leading-tight">
                I agree to environmental data privacy practices & GHG calculation methodologies
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-xs text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 focus:outline-none transition-colors"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Get Started Free</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-2 text-[11px] text-slate-400 dark:text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Encrypted & secure storage</span>
          </div>
        </div>
      </div>
    </div>
  );
};
