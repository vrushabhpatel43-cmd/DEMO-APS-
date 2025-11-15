
import React, { useState, useMemo } from 'react';
import type { DailyReport } from '../types';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { SecondaryButton } from './SecondaryButton';
import { AIFeature } from './AIFeature';


interface DashboardProps {
  reports: DailyReport[];
  role: 'telecaller' | 'manager';
}

type FilterType = 'today' | 'week' | 'month' | 'all';

interface TelecallerStat {
    callsDialed: number;
    callsConnected: number;
    projectsExplained: number;
    scheduledVisits: number;
    completedVisits: number;
    leads: number;
    reportCount: number;
}

const StatCard: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
    <div className="bg-slate-900 p-4 rounded-lg text-center shadow-md">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="text-2xl font-bold text-cyan-300">{value}</p>
    </div>
);

const FilterButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => {
    const baseClasses = "px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900";
    const activeClasses = "bg-cyan-500 text-white";
    const inactiveClasses = "bg-slate-700 text-slate-300 hover:bg-slate-600";
    return (
        <button onClick={onClick} className={`${baseClasses} ${active ? activeClasses : inactiveClasses}`}>
            {children}
        </button>
    );
};

export const Dashboard: React.FC<DashboardProps> = ({ reports, role }) => {
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredReports = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    return reports.filter(report => {
        const reportDate = new Date(report.date);
        switch (filter) {
            case 'today':
                return reportDate >= today;
            case 'week':
                return reportDate >= startOfWeek;
            case 'month':
                return reportDate >= startOfMonth;
            case 'all':
            default:
                return true;
        }
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [reports, filter]);

  const summaryStats = useMemo(() => {
    return filteredReports.reduce((acc, report) => {
        acc.callsDialed += report.callsDialed;
        acc.callsConnected += report.callsConnected;
        acc.projectsExplained += report.projectsExplained;
        acc.scheduledVisits += report.scheduledVisits.length;
        acc.completedVisits += report.completedVisits.length;
        acc.leads += report.leads.length;
        return acc;
    }, {
        callsDialed: 0,
        callsConnected: 0,
        projectsExplained: 0,
        scheduledVisits: 0,
        completedVisits: 0,
        leads: 0
    });
  }, [filteredReports]);
  
  const telecallerStats = useMemo(() => {
    if (role !== 'manager') return null;

    const initialStats: Record<string, TelecallerStat> = {};
    // FIX: The `reduce` accumulator is typed using a generic to ensure correct type inference.
    const statsByName = filteredReports.reduce<Record<string, TelecallerStat>>((acc, report) => {
        const name = report.telecallerName;
        if (!acc[name]) {
            acc[name] = {
                callsDialed: 0,
                callsConnected: 0,
                projectsExplained: 0,
                scheduledVisits: 0,
                completedVisits: 0,
                leads: 0,
                reportCount: 0,
            };
        }
        acc[name].callsDialed += report.callsDialed;
        acc[name].callsConnected += report.callsConnected;
        acc[name].projectsExplained += report.projectsExplained;
        acc[name].scheduledVisits += report.scheduledVisits.length;
        acc[name].completedVisits += report.completedVisits.length;
        acc[name].leads += report.leads.length;
        acc[name].reportCount += 1;
        return acc;
    }, initialStats);

    return Object.entries(statsByName)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a,b) => b.callsDialed - a.callsDialed);
  }, [filteredReports, role]);

  const chartData = useMemo(() => {
      type ChartDataPoint = { date: string; callsDialed: number; callsConnected: number, scheduledVisits: number };
      const initialChartData: Record<string, ChartDataPoint> = {};
      // FIX: The `reduce` accumulator is typed using a generic to ensure correct type inference.
      const reportsByDate = filteredReports.reduce<Record<string, ChartDataPoint>>((acc, report) => {
          const date = new Date(report.date).toLocaleDateString();
          if (!acc[date]) {
              acc[date] = { date, callsDialed: 0, callsConnected: 0, scheduledVisits: 0 };
          }
          acc[date].callsDialed += report.callsDialed;
          acc[date].callsConnected += report.callsConnected;
          acc[date].scheduledVisits += report.scheduledVisits.length;
          return acc;
      }, initialChartData);
      
      return Object.values(reportsByDate).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [filteredReports]);

  const handleExport = () => {
    const headers = [
      "Date", "Telecaller Name", "CP Firm", "Calls Dialed", "Calls Connected", 
      "Projects Explained", "Scheduled Visits", "Completed Visits", "Leads"
    ];
    const rows = reports.map(r => [
      new Date(r.date).toLocaleString(),
      `"${r.telecallerName}"`,
      `"${r.cpFirmDialingFor}"`,
      r.callsDialed,
      r.callsConnected,
      r.projectsExplained,
      r.scheduledVisits.length,
      r.completedVisits.length,
      r.leads.length
    ].join(','));

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `eod_reports_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (reports.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-slate-300">No Reports Yet</h2>
        <p className="text-slate-400 mt-2">Submit your first EOD report to see it here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-3xl font-bold text-cyan-300">Performance Dashboard</h2>
        {role === 'manager' && <SecondaryButton onClick={handleExport}>Export to CSV</SecondaryButton>}
      </div>
       <div className="flex justify-center gap-2 sm:gap-4 mt-4">
            <FilterButton active={filter === 'today'} onClick={() => setFilter('today')}>Today</FilterButton>
            <FilterButton active={filter === 'week'} onClick={() => setFilter('week')}>This Week</FilterButton>
            <FilterButton active={filter === 'month'} onClick={() => setFilter('month')}>This Month</FilterButton>
            <FilterButton active={filter === 'all'} onClick={() => setFilter('all')}>All Time</FilterButton>
        </div>

      <div>
        <h3 className="text-xl font-semibold text-purple-300 mb-3">{role === 'manager' ? 'Total Team Stats' : 'Your Total Stats'}</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <StatCard label="Total Dials" value={summaryStats.callsDialed} />
            <StatCard label="Total Connected" value={summaryStats.callsConnected} />
            <StatCard label="Total Explained" value={summaryStats.projectsExplained} />
            <StatCard label="Visits Scheduled" value={summaryStats.scheduledVisits} />
            <StatCard label="Visits Completed" value={summaryStats.completedVisits} />
            <StatCard label="New Leads" value={summaryStats.leads} />
        </div>
      </div>

      {role === 'manager' && (
        <div>
            <h3 className="text-xl font-semibold text-purple-300 mb-4 border-t border-slate-700 pt-6">AI Analyst</h3>
            <AIFeature reports={filteredReports} />
        </div>
      )}
      
       {role === 'manager' && chartData.length > 1 && (
         <div>
            <h3 className="text-xl font-semibold text-purple-300 mb-4 border-t border-slate-700 pt-6">Team Performance Over Time</h3>
            <div className="bg-slate-900 p-4 rounded-lg">
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                        <YAxis stroke="#9ca3af" fontSize={12} />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                        <Legend />
                        <Line type="monotone" dataKey="callsDialed" name="Calls Dialed" stroke="#22d3ee" strokeWidth={2} />
                        <Line type="monotone" dataKey="callsConnected" name="Connected" stroke="#a78bfa" strokeWidth={2}/>
                        <Line type="monotone" dataKey="scheduledVisits" name="Visits Scheduled" stroke="#f472b6" strokeWidth={2}/>
                    </LineChart>
                </ResponsiveContainer>
            </div>
         </div>
       )}

      {role === 'manager' && telecallerStats && (
        <div>
            <h3 className="text-xl font-semibold text-purple-300 mb-3 border-t border-slate-700 pt-6">Telecaller Leaderboard</h3>
            <div className="space-y-3 max-h-96 pr-2">
                 <div className="bg-slate-900 p-4 rounded-lg h-80">
                    <ResponsiveContainer width="100%" height="100%">
                         <BarChart data={telecallerStats} layout="vertical" margin={{ top: 5, right: 20, left: 50, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis type="number" stroke="#9ca3af" fontSize={12} />
                            <YAxis type="category" dataKey="name" stroke="#9ca3af" fontSize={12} width={100} />
                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                            <Legend />
                            <Bar dataKey="callsDialed" name="Calls Dialed" fill="#22d3ee" />
                            <Bar dataKey="callsConnected" name="Connected" fill="#a78bfa" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
      )}

      <div>
        <h3 className="text-xl font-semibold text-cyan-300 mb-3 border-t border-slate-700 pt-6">
            Report History ({filteredReports.length})
        </h3>
        <ul className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {filteredReports.length > 0 ? filteredReports.map(report => (
                <li key={report.date} className="p-4 bg-slate-800/50 rounded-md border border-slate-700">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-semibold text-white">
                                {new Date(report.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                            <p className="text-sm text-slate-400">
                                CP Firm: {report.cpFirmDialingFor}
                            </p>
                        </div>
                        {role === 'manager' && <p className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded-full">{report.telecallerName}</p>}
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs mt-2 text-slate-300">
                        <span>Dials: {report.callsDialed}</span>
                        <span>Connected: {report.callsConnected}</span>
                        <span>Scheduled: {report.scheduledVisits.length}</span>
                        <span>Completed: {report.completedVisits.length}</span>
                        <span>Leads: {report.leads.length}</span>
                    </div>
                </li>
            )) : (
                <p className="text-center text-slate-400 py-8">No reports found for this period.</p>
            )}
        </ul>
      </div>
    </div>
  );
};
