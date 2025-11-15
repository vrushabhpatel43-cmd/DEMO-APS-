
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { EodReportForm } from './components/StoryPromptForm';
import { ReportSummary } from './components/StoryDisplay';
import { Dashboard } from './components/Dashboard';
import { SplashScreen } from './components/SplashScreen';
import { Login } from './components/Login';
import type { DailyReport, User } from './types';
import { findUserByEmail } from './services/userService';

const App: React.FC = () => {
  const [view, setView] = useState<'form' | 'summary' | 'dashboard'>('form');
  const [reports, setReports] = useState<DailyReport[]>([]);
  const [currentReport, setCurrentReport] = useState<DailyReport | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showSplash, setShowSplash] = useState(true);

  // Load state from localStorage on initial mount
  useEffect(() => {
    try {
      const savedReports = localStorage.getItem('eodReports');
      const loggedInUserEmail = localStorage.getItem('loggedInUserEmail');

      if (loggedInUserEmail) {
        const user = findUserByEmail(loggedInUserEmail);
        if (user) {
          setCurrentUser(user);
        }
      }

      if (savedReports) {
        const parsedReports: DailyReport[] = JSON.parse(savedReports);
        setReports(parsedReports);
        if (parsedReports.length > 0) {
          setView('dashboard');
        }
      }
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
      localStorage.clear(); // Clear corrupted data
    }
  }, []);

  // Splash screen timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000); // Splash screen for 3 seconds
    return () => clearTimeout(timer);
  }, []);

  // Persist reports to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('eodReports', JSON.stringify(reports));
    } catch (error) {
      console.error("Failed to save reports to localStorage", error);
    }
  }, [reports]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('loggedInUserEmail', user.email);
    if (user.role === 'manager') {
      setView('dashboard');
    } else {
      setView('form');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('loggedInUserEmail');
  };

  const handleReportSubmit = (newReportData: Omit<DailyReport, 'date' | 'telecallerName'>) => {
    if (!currentUser || currentUser.role !== 'telecaller') {
        alert("Only telecallers can submit reports.");
        return;
    }
    const reportWithMeta: DailyReport = {
      ...newReportData,
      date: new Date().toISOString(),
      telecallerName: currentUser.name,
    };
    setReports(prev => [...prev, reportWithMeta]);
    setCurrentReport(reportWithMeta);
    setView('summary');
  };

  const handleShowForm = () => {
    setCurrentReport(null);
    setView('form');
  };

  const handleShowDashboard = () => {
    setCurrentReport(null);
    setView('dashboard');
  };

  const renderContent = () => {
    if (!currentUser) return null; // Should not happen if logic is correct
    
    const reportsForDashboard = currentUser.role === 'manager' 
      ? reports 
      : reports.filter(r => r.telecallerName === currentUser.name);

    switch (view) {
      case 'summary':
        return currentReport && <ReportSummary report={currentReport} onShowForm={handleShowForm} onShowDashboard={handleShowDashboard} />;
      case 'dashboard':
        return <Dashboard reports={reportsForDashboard} role={currentUser.role} />;
      case 'form':
      default:
        return currentUser.role === 'telecaller' ? <EodReportForm onSubmit={handleReportSubmit} /> : <div className="text-center p-8"><p className="text-slate-400">Managers can view the dashboard to see team performance.</p></div>;
    }
  };
  
  if (showSplash) {
    return <SplashScreen />;
  }

  if (!currentUser) {
    return <Login onLoginSuccess={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans flex flex-col items-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <Header 
          onShowForm={handleShowForm} 
          onShowDashboard={handleShowDashboard} 
          showDashboardButton={reports.length > 0} 
          user={currentUser}
          onLogout={handleLogout} 
        />
        <main className="mt-8">
          <div className="bg-slate-800/50 rounded-xl shadow-lg p-6 sm:p-8 border border-slate-700">
            {renderContent()}
          </div>
        </main>
        <footer className="text-center mt-12 text-slate-500 text-sm">
          <p>Designed for efficient daily reporting.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;