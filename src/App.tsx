import React, { useState } from 'react';
import { AppProvider, useApp } from './store/AppContext';
import { ToastContainer } from './components/ui/ToastContainer';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';

// Page Imports
import { LandingPage } from './pages/Landing';
import { LoginPage } from './pages/Login';
import { RegisterPage } from './pages/Register';
import { DashboardPage } from './pages/Dashboard';
import { CalculatorPage } from './pages/Calculator';
import { HistoryPage } from './pages/History';
import { AnalyticsPage } from './pages/Analytics';
import { AIInsightsPage } from './pages/AIInsights';
import { GoalsPage } from './pages/Goals';
import { EcoScorePage } from './pages/EcoScore';
import { PredictionsPage } from './pages/Predictions';
import { ReportsPage } from './pages/Reports';
import { SettingsPage } from './pages/Settings';
import { HelpPage } from './pages/Help';

const AppContent: React.FC = () => {
  const { currentPage } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Unauthenticated / Standalone views
  if (currentPage === 'landing') {
    return (
      <>
        <LandingPage />
        <ToastContainer />
      </>
    );
  }

  if (currentPage === 'login') {
    return (
      <>
        <LoginPage />
        <ToastContainer />
      </>
    );
  }

  if (currentPage === 'register') {
    return (
      <>
        <RegisterPage />
        <ToastContainer />
      </>
    );
  }

  // App Shell Layout for Dashboard & Features
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'calculator':
        return <CalculatorPage />;
      case 'history':
        return <HistoryPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'ai-insights':
        return <AIInsightsPage />;
      case 'goals':
        return <GoalsPage />;
      case 'eco-score':
        return <EcoScorePage />;
      case 'predictions':
        return <PredictionsPage />;
      case 'reports':
        return <ReportsPage />;
      case 'settings':
        return <SettingsPage />;
      case 'help':
        return <HelpPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070b14] flex text-slate-800 dark:text-slate-100 antialiased selection:bg-emerald-100 selection:text-emerald-900 dark:selection:bg-emerald-900 dark:selection:text-emerald-200 transition-colors">
      {/* Sidebar Navigation */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-200 ${sidebarOpen ? 'lg:pl-64' : 'pl-0'}`}>
        <Topbar 
          onToggleSidebar={() => setSidebarOpen(prev => !prev)} 
          sidebarOpen={sidebarOpen}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderCurrentPage()}
        </main>
      </div>

      {/* Global Toast System */}
      <ToastContainer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
