import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  NavigationPage, 
  UserProfile, 
  EmissionRecord, 
  EmissionFactorConfig, 
  Goal, 
  NotificationItem, 
  EcoScoreBreakdown 
} from '../types';
import { 
  INITIAL_USER, 
  INITIAL_NOTIFICATIONS, 
  DEFAULT_EMISSION_FACTORS 
} from '../data/mockData';
import { EmissionService } from '../services/emissionService';
import { GoalService } from '../services/goalService';
import { AnalyticsService } from '../services/analyticsService';

interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

interface AppContextType {
  currentPage: NavigationPage;
  setCurrentPage: (page: NavigationPage) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  user: UserProfile;
  setUser: (user: UserProfile) => void;
  isDemoMode: boolean;
  setIsDemoMode: (val: boolean) => void;
  records: EmissionRecord[];
  loadingRecords: boolean;
  emissionFactors: EmissionFactorConfig[];
  goals: Goal[];
  notifications: NotificationItem[];
  unreadNotifsCount: number;
  ecoScore: EcoScoreBreakdown;
  toasts: ToastMessage[];
  showToast: (message: string, type?: ToastMessage['type']) => void;
  dismissToast: (id: string) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  addEmissionRecord: (record: Omit<EmissionRecord, 'id' | 'createdAt'>) => Promise<EmissionRecord>;
  updateEmissionRecord: (id: string, updates: Partial<EmissionRecord>) => Promise<EmissionRecord>;
  deleteEmissionRecord: (id: string) => Promise<void>;
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt'>) => Promise<Goal>;
  updateGoal: (id: string, updates: Partial<Goal>) => Promise<Goal>;
  deleteGoal: (id: string) => Promise<void>;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  resetToDemoData: () => Promise<void>;
  clearAllUserData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<NavigationPage>('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('carbonwise_theme');
      if (stored === 'dark' || stored === 'light') return stored;
    }
    // Initially it should have light mode as requested
    return 'light';
  });

  // Apply theme to document element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('carbonwise_theme', theme);
  }, [theme]);

  const setTheme = (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState(prev => (prev === 'dark' ? 'light' : 'dark'));
  };
  const [records, setRecords] = useState<EmissionRecord[]>([]);
  const [loadingRecords, setLoadingRecords] = useState<boolean>(true);
  const [emissionFactors] = useState<EmissionFactorConfig[]>(DEFAULT_EMISSION_FACTORS);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Load records and goals
  useEffect(() => {
    const initData = async () => {
      setLoadingRecords(true);
      try {
        const [loadedRecords, loadedGoals] = await Promise.all([
          EmissionService.getRecords(),
          GoalService.getGoals(),
        ]);
        setRecords(loadedRecords);
        setGoals(loadedGoals);
      } catch (err) {
        console.error('Failed to load initial data', err);
      } finally {
        setLoadingRecords(false);
      }
    };
    initData();
  }, []);

  // Compute eco score
  const ecoScore = AnalyticsService.calculateEcoScore(records);

  // Toast helper
  const showToast = (message: string, type: ToastMessage['type'] = 'success') => {
    const id = `toast_${Date.now()}_${Math.random()}`;
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Add Record
  const addEmissionRecord = async (newRec: Omit<EmissionRecord, 'id' | 'createdAt'>) => {
    const saved = await EmissionService.addRecord(newRec);
    setRecords(prev => [saved, ...prev]);
    showToast(`Added ${saved.co2Emission} kg CO₂ (${saved.activity})`, 'success');
    return saved;
  };

  // Update Record
  const updateEmissionRecord = async (id: string, updates: Partial<EmissionRecord>) => {
    const updated = await EmissionService.updateRecord(id, updates);
    setRecords(prev => prev.map(r => (r.id === id ? updated : r)));
    showToast('Record updated successfully', 'info');
    return updated;
  };

  // Delete Record
  const deleteEmissionRecord = async (id: string) => {
    await EmissionService.deleteRecord(id);
    setRecords(prev => prev.filter(r => r.id !== id));
    showToast('Record removed', 'warning');
  };

  // Add Goal
  const addGoal = async (newGoal: Omit<Goal, 'id' | 'createdAt'>) => {
    const saved = await GoalService.createGoal(newGoal);
    setGoals(prev => [saved, ...prev]);
    showToast(`New goal created: ${saved.title}`, 'success');
    return saved;
  };

  // Update Goal
  const updateGoal = async (id: string, updates: Partial<Goal>) => {
    const updated = await GoalService.updateGoal(id, updates);
    setGoals(prev => prev.map(g => (g.id === id ? updated : g)));
    showToast('Goal updated', 'info');
    return updated;
  };

  // Delete Goal
  const deleteGoal = async (id: string) => {
    await GoalService.deleteGoal(id);
    setGoals(prev => prev.filter(g => g.id !== id));
    showToast('Goal deleted', 'warning');
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('All notifications marked as read', 'info');
  };

  const unreadNotifsCount = notifications.filter(n => !n.read).length;

  // Reset to Demo
  const resetToDemoData = async () => {
    const [recs, gls] = await Promise.all([
      EmissionService.resetToDemo(),
      GoalService.resetToDemo(),
    ]);
    setRecords(recs);
    setGoals(gls);
    setIsDemoMode(true);
    showToast('Reset to demo dataset successfully', 'info');
  };

  // Clear all data
  const clearAllUserData = async () => {
    await EmissionService.clearAll();
    setRecords([]);
    setIsDemoMode(false);
    showToast('All activity records cleared', 'warning');
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        isAuthenticated,
        setIsAuthenticated,
        user,
        setUser,
        isDemoMode,
        setIsDemoMode,
        records,
        loadingRecords,
        emissionFactors,
        goals,
        notifications,
        unreadNotifsCount,
        ecoScore,
        toasts,
        showToast,
        dismissToast,
        theme,
        setTheme,
        toggleTheme,
        addEmissionRecord,
        updateEmissionRecord,
        deleteEmissionRecord,
        addGoal,
        updateGoal,
        deleteGoal,
        markNotificationRead,
        markAllNotificationsRead,
        resetToDemoData,
        clearAllUserData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
