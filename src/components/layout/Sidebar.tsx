import React from 'react';
import { useApp } from '../../store/AppContext';
import { NavigationPage } from '../../types';
import { 
  LayoutDashboard, 
  Calculator, 
  History, 
  BarChart3, 
  Sparkles, 
  Target, 
  Award, 
  TrendingUp, 
  FileText, 
  Settings, 
  HelpCircle, 
  LogOut, 
  Leaf,
  X
} from 'lucide-react';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const { currentPage, setCurrentPage, setIsAuthenticated, showToast } = useApp();

  const navItems: { page: NavigationPage; label: string; icon: React.ReactNode; badge?: string }[] = [
    { page: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { page: 'calculator', label: 'Carbon Calculator', icon: <Calculator className="w-4 h-4" /> },
    { page: 'history', label: 'Emission History', icon: <History className="w-4 h-4" /> },
    { page: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { page: 'ai-insights', label: 'AI Insights', icon: <Sparkles className="w-4 h-4" />, badge: 'AI' },
    { page: 'goals', label: 'Goals', icon: <Target className="w-4 h-4" /> },
    { page: 'eco-score', label: 'Eco Score', icon: <Award className="w-4 h-4" /> },
    { page: 'predictions', label: 'Predictions', icon: <TrendingUp className="w-4 h-4" />, badge: 'ML' },
    { page: 'reports', label: 'Reports', icon: <FileText className="w-4 h-4" /> },
  ];

  const bottomItems: { page: NavigationPage; label: string; icon: React.ReactNode }[] = [
    { page: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
    { page: 'help', label: 'Help & About', icon: <HelpCircle className="w-4 h-4" /> },
  ];

  const handleNavClick = (page: NavigationPage) => {
    setCurrentPage(page);
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('landing');
    showToast('Logged out successfully', 'info');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-xs lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col w-64 bg-white border-r border-slate-200 transition-transform duration-200 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-slate-100">
          <div 
            onClick={() => handleNavClick('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-600 text-white shadow-xs group-hover:bg-emerald-700 transition-colors">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900 text-sm tracking-tight">CarbonWise</span>
                <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">AI</span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide">Measure • Understand • Reduce</p>
            </div>
          </div>

          {/* Close button: always shown on all screen sizes */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors flex items-center justify-center"
            aria-label="Close navigation bar"
            title="Close navigation bar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Primary Navigation List */}
        <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Platform Menu
          </div>
          {navItems.map(item => {
            const isActive = currentPage === item.page;
            return (
              <button
                key={item.page}
                onClick={() => handleNavClick(item.page)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-emerald-600' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-emerald-100 text-emerald-800 uppercase tracking-wide">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Utility Items */}
        <div className="p-3 border-t border-slate-100 space-y-1 bg-slate-50/50">
          <div className="px-3 pb-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Support & Account
          </div>
          {bottomItems.map(item => {
            const isActive = currentPage === item.page;
            return (
              <button
                key={item.page}
                onClick={() => handleNavClick(item.page)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span className={isActive ? 'text-emerald-600' : 'text-slate-400'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-rose-50 hover:text-rose-700 transition-colors"
          >
            <LogOut className="w-4 h-4 text-slate-400 group-hover:text-rose-600" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
