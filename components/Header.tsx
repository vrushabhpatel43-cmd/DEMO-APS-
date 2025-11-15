import React from 'react';
import type { User } from '../types';

interface HeaderProps {
  onShowForm: () => void;
  onShowDashboard: () => void;
  showDashboardButton: boolean;
  user: User | null;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onShowForm, onShowDashboard, showDashboardButton, user, onLogout }) => {
  const navButtonStyles = "px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900";

  if (!user) return null;

  return (
    <header className="relative text-center space-y-4">
      <div className="absolute top-0 right-0 text-right">
        <p className="text-slate-400 text-sm">Signed in as: <span className="font-semibold text-slate-300">{user.name}</span></p>
        <button onClick={onLogout} className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">Logout</button>
      </div>
      <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400 pt-10">
        Esto Arkis Versova
      </h1>
      <p className="text-lg text-slate-400">
        Log your daily progress and track your performance.
      </p>
      <nav className="flex justify-center gap-4">
        {user.role === 'telecaller' && (
           <button onClick={onShowForm} className={`${navButtonStyles} bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/40`}>
            New Report
          </button>
        )}
        {showDashboardButton && (
          <button onClick={onShowDashboard} className={`${navButtonStyles} bg-purple-500/20 text-purple-300 hover:bg-purple-500/40`}>
            Dashboard
          </button>
        )}
      </nav>
    </header>
  );
};