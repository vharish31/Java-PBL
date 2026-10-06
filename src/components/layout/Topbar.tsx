import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../store/AppContext';
import { NotificationPanel } from './NotificationPanel';
import { ThemeToggle } from '../ui/ThemeToggle';
import { 
  Menu, 
  Search, 
  Bell, 
  Calendar, 
  ChevronDown, 
  User, 
  Settings, 
  LogOut, 
  RotateCcw,
  Sparkles,
  Info,
  Moon,
  Sun
} from 'lucide-react';

interface TopbarProps {
  onToggleSidebar: () => void;
  sidebarOpen?: boolean;
}

export const Topbar: React.FC<TopbarProps> = ({ onToggleSidebar, sidebarOpen }) => {
  const { 
    user, 
    unreadNotifsCount, 
    setCurrentPage, 
    setIsAuthenticated, 
    isDemoMode, 
    setIsDemoMode,
    resetToDemoData,
    showToast,
    theme,
    toggleTheme
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const q = searchQuery.toLowerCase();
    if (q.includes('calc') || q.includes('car') || q.includes('travel')) {
      setCurrentPage('calculator');
    } else if (q.includes('goal')) {
      setCurrentPage('goals');
    } else if (q.includes('ai') || q.includes('insight') || q.includes('tip')) {
      setCurrentPage('ai-insights');
    } else if (q.includes('report') || q.includes('pdf')) {
      setCurrentPage('reports');
    } else if (q.includes('predic') || q.includes('forecast')) {
      setCurrentPage('predictions');
    } else {
      setCurrentPage('history');
    }
    showToast(`Searching for "${searchQuery}" in ${q.includes('calc') ? 'Calculator' : 'History'}`, 'info');
  };

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-8 bg-white dark:bg-[#070b14] border-b border-slate-200 dark:border-slate-800/80 transition-colors">
      {/* Left side: Menu toggle + Global Search */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          onClick={onToggleSidebar}
          className={`p-2 -ml-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors ${
            sidebarOpen ? 'lg:hidden' : 'flex'
          }`}
          aria-label={sidebarOpen ? "Close navigation bar" : "Open navigation bar"}
          title={sidebarOpen ? "Close navigation bar" : "Open navigation bar"}
        >
          <Menu className="w-5 h-5" />
        </button>

        <form onSubmit={handleSearchSubmit} className="relative w-full hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search activity, categories, goals, or AI tips..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 dark:bg-[#11192d] hover:bg-slate-100/80 dark:hover:bg-[#162038] focus:bg-white dark:focus:bg-[#11192d] text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-lg border border-slate-200 dark:border-slate-800 focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
          />
        </form>
      </div>

      {/* Right side items */}
      <div className="flex items-center gap-2 sm:gap-3.5">
        {/* Dark/Light Theme Switch */}
        <ThemeToggle />

        {/* Demo Data indicator */}
        <div className="flex items-center">
          {isDemoMode ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-[11px] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Demo Mode</span>
              <button
                onClick={resetToDemoData}
                title="Reset sample dataset"
                className="hover:text-emerald-950 dark:hover:text-emerald-100 p-0.5 rounded transition-colors ml-0.5"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-[11px] font-medium">
              <span>Live Mode</span>
            </div>
          )}
        </div>

        {/* Date Display */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
          <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
          <span>{formattedDate}</span>
        </div>

        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
              </span>
            )}
          </button>
          <NotificationPanel
            isOpen={showNotifications}
            onClose={() => setShowNotifications(false)}
          />
        </div>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

        {/* User Profile dropdown */}
        <div className="relative" ref={userRef}>
          <button
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center justify-center border border-emerald-200 dark:border-emerald-700">
              {user.name.charAt(0)}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-semibold text-slate-800 dark:text-slate-100 leading-tight">
                {user.name}
              </div>
              <div className="text-[10px] text-slate-400 dark:text-slate-500 leading-none">
                {user.country}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
          </button>

          {showUserDropdown && (
            <div className="absolute right-0 top-12 z-50 w-52 bg-white dark:bg-[#0b1120] rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 text-xs text-slate-700 dark:text-slate-200 animate-in fade-in duration-150">
              <div className="px-3.5 py-2 border-b border-slate-100 dark:border-slate-800">
                <p className="font-semibold text-slate-900 dark:text-slate-100">{user.name}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
              </div>

              <button
                onClick={() => {
                  setCurrentPage('settings');
                  setShowUserDropdown(false);
                }}
                className="w-full px-3.5 py-2 text-left hover:bg-slate-50 dark:hover:bg-[#162038] flex items-center gap-2 transition-colors"
              >
                <User className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                <span>Account Profile</span>
              </button>

              <button
                onClick={() => {
                  toggleTheme();
                  setShowUserDropdown(false);
                }}
                className="w-full px-3.5 py-2 text-left hover:bg-slate-50 dark:hover:bg-[#162038] flex items-center gap-2 transition-colors"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    <span>Switch to Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-slate-400" />
                    <span>Switch to Dark Mode</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  setCurrentPage('settings');
                  setShowUserDropdown(false);
                }}
                className="w-full px-3.5 py-2 text-left hover:bg-slate-50 dark:hover:bg-[#162038] flex items-center gap-2 transition-colors"
              >
                <Settings className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                <span>Preferences</span>
              </button>

              <button
                onClick={() => {
                  resetToDemoData();
                  setShowUserDropdown(false);
                }}
                className="w-full px-3.5 py-2 text-left hover:bg-slate-50 dark:hover:bg-[#162038] flex items-center gap-2 text-emerald-700 dark:text-emerald-400 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Reset Demo Data</span>
              </button>

              <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

              <button
                onClick={() => {
                  setIsAuthenticated(false);
                  setCurrentPage('landing');
                  setShowUserDropdown(false);
                  showToast('Signed out', 'info');
                }}
                className="w-full px-3.5 py-2 text-left hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center gap-2 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-500" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
